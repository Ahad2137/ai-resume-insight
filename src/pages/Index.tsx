
import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Resume Analyzer</h1>
        <p className="text-gray-600 text-center mb-8">
          Upload your resume to get instant feedback and analysis
        </p>
        <FileUpload />
      </div>
    </div>
  );
};

export default Index;
