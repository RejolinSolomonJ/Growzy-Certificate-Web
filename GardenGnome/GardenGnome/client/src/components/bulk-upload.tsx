import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Download } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCertificateSchema, type InsertCertificate } from "@shared/schema";
import growzyLogo from "@/assets/growzy-logo.jpg";

interface BulkUploadProps {
  onClose: () => void;
}

export default function BulkUpload({ onClose }: BulkUploadProps) {
  const [csvData, setCsvData] = useState("");
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: Array<{ row: number; error: string; data: any }>;
  } | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (certificates: InsertCertificate[]) => {
      const results = {
        success: 0,
        failed: [] as Array<{ row: number; error: string; data: any }>
      };

      for (let i = 0; i < certificates.length; i++) {
        try {
          await apiRequest("POST", "/api/certificates", certificates[i]);
          results.success++;
        } catch (error: any) {
          results.failed.push({
            row: i + 2, // +2 because row 1 is header and arrays are 0-indexed
            error: error.message || "Unknown error",
            data: certificates[i]
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      setUploadResults(results);
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      
      if (results.failed.length === 0) {
        toast({
          title: "Success",
          description: `All ${results.success} certificates uploaded successfully`
        });
      } else {
        toast({
          title: "Partial Success",
          description: `${results.success} uploaded, ${results.failed.length} failed`,
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload certificates",
        variant: "destructive"
      });
    }
  });

  const parseCsvData = (csvText: string): InsertCertificate[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const certificates: InsertCertificate[] = [];

    // Expected CSV format: certificateNumber,recipientName,courseName,completionDate,issueDate,grade,instructorName,status
    const requiredFields = ['certificatenumber', 'recipientname', 'coursename', 'completiondate', 'issuedate'];
    const missingFields = requiredFields.filter(field => !header.includes(field));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== header.length) {
        throw new Error(`Row ${i + 1}: Expected ${header.length} columns, got ${values.length}`);
      }

      const certificate: any = {};
      header.forEach((field, index) => {
        certificate[field] = values[index];
      });

      // Validate and transform the data
      try {
        const transformedCertificate: InsertCertificate = {
          certificateNumber: certificate.certificatenumber,
          recipientName: certificate.recipientname,
          courseName: certificate.coursename,
          completionDate: new Date(certificate.completiondate),
          issueDate: new Date(certificate.issuedate),
          grade: certificate.grade || undefined,
          instructorName: certificate.instructorname || undefined,
          status: certificate.status || "active"
        };

        // Validate with schema
        insertCertificateSchema.parse(transformedCertificate);
        certificates.push(transformedCertificate);
      } catch (error: any) {
        throw new Error(`Row ${i + 1}: ${error.message}`);
      }
    }

    return certificates;
  };

  const handleUpload = () => {
    try {
      const certificates = parseCsvData(csvData);
      uploadMutation.mutate(certificates);
    } catch (error: any) {
      toast({
        title: "CSV Parse Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = () => {
    const template = `certificateNumber,recipientName,courseName,completionDate,issueDate,grade,instructorName,status
GZ2024004,Jane Doe,Web Development Fundamentals,2024-01-15,2024-01-20,A,Prof. Smith,active
GZ2024005,Bob Johnson,Data Science Basics,2024-02-10,2024-02-15,B+,Dr. Wilson,active`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bulk Upload Certificates</h1>
              <p className="text-sm text-gray-600">Upload multiple certificates using CSV format</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>CSV Format Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Your CSV file must include the following columns (in any order):
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-sm">
                  certificateNumber, recipientName, courseName, completionDate, issueDate, grade, instructorName, status
                </code>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Required fields:</strong> certificateNumber, recipientName, courseName, completionDate, issueDate
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Optional fields:</strong> grade, instructorName, status (defaults to "active")
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-01-15)
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV Template</span>
            </Button>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload CSV Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your CSV data below:
              </label>
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="certificateNumber,recipientName,courseName,completionDate,issueDate,grade,instructorName,status
GZ2024004,Jane Doe,Web Development,2024-01-15,2024-01-20,A,Prof. Smith,active"
                className="min-h-[200px] font-mono text-sm"
                disabled={uploadMutation.isPending}
              />
            </div>

            <Button 
              onClick={handleUpload}
              disabled={!csvData.trim() || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Certificates"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {uploadResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Upload Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{uploadResults.success}</strong> certificates uploaded successfully
                  </AlertDescription>
                </Alert>
                
                {uploadResults.failed.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{uploadResults.failed.length}</strong> certificates failed to upload
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {uploadResults.failed.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Failed Uploads:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uploadResults.failed.map((failure, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-800">
                          Row {failure.row}: {failure.error}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Data: {JSON.stringify(failure.data)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}