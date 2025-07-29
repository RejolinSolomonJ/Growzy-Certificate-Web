import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { searchCertificateSchema, type SearchCertificate, type Certificate } from "@shared/schema";

interface CertificateSearchProps {
  onVerificationResult: (certificate: Certificate | null, status: string) => void;
}

export default function CertificateSearch({ onVerificationResult }: CertificateSearchProps) {
  const form = useForm<SearchCertificate>({
    resolver: zodResolver(searchCertificateSchema),
    defaultValues: {
      certificateNumber: ""
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: SearchCertificate) => {
      const response = await apiRequest("POST", "/api/certificates/verify", data);
      return response.json();
    },
    onSuccess: (data) => {
      onVerificationResult(data.certificate || null, data.status);
    },
    onError: (error) => {
      console.error("Verification error:", error);
      onVerificationResult(null, "error");
    }
  });

  const onSubmit = (data: SearchCertificate) => {
    verifyMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="certificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-700">
                Certificate Number
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter certificate number (e.g., GZ2024001)"
                    className="pr-12 h-12 text-lg"
                    disabled={verifyMutation.isPending}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Verify Certificate
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <p>Need help? Contact us at <strong>growzyacademy@gmail.com</strong></p>
        </div>
      </form>
    </Form>
  );
}
