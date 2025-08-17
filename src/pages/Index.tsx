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

  const simulateProcessing = async () => {
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

    // Simulate processing steps
    const steps: ProcessingStep[] = ['analyzing', 'extracting', 'structuring', 'complete'];
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      
      // Simulate progressive progress
      for (let p = i * 25; p <= (i + 1) * 25; p++) {
        setProgress(p);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (i < steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Set mock extracted data based on schema
    setExtractedData(mockExtractedData);
    setIsProcessing(false);
    setCurrentTab('preview');
    
    toast({
      title: "Processing Complete",
      description: "Successfully extracted data from your PDF document.",
    });
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
                  <Button variant="ai" onClick={simulateProcessing}>
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