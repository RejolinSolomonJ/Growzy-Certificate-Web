import { db } from "./db";
import { certificates, type InsertCertificate } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database with sample certificates...");

  const sampleCertificates: InsertCertificate[] = [
    {
      certificateNumber: "GZ2024001",
      recipientName: "John Smith",
      courseName: "Advanced Digital Marketing",
      issueDate: new Date("2024-01-15"),
      completionDate: new Date("2024-01-10"),
      grade: "A",
      instructorName: "Dr. Sarah Johnson",
      status: "active"
    },
    {
      certificateNumber: "GZ2024002",
      recipientName: "Emily Davis",
      courseName: "Data Analytics Fundamentals",
      issueDate: new Date("2024-02-20"),
      completionDate: new Date("2024-02-18"),
      grade: "B+",
      instructorName: "Prof. Michael Chen",
      status: "active"
    },
    {
      certificateNumber: "GZ2024003",
      recipientName: "Robert Wilson",
      courseName: "Project Management Professional",
      issueDate: new Date("2024-03-10"),
      completionDate: new Date("2024-03-08"),
      grade: "A-",
      instructorName: "Dr. Lisa Rodriguez",
      status: "active"
    }
  ];

  try {
    // Check if certificates already exist
    const existingCertificates = await db.select().from(certificates);
    
    if (existingCertificates.length > 0) {
      console.log("✅ Database already has certificates, skipping seed");
      return;
    }

    // Insert sample certificates
    await db.insert(certificates).values(sampleCertificates);
    
    console.log(`✅ Successfully seeded ${sampleCertificates.length} certificates`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Database seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Database seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };