import React from 'react';
import { Loader2, Brain, FileCheck, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type ProcessingStep = 'analyzing' | 'extracting' | 'structuring' | 'complete';

interface ProcessingStatusProps {
  currentStep: ProcessingStep;
  progress: number;
}

const steps = [
  {
    id: 'analyzing' as const,
    label: 'Analyzing PDF Layout',
    description: 'AI is understanding the document structure',
    icon: Brain
  },
  {
    id: 'extracting' as const,
    label: 'Extracting Data',
    description: 'Finding relevant information across the document',
    icon: FileCheck
  },
  {
    id: 'structuring' as const,
    label: 'Structuring Data',
    description: 'Mapping extracted data to your CSV schema',
    icon: Loader2
  },
  {
    id: 'complete' as const,
    label: 'Processing Complete',
    description: 'Your CSV file is ready for download',
    icon: Download
  }
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ currentStep, progress }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Processing Your Document
          </h3>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress}% complete
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                  isActive && "bg-ai/10 border border-ai/20",
                  isComplete && "opacity-60"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isActive && "bg-ai/20 animate-pulse-ai",
                  isComplete && "bg-ai-success/20",
                  isPending && "bg-muted/50"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive && "text-ai animate-spin",
                    isComplete && "text-ai-success",
                    isPending && "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium transition-colors duration-300",
                    isActive && "text-ai",
                    isComplete && "text-ai-success",
                    isPending && "text-muted-foreground"
                  )}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};