
import React from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { Bot } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-8 animate-float">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Free Resume Review</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 max-w-3xl mx-auto leading-tight">
            Elevate Your Resume with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-500 animate-shine"> AI Analysis</span>
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Get instant, personalized feedback on your resume from our advanced AI. 
            Stand out to employers and land your dream job.
          </p>

          {/* File Upload Section */}
          <div className="mb-20">
            <FileUpload />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Instant Analysis",
                description: "Get detailed feedback in seconds"
              },
              {
                title: "AI-Powered Insights",
                description: "Advanced algorithms analyze your resume"
              },
              {
                title: "Privacy First",
                description: "Your data is secure and confidential"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-accent/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
