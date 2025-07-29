import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull().unique(),
  recipientName: text("recipient_name").notNull(),
  courseName: text("course_name").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  completionDate: timestamp("completion_date").notNull(),
  grade: text("grade"),
  instructorName: text("instructor_name"),
  status: text("status").notNull().default("active"), // active, revoked, expired
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
}).extend({
  issueDate: z.coerce.date(),
  completionDate: z.coerce.date(),
});

export const searchCertificateSchema = z.object({
  certificateNumber: z.string().min(1, "Certificate number is required"),
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type SearchCertificate = z.infer<typeof searchCertificateSchema>;
