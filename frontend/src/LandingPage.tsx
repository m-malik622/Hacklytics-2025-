import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Smile } from "lucide-react";

interface LandingPageProps {
  setIsApp: (value: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setIsApp }) => {
  const handleGetStarted = (): void => {
    setIsApp(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-24 px-6 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-8">
            Build something amazing with our platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, deploy, and scale your applications with our powerful tools and intuitive interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Deploy your applications in seconds with our optimized infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                Experience unmatched speed and performance with our cutting-edge technology stack.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Secure by Default</CardTitle>
                <CardDescription>
                  Enterprise-grade security protecting your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                Rest easy knowing your applications are protected by industry-leading security measures.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smile className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>
                  Intuitive interface for developers of all skill levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                Get started quickly with our user-friendly platform and comprehensive documentation.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers building amazing applications.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;