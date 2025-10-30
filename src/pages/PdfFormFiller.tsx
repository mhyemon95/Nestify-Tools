import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormInput, Upload, Download, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFRadioGroup } from "pdf-lib";

interface FormField {
  name: string;
  type: 'text' | 'checkbox' | 'radio';
  value: string | boolean;
  options?: string[];
}

const PdfFormFiller = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [showManualFields, setShowManualFields] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsLoading(true);
      setError(null);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const form = pdf.getForm();
        const fields = form.getFields();
        
        const detectedFields: FormField[] = fields.map(field => {
          const fieldName = field.getName();
          
          if (field instanceof PDFTextField) {
            return {
              name: fieldName,
              type: 'text' as const,
              value: field.getText() || ''
            };
          } else if (field instanceof PDFCheckBox) {
            return {
              name: fieldName,
              type: 'checkbox' as const,
              value: field.isChecked()
            };
          } else if (field instanceof PDFRadioGroup) {
            return {
              name: fieldName,
              type: 'radio' as const,
              value: field.getSelected() || '',
              options: field.getOptions()
            };
          }
          
          return {
            name: fieldName,
            type: 'text' as const,
            value: ''
          };
        });
        
        setFormFields(detectedFields);
        setPdfDoc(pdf);
        
        if (detectedFields.length === 0) {
          setShowManualFields(true);
          // Add common form fields as fallback
          const commonFields: FormField[] = [
            { name: 'Name', type: 'text', value: '' },
            { name: 'Email', type: 'text', value: '' },
            { name: 'Phone', type: 'text', value: '' },
            { name: 'Address', type: 'text', value: '' },
            { name: 'Date', type: 'text', value: '' },
            { name: 'Signature', type: 'text', value: '' }
          ];
          setFormFields(commonFields);
        }
      } catch (err) {
        setError('Failed to load PDF. Please ensure it\'s a valid PDF file with form fields.');
        console.error('PDF loading error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateField = (fieldName: string, value: string | boolean) => {
    setFormFields(prev => prev.map(field => 
      field.name === fieldName ? { ...field, value } : field
    ));
  };

  const addManualField = () => {
    if (newFieldName.trim()) {
      const newField: FormField = {
        name: newFieldName.trim(),
        type: 'text',
        value: ''
      };
      setFormFields(prev => [...prev, newField]);
      setNewFieldName('');
    }
  };

  const removeField = (fieldName: string) => {
    setFormFields(prev => prev.filter(field => field.name !== fieldName));
  };

  const fillAndDownloadPDF = async () => {
    if (!pdfDoc) return;
    
    setIsLoading(true);
    try {
      if (showManualFields) {
        // Create a new PDF with text overlays for manual fields
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { height } = firstPage.getSize();
        
        let yPosition = height - 100;
        formFields.forEach((field, index) => {
          if (field.value && typeof field.value === 'string') {
            firstPage.drawText(`${field.name}: ${field.value}`, {
              x: 50,
              y: yPosition - (index * 25),
              size: 12
            });
          }
        });
      } else {
        // Fill interactive form fields
        const form = pdfDoc.getForm();
        
        formFields.forEach(field => {
          try {
            const pdfField = form.getField(field.name);
            
            if (pdfField instanceof PDFTextField && typeof field.value === 'string') {
              pdfField.setText(field.value);
            } else if (pdfField instanceof PDFCheckBox && typeof field.value === 'boolean') {
              if (field.value) {
                pdfField.check();
              } else {
                pdfField.uncheck();
              }
            } else if (pdfField instanceof PDFRadioGroup && typeof field.value === 'string') {
              if (field.value) {
                pdfField.select(field.value);
              }
            }
          } catch (err) {
            console.warn(`Failed to fill field ${field.name}:`, err);
          }
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `filled_${file?.name || 'form.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to fill and save PDF.');
      console.error('PDF filling error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-2xl mb-4">
              <FormInput className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Form Filler
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fill and save interactive PDF forms
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload PDF Form
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {file ? file.name : "Select a PDF form to fill"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isLoading}
                  />
                  <Button asChild disabled={isLoading}>
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      {isLoading ? "Loading..." : "Select PDF Form"}
                    </label>
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {showManualFields && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    No interactive form fields detected. You can add custom fields below or use the common fields provided.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      placeholder="Enter field name"
                      onKeyPress={(e) => e.key === 'Enter' && addManualField()}
                    />
                    <Button onClick={addManualField} disabled={!newFieldName.trim()}>
                      Add Field
                    </Button>
                  </div>
                </div>
              )}

              {formFields.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Form Fields ({formFields.length} found)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field) => (
                      <div key={field.name}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.name} {showManualFields ? '' : `(${field.type})`}
                          </label>
                          {showManualFields && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(field.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        {field.type === 'text' && (
                          <Input
                            value={field.value as string}
                            onChange={(e) => updateField(field.name, e.target.value)}
                            placeholder={`Enter ${field.name}`}
                          />
                        )}
                        {field.type === 'checkbox' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={field.value as boolean}
                              onChange={(e) => updateField(field.name, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={field.name} className="text-sm text-gray-700 dark:text-gray-300">
                              Check this field
                            </label>
                          </div>
                        )}
                        {field.type === 'radio' && field.options && (
                          <div className="space-y-2">
                            {field.options.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`${field.name}-${option}`}
                                  name={field.name}
                                  value={option}
                                  checked={field.value === option}
                                  onChange={(e) => updateField(field.name, e.target.value)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`${field.name}-${option}`} className="text-sm text-gray-700 dark:text-gray-300">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formFields.length > 0 && (
                <div className="flex justify-center">
                  <Button 
                    onClick={fillAndDownloadPDF} 
                    className="px-8"
                    disabled={!file || isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoading ? "Processing..." : "Fill & Download PDF"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfFormFiller;