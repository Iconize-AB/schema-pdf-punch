import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PDFUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const removeFile = () => {
    onFileSelect(null as any);
  };

  if (selectedFile) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ai/10">
              <FileText className="h-5 w-5 text-ai" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-8 bg-gradient-card border-border/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-card",
      isDragActive && "border-ai shadow-ai scale-105"
    )}>
      <div {...getRootProps()} className="text-center">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-4 rounded-full transition-all duration-300",
            isDragActive ? "bg-ai/20 animate-pulse-ai" : "bg-muted/50"
          )}>
            <Upload className={cn(
              "h-8 w-8 transition-colors duration-300",
              isDragActive ? "text-ai" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragActive ? "Drop your PDF here" : "Upload PDF Document"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your PDF file or click to browse
            </p>
            <Button variant="ai-outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};