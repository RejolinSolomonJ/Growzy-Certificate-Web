import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCertificateSchema, searchCertificateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Certificate verification endpoint
  app.post("/api/certificates/verify", async (req, res) => {
    try {
      const { certificateNumber } = searchCertificateSchema.parse(req.body);
      
      const certificate = await storage.getCertificateByNumber(certificateNumber);
      
      if (!certificate) {
        return res.status(404).json({ 
          message: "Certificate not found",
          status: "not_found"
        });
      }

      if (certificate.status !== "active") {
        return res.status(400).json({
          message: "Certificate is not active",
          status: "inactive",
          certificate
        });
      }

      return res.json({
        message: "Certificate verified successfully",
        status: "valid",
        certificate
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid certificate number",
          status: "invalid_input"
        });
      }
      return res.status(500).json({ 
        message: "Internal server error",
        status: "error"
      });
    }
  });

  // Get all certificates (admin endpoint)
  app.get("/api/certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllCertificates();
      return res.json(certificates);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new certificate (admin endpoint)
  app.post("/api/certificates", async (req, res) => {
    try {
      const certificateData = insertCertificateSchema.parse(req.body);
      
      // Check if certificate number already exists
      const existing = await storage.getCertificateByNumber(certificateData.certificateNumber);
      if (existing) {
        return res.status(400).json({ message: "Certificate number already exists" });
      }

      const certificate = await storage.createCertificate(certificateData);
      return res.status(201).json(certificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid certificate data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update certificate (admin endpoint)
  app.patch("/api/certificates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const certificate = await storage.updateCertificate(id, updates);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      return res.json(certificate);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete certificate (admin endpoint)
  app.delete("/api/certificates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCertificate(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      return res.json({ message: "Certificate deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
