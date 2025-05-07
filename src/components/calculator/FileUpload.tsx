
import { Upload } from "lucide-react";

interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
}

export const FileUpload = ({ 
  fileInputRef, 
  fileName, 
  handleFileUpload, 
  triggerFileUpload 
}: FileUploadProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="file-upload">Upload Payment Data</label>
        {fileName && <span className="text-sm text-green-600">{fileName}</span>}
      </div>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={triggerFileUpload}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".csv,.xlsx,.xls"
        />
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Drag and drop your payment data file, or <span className="text-shopify-blue">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports CSV, Excel (.xlsx, .xls)
        </p>
      </div>
    </div>
  );
};
