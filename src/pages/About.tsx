
import React from 'react';
import Navbar from '@/components/Navbar';
import { Bot, Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">About Us</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 text-lg mb-12 text-center">
            We're dedicated to helping job seekers optimize their resumes using cutting-edge AI technology.
            Our platform provides instant, actionable feedback to improve your chances of landing your dream job.
          </p>

          <div className="grid gap-8">
            {[
              {
                icon: Bot,
                title: "Advanced AI Technology",
                description: "Our AI system analyzes thousands of successful resumes to provide you with the best recommendations."
              },
              {
                icon: Target,
                title: "Focused on Results",
                description: "We help you create a resume that stands out to both human recruiters and ATS systems."
              },
              {
                icon: Shield,
                title: "Privacy & Security",
                description: "Your data security is our top priority. We use enterprise-grade encryption to protect your information."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 p-6 bg-white rounded-xl shadow-sm">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
