import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDb } from "./connetDb.js";
import { College } from "../Schema/CollegeSchema.js";
import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { Admin } from "../Schema/AdminSchema.js";
import { Society } from "../Schema/SocietySchema.js";

dotenv.config();

export async function runMigration() {
  try {
    await connectDb();
    console.log("Connected to MongoDB for schema migration...");

    const db = mongoose.connection.db;

    const defaultCollege = await College.findOne({ shortCode: "NSUT" });
    if (!defaultCollege) {
      console.error(
        "\n[Migration Error] Colleges have not been seeded yet.\n" +
        "Please run 'npm run seed' first to initialize the College collection before running the migration.\n"
      );
      process.exit(1);
    }

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("userprofiles")) {
      console.log("No legacy 'userprofiles' collection found. Checking if any users collection needs role splitting...");
    }

    const legacyProfiles = collectionNames.includes("userprofiles")
      ? await db.collection("userprofiles").find({}).toArray()
      : [];

    console.log(`Found ${legacyProfiles.length} documents in legacy 'userprofiles' collection.`);

    let usersMigrated = 0;
    let membersMigrated = 0;
    let adminsMigrated = 0;

    for (const doc of legacyProfiles) {
      let collegeId = doc.college;
      if (!collegeId || typeof collegeId === "string") {
        collegeId = defaultCollege._id;
      }

      if (doc.role === "admin") {
        await Admin.updateOne(
          { _id: doc._id },
          {
            $set: {
              email: doc.email,
              password: doc.password,
              role: "admin",
              f_name: doc.f_name || "",
              l_name: doc.l_name || "",
            },
          },
          { upsert: true }
        );
        adminsMigrated++;
      } else if (doc.role === "member") {
        const soc = await Society.findOne({ userId: doc._id });
        await Member.updateOne(
          { _id: doc._id },
          {
            $set: {
              email: doc.email,
              password: doc.password,
              role: "member",
              f_name: doc.f_name || "",
              l_name: doc.l_name || "",
              college: collegeId,
              position: doc.position || "",
              societyId: soc ? soc._id : null,
            },
          },
          { upsert: true }
        );
        membersMigrated++;
      } else {
        await User.updateOne(
          { _id: doc._id },
          {
            $set: {
              email: doc.email,
              password: doc.password,
              role: "user",
              f_name: doc.f_name || "",
              l_name: doc.l_name || "",
              dob: doc.dob,
              p_number: doc.p_number,
              college: collegeId,
              batch_start: doc.batch_start,
              batch_end: doc.batch_end,
              roll_no: doc.roll_no,
              branch: doc.branch,
              specialization: doc.specialization,
              github: doc.github,
              linkdin: doc.linkdin,
              society: doc.society || [],
            },
          },
          { upsert: true }
        );
        usersMigrated++;
      }
    }

    const societies = await db.collection("societies").find({}).toArray();
    let societiesUpdated = 0;
    for (const soc of societies) {
      if (!soc.college || typeof soc.college === "string") {
        await Society.updateOne(
          { _id: soc._id },
          { $set: { college: defaultCollege._id } }
        );
        societiesUpdated++;
      }
    }

    console.log("Migration finished successfully!");
    console.log(`- Students migrated to 'users': ${usersMigrated}`);
    console.log(`- Members migrated to 'members': ${membersMigrated}`);
    console.log(`- Admins migrated to 'admins': ${adminsMigrated}`);
    console.log(`- Societies updated with college ObjectId: ${societiesUpdated}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith("migrateRoles.js")) {
  runMigration();
}
