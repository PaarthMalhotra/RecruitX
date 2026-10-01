import mongoose from "mongoose";
import dotenv from "dotenv";
import { College } from "../Schema/CollegeSchema.js";
import { connectDb } from "./connetDb.js";

dotenv.config();

const INITIAL_COLLEGES = [
  { name: "Netaji Subhas University of Technology", shortCode: "NSUT", city: "New Delhi" },
  { name: "Delhi Technological University", shortCode: "DTU", city: "New Delhi" },
  { name: "Indraprastha Institute of Information Technology Delhi", shortCode: "IIITD", city: "New Delhi" },
  { name: "Indira Gandhi Delhi Technical University for Women", shortCode: "IGDTUW", city: "New Delhi" },
  { name: "Maharaja Agrasen Institute of Technology", shortCode: "MAIT", city: "New Delhi" },
  { name: "Bharati Vidyapeeth's College of Engineering", shortCode: "BVCOE", city: "New Delhi" },
  { name: "University School of Information, Communication and Technology", shortCode: "USICT", city: "New Delhi" },
  { name: "Bhagwan Parshuram Institute of Technology", shortCode: "BPIT", city: "New Delhi" },
  { name: "Indian Institute of Technology Delhi", shortCode: "IITD", city: "New Delhi" },
  { name: "Indian Institute of Technology Bombay", shortCode: "IITB", city: "Mumbai" },
  { name: "Birla Institute of Technology and Science, Pilani", shortCode: "BITS", city: "Pilani" },
];

export async function seedColleges() {
  try {
    await connectDb();
    console.log("Connected to MongoDB for seeding colleges...");

    let createdCount = 0;
    for (const col of INITIAL_COLLEGES) {
      const exists = await College.findOne({
        $or: [{ name: col.name }, { shortCode: col.shortCode }],
      });
      if (!exists) {
        await College.create(col);
        createdCount++;
        console.log(`+ Seeded college: ${col.name} (${col.shortCode})`);
      } else {
        console.log(`- Already exists: ${col.shortCode}`);
      }
    }

    console.log(`Colleges seed complete. Added ${createdCount} new colleges.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding colleges:", error);
    process.exit(1);
  }
}

// If invoked directly from CLI
if (process.argv[1]?.endsWith("seedColleges.js")) {
  seedColleges();
}
