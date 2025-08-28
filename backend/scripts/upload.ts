import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
    const mentees: any[] = [];

    // Parse CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream("mentees.csv") // put your CSV in backend root
            .pipe(csv())
            .on("data", (row) => {
                mentees.push({
                    name: row.name,
                    bio: row.bio || null,
                    avatarUrl: row.avatarUrl || null,
                    skills: row.skills ? row.skills.split(",") : [],
                    location: row.location || null,
                    reputation: row.reputation ? parseInt(row.reputation, 10) : 0,
                });
            })
            .on("end", resolve)
            .on("error", reject);
    });

    // Insert into DB
    if (mentees.length > 0) {
        await prisma.mentee.createMany({
            data: mentees,
            skipDuplicates: true,
        });
        console.log(`✅ Inserted ${mentees.length} mentees`);
    } else {
        console.log("⚠️ No data found in CSV file");
    }
}

main()
    .catch((e) => {
        console.error("❌ Error uploading data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
