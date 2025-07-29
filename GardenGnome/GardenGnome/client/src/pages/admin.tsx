import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Award, Upload } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminCertificateForm from "@/components/admin-certificate-form";
import BulkUpload from "@/components/bulk-upload";
import type { Certificate } from "@shared/schema";
import growzyLogo from "@/assets/growzy-logo.jpg";

export default function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const { toast } = useToast();

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Success",
        description: "Certificate deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  const handleBulkUploadClose = () => {
    setShowBulkUpload(false);
  };

  if (showForm) {
    return (
      <AdminCertificateForm 
        certificate={editingCertificate}
        onClose={handleFormClose}
      />
    );
  }

  if (showBulkUpload) {
    return (
      <BulkUpload onClose={handleBulkUploadClose} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Verification</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <img src={growzyLogo} alt="Growzy Academy Logo" className="h-10 w-auto" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Certificate Management</h1>
                  <p className="text-sm text-gray-600">Growzy Academy Admin Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowBulkUpload(true)} 
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </Button>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Certificate</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Certificates</span>
              <Badge variant="secondary">
                {certificates?.length || 0} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading certificates...</p>
              </div>
            ) : certificates && certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{certificate.recipientName}</h3>
                          <Badge 
                            variant={certificate.status === "active" ? "default" : "secondary"}
                            className={certificate.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {certificate.status}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Certificate #:</span>
                            <br />
                            {certificate.certificateNumber}
                          </div>
                          <div>
                            <span className="font-medium">Course:</span>
                            <br />
                            {certificate.courseName}
                          </div>
                          <div>
                            <span className="font-medium">Grade:</span>
                            <br />
                            {certificate.grade || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Issue Date:</span>
                            <br />
                            {new Date(certificate.issueDate).toLocaleDateString()}
                          </div>
                        </div>
                        {certificate.instructorName && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Instructor:</span> {certificate.instructorName}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(certificate)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(certificate.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first certificate.</p>
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Certificate</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
