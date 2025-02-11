
import React from 'react';
import Navbar from '@/components/Navbar';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              By using our service, you agree to these terms. Please read them carefully.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Service Usage</h2>
            <p className="text-gray-600 mb-6">
              Our resume analysis service is provided "as is" and is subject to the following terms:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>You must only upload resumes you have permission to analyze</li>
              <li>You agree not to misuse or attempt to exploit our service</li>
              <li>We reserve the right to modify or terminate the service at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Limitations</h2>
            <p className="text-gray-600 mb-6">
              While we strive to provide accurate analysis:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Results are provided as suggestions only</li>
              <li>We don't guarantee employment outcomes</li>
              <li>Service availability may vary</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              Our service, including all software, algorithms, and content, is protected by intellectual property laws:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>You retain rights to your resume content</li>
              <li>Our analysis and feedback remain our property</li>
              <li>You may not copy or redistribute our service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
