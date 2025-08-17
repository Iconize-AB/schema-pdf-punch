import React from 'react';
import { Download, Eye, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SchemaField } from './SchemaBuilder';

interface ExtractedData {
  [key: string]: string | number | boolean;
  confidence?: number;
}

interface DataPreviewProps {
  schema: SchemaField[];
  extractedData: ExtractedData[];
  onDownload: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ schema, extractedData, onDownload }) => {
  const getConfidenceColor = (confidence: number = 1) => {
    if (confidence >= 0.8) return 'bg-ai-success/20 text-ai-success';
    if (confidence >= 0.6) return 'bg-ai-warning/20 text-ai-warning';
    return 'bg-destructive/20 text-destructive';
  };

  const downloadCSV = () => {
    const headers = schema.map(field => field.name).join(';');
    const rows = extractedData.map(row => 
      schema.map(field => {
        const value = row[field.name] || '';
        // Escape semicolons and quotes in CSV
        return typeof value === 'string' && (value.includes(';') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(';')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Extracted Data Preview</h3>
            <p className="text-sm text-muted-foreground">
              {extractedData.length} rows extracted • Semicolon-delimited CSV format
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ai-outline" size="sm">
              <Eye className="h-4 w-4" />
              Preview Full Data
            </Button>
            <Button variant="ai" onClick={downloadCSV}>
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>

        {extractedData.length > 0 ? (
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {schema.map((field) => (
                    <TableHead key={field.id} className="font-semibold">
                      {field.name}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {field.type}
                      </Badge>
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedData.slice(0, 5).map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/20">
                    {schema.map((field) => (
                      <TableCell key={field.id} className="max-w-xs truncate">
                        {row[field.name]?.toString() || (
                          <span className="text-muted-foreground italic">No data</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary" 
                        className={getConfidenceColor(row.confidence)}
                      >
                        {((row.confidence || 1) * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {extractedData.length > 5 && (
              <div className="p-3 text-center text-sm text-muted-foreground bg-muted/20">
                +{extractedData.length - 5} more rows available in CSV download
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No data extracted</p>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-gradient-secondary border-border/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-ai-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Extraction Quality Notes</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Confidence scores indicate AI certainty for each extracted value</li>
              <li>• Review low-confidence extractions before using in production</li>
              <li>• Complex layouts may require manual verification of results</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};