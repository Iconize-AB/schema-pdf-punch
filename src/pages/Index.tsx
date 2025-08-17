import React, { useState } from 'react';
import { Bot, FileText, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PDFUpload } from '@/components/PDFUpload';
import { SchemaBuilder, SchemaField } from '@/components/SchemaBuilder';
import { ProcessingStatus, ProcessingStep } from '@/components/ProcessingStatus';
import { DataPreview } from '@/components/DataPreview';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('analyzing');
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState('upload');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockExtractedData = [
    {
      'Invoice Number': 'INV-2024-001',
      'Company Name': 'Acme Corporation',
      'Total Amount': 1250.00,
      'Date': '2024-01-15',
      confidence: 0.95
    },
    {
      'Invoice Number': 'INV-2024-002', 
      'Company Name': 'Beta Industries',
      'Total Amount': 875.50,
      'Date': '2024-01-16',
      confidence: 0.87
    },
    {
      'Invoice Number': 'INV-2024-003',
      'Company Name': 'Gamma Systems',
      'Total Amount': 2100.00,
      'Date': '2024-01-17',
      confidence: 0.92
    }
  ];

  const processWithAI = async () => {
    if (!selectedFile || schema.length === 0) {
      toast({
        title: "Missing Requirements",
        description: "Please upload a PDF and define at least one schema field.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentTab('processing');
    setProgress(0);

    try {
      // Step 1: Analyzing
      setProcessingStep('analyzing');
      setProgress(25);
      
      // Convert PDF to base64
      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedFile);
      });

      // Step 2: Extracting
      setProcessingStep('extracting');
      setProgress(50);

      // Call Supabase Edge Function for AI processing
      const response = await fetch('https://id-preview--2871f5cc-5bf2-4f50-beef-94b001731a9c.supabase.co/functions/v1/extract-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkLXByZXZpZXctLTI4NzFmNWNjLTViZjItNGY1MC1iZWVmLTk0YjAwMTczMWE5YyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NDQwNzE5LCJleHAiOjIwNDk5OTY3MTl9.gT6eE_jPZQpfaGLRl3c5xo2_4P6F7RkIQs7-xE3xOBU'}`,
        },
        body: JSON.stringify({
          pdfBase64,
          schema
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      // Step 3: Structuring
      setProcessingStep('structuring');
      setProgress(75);

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      // Step 4: Complete
      setProcessingStep('complete');
      setProgress(100);

      setExtractedData(result.data);
      setIsProcessing(false);
      setCurrentTab('preview');
      
      toast({
        title: "Processing Complete",
        description: `Successfully extracted ${result.data.length} rows from your PDF document.`,
      });

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      
      toast({
        title: "Processing Failed",
        description: "Failed to process PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "CSV Downloaded",
      description: "Your semicolon-delimited CSV file has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero border-b border-border/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-primary shadow-ai animate-float">
                <Bot className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              AI PDF to CSV Extractor
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform any PDF document into structured CSV data with AI-powered extraction. 
              Define your schema, upload your PDF, and let our AI handle the complex layout analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <FileText className="h-8 w-8 text-ai mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Upload PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Support for any PDF layout, scanned or digital
                </p>
              </Card>
              
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <Database className="h-8 w-8 text-ai mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Define Schema</h3>
                <p className="text-sm text-muted-foreground">
                  Custom semicolon-delimited CSV structure
                </p>
              </Card>
              
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <Sparkles className="h-8 w-8 text-ai mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">AI Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Smart data extraction regardless of layout
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="upload" className="data-[state=active]:bg-ai data-[state=active]:text-white">
                1. Upload PDF
              </TabsTrigger>
              <TabsTrigger value="schema" disabled={!selectedFile} className="data-[state=active]:bg-ai data-[state=active]:text-white">
                2. Define Schema
              </TabsTrigger>
              <TabsTrigger value="processing" disabled={!selectedFile || schema.length === 0} className="data-[state=active]:bg-ai data-[state=active]:text-white">
                3. Process
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={extractedData.length === 0} className="data-[state=active]:bg-ai data-[state=active]:text-white">
                4. Download
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <PDFUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
              
              {selectedFile && (
                <div className="flex justify-end">
                  <Button variant="ai" onClick={() => setCurrentTab('schema')}>
                    Continue to Schema Definition
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="schema" className="space-y-6">
              <SchemaBuilder schema={schema} onSchemaChange={setSchema} />
              
              {schema.length > 0 && (
                <div className="flex justify-between">
                  <Button variant="ai-outline" onClick={() => setCurrentTab('upload')}>
                    Back to Upload
                  </Button>
                  <Button variant="ai" onClick={processWithAI}>
                    Start AI Processing
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="processing" className="space-y-6">
              <ProcessingStatus currentStep={processingStep} progress={progress} />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <DataPreview 
                schema={schema} 
                extractedData={extractedData} 
                onDownload={handleDownload}
              />
              
              <div className="flex justify-between">
                <Button variant="ai-outline" onClick={() => {
                  setExtractedData([]);
                  setCurrentTab('upload');
                }}>
                  Process New Document
                </Button>
                <Button variant="ai" onClick={() => setCurrentTab('schema')}>
                  Modify Schema
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;