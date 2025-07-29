import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, Calendar, User, BookOpen, Trophy, GraduationCap } from "lucide-react";
import type { Certificate } from "@shared/schema";

interface CertificateDetailsProps {
  certificate: Certificate;
}

export default function CertificateDetails({ certificate }: CertificateDetailsProps) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Award className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Certificate of Completion
        </CardTitle>
        <Badge variant="default" className="bg-blue-600 hover:bg-blue-600">
          Certificate # {certificate.certificateNumber}
        </Badge>
      </CardHeader>

      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {certificate.recipientName}
          </h2>
          <p className="text-lg text-gray-600">
            has successfully completed the course
          </p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            {certificate.courseName}
          </h3>
        </div>

        <Separator className="my-8" />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Completion Date</h4>
                <p className="text-gray-600">
                  {new Date(certificate.completionDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long", 
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Issue Date</h4>
                <p className="text-gray-600">
                  {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>

            {certificate.grade && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mt-1">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Grade Achieved</h4>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {certificate.grade}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Course</h4>
                <p className="text-gray-600">{certificate.courseName}</p>
              </div>
            </div>

            {certificate.instructorName && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mt-1">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Instructor</h4>
                  <p className="text-gray-600">{certificate.instructorName}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                <Award className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
                <Badge 
                  variant={certificate.status === "active" ? "default" : "secondary"}
                  className={certificate.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            This certificate was issued by <strong>Growzy Academy</strong> and is digitally verified.
          </p>
          <p>
            For verification inquiries, contact: <strong>growzyacademy@gmail.com</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
