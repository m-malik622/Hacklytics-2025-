import  { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner"

const TextEmailEditor = () => {
  const [mainText, setMainText] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mainText);
      toast("Copied!", {
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy" );
    }
  };

  const handleEmail = () => {
    if (!emailAddress) {
      toast.error("Please enter an email address");
      return;
    }
    
    const mailtoLink = `mailto:${emailAddress}?body=${encodeURIComponent(mainText)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Text</label>
        <Textarea
          value={mainText}
          onChange={(e) => setMainText(e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[200px]"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <Textarea
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="Enter email address..."
          className="min-h-[40px] resize-none"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button
          onClick={handleCopy}
          className="flex items-center"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>
        
        <Button
          onClick={handleEmail}
          variant="default"
          className="flex items-center"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Button>
      </div>
    </div>
  );
};

export default TextEmailEditor;