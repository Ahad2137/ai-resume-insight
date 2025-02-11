
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }
    setFile(uploadedFile);
    toast({
      title: "File uploaded successfully",
      description: "Your resume is ready for analysis"
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-xl 
          border-2 border-dashed transition-colors duration-200
          p-8 text-center cursor-pointer
          ${isDragActive 
            ? 'border-accent bg-accent/5' 
            : 'border-gray-200 hover:border-accent/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {file ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-float" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {file ? file.name : 'Drop your resume here'}
            </p>
            <p className="text-sm text-gray-500">
              {file 
                ? 'Click or drag to replace' 
                : 'or click to select a PDF file'
              }
            </p>
          </div>
        </div>
      </div>
      {file && (
        <div className="mt-4 p-4 bg-secondary rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
