
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  summary: string;
  strengths: string[];
  improvements: string[];
  keywords: string[];
}

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeResume = async (fileUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { fileUrl }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${uploadedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Analyze the resume
      const analysisResult = await analyzeResume(publicUrl);
      setAnalysis(analysisResult);

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
            {isAnalyzing ? (
              <Loader2 className="h-12 w-12 text-accent animate-spin" />
            ) : file ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-float" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {isAnalyzing 
                ? 'Analyzing your resume...'
                : file 
                  ? file.name 
                  : 'Drop your resume here'}
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

      {file && !isAnalyzing && (
        <div className="mt-4 p-4 bg-secondary rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setAnalysis(null);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {analysis && (
        <div className="mt-8 space-y-6 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <p className="text-gray-600">{analysis.summary}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Strengths</h3>
            <ul className="list-disc list-inside space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-600">{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Suggested Improvements</h3>
            <ul className="list-disc list-inside space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-gray-600">{improvement}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Key Skills & Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
