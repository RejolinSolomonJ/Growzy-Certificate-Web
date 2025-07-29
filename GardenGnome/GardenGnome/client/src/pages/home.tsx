import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CertificateSearch from "@/components/certificate-search";
import CertificateDetails from "@/components/certificate-details";
import { Link } from "wouter";
import { Shield, Award, CheckCircle, Settings } from "lucide-react";
import type { Certificate } from "@shared/schema";
import growzyLogo from "@/assets/growzy-logo.jpg";

export default function Home() {
  const [verifiedCertificate, setVerifiedCertificate] = useState<Certificate | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={growzyLogo} alt="Growzy Academy Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Growzy Academy</h1>
                <p className="text-sm text-blue-600 font-medium">Certificate Verification Portal</p>
              </div>
            </div>
            <Link href="/admin">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Your Certificate
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enter your certificate number below to verify its authenticity and view certificate details.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="text-center pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Certificate Verification</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <CertificateSearch 
                onVerificationResult={(certificate, status) => {
                  setVerifiedCertificate(certificate);
                  setVerificationStatus(status);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {(verifiedCertificate || verificationStatus) && (
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {verificationStatus === "valid" && verifiedCertificate && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Certificate Valid
                  </Badge>
                </div>
                <CertificateDetails certificate={verifiedCertificate} />
              </div>
            )}
            
            {verificationStatus === "not_found" && (
              <Card className="shadow-lg border-red-200 bg-red-50">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Certificate Not Found</h3>
                  <p className="text-red-700">
                    The certificate number you entered could not be found in our database. 
                    Please check the number and try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {verificationStatus === "inactive" && verifiedCertificate && (
              <Card className="shadow-lg border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Certificate Inactive</h3>
                  <p className="text-yellow-700 mb-4">
                    This certificate exists but is currently inactive (revoked or expired).
                  </p>
                  <CertificateDetails certificate={verifiedCertificate} />
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Verify With Us?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our verification system ensures the authenticity and integrity of all certificates issued by Growzy Academy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Verification</h4>
              <p className="text-gray-600">
                Every certificate is protected with unique identifiers and secure verification protocols.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h4>
              <p className="text-gray-600">
                Get immediate verification results with detailed certificate information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Trusted Credentials</h4>
              <p className="text-gray-600">
                All certificates are issued by accredited instructors and verified by our academy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">Growzy Academy</h5>
              <p className="text-gray-400 mb-2">
                A venture of{' '}
                <a 
                  href="https://linsinfotechscompanyltd.on.drv.tw/www.linsinfotechs.com/#home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Lin's Infotechs
                </a>
              </p>
              <p className="text-gray-400 mb-4">
                Empowering learners worldwide with quality education and verified credentials.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Information</h5>
              <div className="space-y-2 text-gray-400">
                <p>Email: growzyacademy@gmail.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Growzy Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
