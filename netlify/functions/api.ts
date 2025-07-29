import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";
import { seedDatabase } from "../../server/seed";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database and routes
let initialized = false;

const initializeApp = async () => {
  if (!initialized) {
    try {
      await seedDatabase();
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
    
    await registerRoutes(app);
    initialized = true;
  }
};

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Serverless handler
const handler = serverless(app);

export const handler = async (event: any, context: any) => {
  await initializeApp();
  return handler(event, context);
};