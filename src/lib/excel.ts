import { read, utils } from 'xlsx';
import { Student } from './types';

export async function parseStudentImport(file: File): Promise<Student[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON with raw headers first to inspect
                const rawData = utils.sheet_to_json(worksheet, { header: 1 });
                console.log("Raw Excel Data first 2 rows:", rawData.slice(0, 2));

                if (rawData.length < 2) {
                    reject(new Error("File needs at least a header row and one data row"));
                    return;
                }

                // Robust header extraction: convert to string, default to empty, trim
                const headers = (rawData[0] as any[]).map(h => String(h || "").trim());
                console.log("Detected Headers:", headers);

                // Helper for fuzzy matching
                const findHeader = (patterns: string[]) => {
                    return headers.findIndex(h =>
                        patterns.some(p => h.includes(p) || h === p)
                    );
                };

                // Map headers to indices with relaxed matching
                const map = {
                    firstName: findHeader(["الاسم الأول", "First Name", "Firstname", "first_name"]),
                    lastName: findHeader(["الاسم الأخير", "Last Name", "Lastname", "last_name", "العائلة", "اللقب"]),
                    email: findHeader(["البريد", "Email", "email", "mail"]),
                    username: findHeader(["المستخدم", "Username", "username", "User", "ID", "user_id"]),
                };

                console.log("Column Mapping:", map);

                if (map.username === -1 && map.firstName === -1) {
                    reject(new Error(`Could not find required columns. Found headers: ${headers.join(", ")}`));
                    return;
                }

                const students: Student[] = [];
                const rows = rawData.slice(1);

                rows.forEach((row: any, idx) => {
                    // Extract values based on mapped indices
                    const firstName = map.firstName > -1 ? row[map.firstName] : "";
                    const lastName = map.lastName > -1 ? row[map.lastName] : "";
                    const email = map.email > -1 ? row[map.email] : "";
                    const username = map.username > -1 ? row[map.username] : "";

                    // Skip empty rows
                    if (!username && !firstName) {
                        console.warn(`Skipping row ${idx + 2}: Missing username and name`);
                        return;
                    }

                    const fullName = `${firstName} ${lastName}`.trim();

                    students.push({
                        id: crypto.randomUUID(),
                        username: String(username || `user_${Date.now()}_${idx}`).trim(), // Fallback if username missing but name exists
                        full_name: fullName || "Unknown",
                        email: String(email).trim()
                    });
                });

                console.log(`Parsed ${students.length} students`);
                if (students.length === 0) {
                    reject(new Error("No valid students found in the file. Check column headers."));
                    return;
                }

                resolve(students);
            } catch (err) {
                console.error("Excel processing error:", err);
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
}
