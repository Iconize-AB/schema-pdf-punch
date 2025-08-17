import React, { useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  description: string;
}

interface SchemaBuilderProps {
  schema: SchemaField[];
  onSchemaChange: (schema: SchemaField[]) => void;
}

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ schema, onSchemaChange }) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const addField = () => {
    const newField: SchemaField = {
      id: `field_${Date.now()}`,
      name: '',
      type: 'text',
      description: ''
    };
    onSchemaChange([...schema, newField]);
    setEditingField(newField.id);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    onSchemaChange(schema.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    onSchemaChange(schema.filter(field => field.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">CSV Schema Definition</h3>
          <p className="text-sm text-muted-foreground">
            Define the columns for your semicolon-delimited CSV output
          </p>
        </div>
        <Button variant="ai" onClick={addField}>
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>

      <div className="space-y-3">
        {schema.map((field) => (
          <Card key={field.id} className="p-4 bg-gradient-card border-border/50">
            {editingField === field.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`name-${field.id}`}>Column Name</Label>
                    <Input
                      id={`name-${field.id}`}
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      placeholder="e.g., Invoice Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`type-${field.id}`}>Data Type</Label>
                    <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`description-${field.id}`}>Description</Label>
                  <Textarea
                    id={`description-${field.id}`}
                    value={field.description}
                    onChange={(e) => updateField(field.id, { description: e.target.value })}
                    placeholder="Describe what data should be extracted for this column..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ai" size="sm" onClick={() => setEditingField(null)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-foreground">
                      {field.name || 'Unnamed Field'}
                    </h4>
                    <span className="px-2 py-1 text-xs bg-ai/10 text-ai rounded-md">
                      {field.type}
                    </span>
                  </div>
                  {field.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingField(field.id)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {schema.length === 0 && (
        <Card className="p-8 text-center bg-gradient-card border-border/50">
          <p className="text-muted-foreground mb-4">
            No fields defined yet. Add your first field to get started.
          </p>
          <Button variant="ai-outline" onClick={addField}>
            <Plus className="h-4 w-4" />
            Add First Field
          </Button>
        </Card>
      )}
    </div>
  );
};