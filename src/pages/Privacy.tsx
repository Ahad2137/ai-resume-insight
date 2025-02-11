
import React from 'react';
import Navbar from '@/components/Navbar';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-6">
              When you use our resume analysis service, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Resume content you upload</li>
              <li>Basic usage information</li>
              <li>Technical information about your device</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-6">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Provide resume analysis services</li>
              <li>Improve our AI algorithms</li>
              <li>Ensure service security</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">Data Protection</h2>
            <p className="text-gray-600 mb-6">
              We implement various security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits</li>
              <li>Limited access to personal information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
