import { firestoreDB } from "../../main";
import {
    doc,
    getDocs,
    setDoc,
    collection,
} from 'firebase/firestore';

function getCurrentDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export async function getTodaysReport() {
    try {
        const reportRef = collection(firestoreDB, "attendance", getCurrentDateFormatted(), "report");
        // const reportRef = collection(firestoreDB, "attendance", "2024-05-16", "report");
        const reportSnapshot = await getDocs(reportRef);

        let report = {}

        reportSnapshot.forEach((doc) => {
            const docData = doc.data();
            report[doc.id] = docData.report;
        });

        return report;
    } catch (error) {
        console.error("Error fetching filtered users: ", error);
        return [];
    }
}

export async function updateReport(userInfo, report) {
    try {
        console.log(userInfo, report, "Esto es ")
        const reportRef = doc(firestoreDB, "attendance", getCurrentDateFormatted(), "report", userInfo.uid);
        
        return await setDoc(reportRef, {
            ...userInfo,
            report
        });
    } catch (error) {
        console.error("Error updating the report: ", error);
        return [];
    }
}

export async function addRegister(userInfo, date) {
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
        const day = String(date.getDate()).padStart(2, '0');

        const reportRef = doc(firestoreDB, "attendance", `${year}-${month}-${day}`, "report", userInfo.uid);

        await setDoc(reportRef, {
            ...userInfo,
            report: 'RR'
        });

    } catch (error) {
        console.error("Error updating the report: ", error);
    }
}

// Para obtener los datos de asistencia de una fecha 
export async function getReportByDate (dateString) {
    try {
        // Reference with root de attendance, document es dateString del input parameter, y luego report subcollection 
        const reportRef = collection(firestoreDB, "attendance", dateString, "report");
        const reportSnapshot = await getDocs(reportRef); // Arreglo del reporte

        let report = {}; // Objeto vacío para llenarlo de datos

        // For each reportSnapshot in array, extracts the data using document id as key (so matricula) 
        reportSnapshot.forEach((doc) => {
            const docData = doc.data();
            report[doc.id] = docData; // or docData.report if needed
        });

        return report;
    // Error debug
    } catch (error) {
        console.error("Error fetching report: ", error);
        return {};
    }
}

// Para obtener todos los reportes de asistencia entre rango de fechas 
export async function getReportByDateRange (startDate, endDate) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const attendanceRef = collection(firestoreDB, "attendance"); // Reference to the root collection
        const attendanceSnapshot = await getDocs(reportRef); // Get all documents in the collection temporarily

        let report = {}; // Initialize an empty object to store the report data

        /*
        // Loop through each document in the collection
        reportSnapshot.forEach((doc) => {
            const docData = doc.data(); // Stores data
            const date = new Date(doc.id); // Isolates date 

            // If date extracted is within range, adds that day's report data to the report object
            if (date >= start && date <= end) {
                report[doc.id] = docData;
            }
        });
        */

        // Uses attendanceRef date to check if it is within the range and stores the report data
        for (const doc of attendanceRef.docs) {
            const docDate = new Date(doc.id); // Parse the document ID as a date

            // Check if the document date is within the specified range
            if (docDate >= start && docDate <= end) {
                const reportRef = collection(firestoreDB, "attendance", doc.id, "report"); // Full path with report date
                const reportSnapshot = await getDocs(reportRef); // Stores full report

                // Loop through each document in the "report" subcollection
                reportSnapshot.forEach((reportDoc) => {
                    const reportData = reportDoc.data();
                    report[reportDoc.id] = {
                        ...reportData,
                        date: doc.id, // Include the date for context just in case it might be needed
                    };
                });
            }
        }

        return report;
    } catch (error) {
        console.error("Error fetching report: ", error);
        return {};
    }
}