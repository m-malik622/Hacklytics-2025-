import cv2
import numpy as np
from paddleocr import PaddleOCR
from transformers import LayoutLMv2Processor, LayoutLMv2ForSequenceClassification
from transformers import TableQuestionAnsweringPipeline, AutoModelForTableQuestionAnswering
import re
from PIL import Image

class MedicalBillAnalyzer:
    def __init__(self):
        # Initialize OCR
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
        
        # Initialize LayoutLM
        self.layout_processor = LayoutLMv2Processor.from_pretrained("microsoft/layoutlmv2-base-uncased")
        self.layout_model = LayoutLMv2ForSequenceClassification.from_pretrained("microsoft/layoutlmv2-base-uncased")
        
        # Initialize Table QA model
        self.table_model = AutoModelForTableQuestionAnswering.from_pretrained("google/tapas-base-finetuned-wtq")
        self.table_qa = TableQuestionAnsweringPipeline(model=self.table_model)

    def preprocess_image(self, image_path):
        """Preprocess the image for better OCR results"""
        # Read image
        image = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to preprocess the image
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Apply dilation to connect text components
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        gray = cv2.dilate(gray, kernel, iterations=1)
        
        return gray

    def extract_text(self, preprocessed_image):
        """Extract text using PaddleOCR"""
        result = self.ocr.ocr(preprocessed_image)
        
        # Extract text and positions
        text_blocks = []
        for line in result:
            for word in line:
                position = word[0]  # Contains coordinates
                text = word[1][0]   # Contains actual text
                confidence = word[1][1]  # Contains confidence score
                text_blocks.append({
                    'text': text,
                    'position': position,
                    'confidence': confidence
                })
        
        return text_blocks

    def analyze_layout(self, image, text_blocks):
        """Analyze document layout using LayoutLM"""
        # Convert image to PIL
        image = Image.fromarray(image)
        
        # Prepare inputs for LayoutLM
        words = [block['text'] for block in text_blocks]
        boxes = [self._normalize_box(block['position']) for block in text_blocks]
        
        # Encode inputs
        encoding = self.layout_processor(image, words, boxes=boxes, return_tensors="pt")
        
        # Get layout predictions
        outputs = self.layout_model(**encoding)
        
        return outputs

    def extract_procedures_costs(self, text_blocks):
        """Extract procedures and their associated costs"""
        procedures = []
        
        # Pattern for cost matching (assumes USD format)
        cost_pattern = r'\$?\d+(?:,\d{3})*(?:\.\d{2})?'
        
        for i, block in enumerate(text_blocks):
            text = block['text']
            
            # Look for cost pattern
            cost_match = re.search(cost_pattern, text)
            if cost_match:
                cost = cost_match.group()
                
                # Look for procedure description in previous text block
                if i > 0:
                    procedure_text = text_blocks[i-1]['text']
                    procedures.append({
                        'procedure': procedure_text,
                        'cost': cost
                    })

        return procedures

    def _normalize_box(self, box):
        """Helper function to normalize bounding box coordinates"""
        return [
            int(box[0][0]), int(box[0][1]),  # top left
            int(box[1][0]), int(box[1][1]),  # top right
            int(box[2][0]), int(box[2][1]),  # bottom right
            int(box[3][0]), int(box[3][1])   # bottom left
        ]

    def process_bill(self, image_path):
        """Main pipeline to process a medical bill"""
        # Step 1: Preprocess the image
        preprocessed_image = self.preprocess_image(image_path)
        
        # Step 2: Extract text using OCR
        text_blocks = self.extract_text(preprocessed_image)
        
        # Step 3: Analyze layout
        layout_analysis = self.analyze_layout(preprocessed_image, text_blocks)
        
        # Step 4: Extract procedures and costs
        procedures_costs = self.extract_procedures_costs(text_blocks)
        
        return {
            'text_blocks': text_blocks,
            'procedures_costs': procedures_costs
        }

# Example usage
if __name__ == "__main__":
    analyzer = MedicalBillAnalyzer()
    results = analyzer.process_bill('./medicalBillExamples/11names.jpg')
    
    # Print results
    print("\nExtracted Procedures and Costs:")
    for item in results['procedures_costs']:
        print(f"Procedure: {item['procedure']}")
        print(f"Cost: {item['cost']}\n")