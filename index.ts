import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { promisify } from "node:util";
import { createInterface} from "node:readline";

import { student } from './src/drizzle/schema';
import {eq} from "drizzle-orm";

const migrationConnection = postgres(process.env.DATABASE_URL!, { max: 1 });
const queryConnection = postgres(process.env.DATABASE_URL!);

const db = drizzle(queryConnection);

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const  questionAsync = promisify(readline.question).bind(readline);

const main = async () => {
    // *** Set up db *** //
    //await migrate(drizzle(migrationConnection), { migrationsFolder: 'src/drizzle' });
    //await migrationConnection.end();

    // *** insert data *** //
    // await insertInitialData();



    // *** Application functions *** //
    let continueLoop = true;
    while (continueLoop) {
        continueLoop = await terminal();
    }

    process.exit(0);
};

async function terminal() {

    const options = 'Welcome to comp 3005 A3 Q1 \n' +
        '1. Get all student \n' +
        '2. Add student\n' +
        '3. Update student email\n' +
        '4. Remove student\n' +
        '5. Exit';

    const selection: string = await questionAsync(options + '\nYour choice: ');
    // convert string into num
    const selectionNumber = Number(selection)

    switch (selectionNumber) {
        case 1:
            console.log('You selected Get all students');
            await getAllStudents();
            break;
        case 2:
            console.log('You selected Add student');
            try {
                const answer: string = await questionAsync('Please enter first name, last name, email and enrollment date\n');
                const tokens = answer.split(" ");
                if (tokens.length === 4) {
                    await addStudent(tokens[0], tokens[1], tokens[2], tokens[3]);
                } else {
                    console.error('You must enter four items: first name, last name, email and enrollment date')
                }
            } catch (error) {
                console.error('An error occurred', error)
            }
            break;
        case 3:
            try {
                const answer: string = await questionAsync('Please enter student_id and the new email\n');
                const tokens = answer.split(" ");
                if (tokens.length === 2) {
                    await updateStudentEmail(Number(tokens[0]), tokens[1]);
                } else {
                    console.error('You must enter two items: student_ID and email')
                }
            } catch (error) {
                console.error('An error occurred', error)
            }
            break;
        case 4:
            try {
                const answer: string = await questionAsync('Please enter student_id and the new email\n');
                await deleteStudent(Number(answer));
            } catch (error) {
                console.error('An error occurred', error)
            }
            break;
        case 5:
            console.log('Exiting...');
            readline.close();
            return false; // stop loop
        default:
            console.log('Invalid selection!')
    }
    return true;
}

async function insertInitialData():Promise<void> {
    await db.insert(student).values({first_name: 'john', last_name: 'Doe', email: 'john.doe@example.com', enrollment_date: '2023-09-01'}).execute();
    await db.insert(student).values({first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', enrollment_date: '2023-09-01'}).execute();
    await db.insert(student).values({first_name: 'Jim', last_name: 'Beam', email: 'jim.beam@example.com', enrollment_date: '2023-09-02'}).execute();
}

async function getAllStudents():Promise<void> {
    // retrieves and displays all records from the students table
    console.log(await db.select().from(student));
}

async function addStudent(first_name: string, last_name: string, email: string, enrollment_date: string) {
    await db.insert(student).values({first_name: first_name, last_name: last_name, email: email, enrollment_date: enrollment_date}).execute();
}

async function updateStudentEmail(student_id: number, new_email: string) {
    await db.update(student).set({email: new_email}).where(eq(student.student_id, student_id));
}

async function deleteStudent(student_id: number) {
    await db.delete(student).where(eq(student.student_id, student_id));
}

main();