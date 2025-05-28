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

// To get date info
/*
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
*/
export async function addRegister(userInfo, date) {
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        // ✅ Ensure root date doc is created with a dummy field
        const dateDocRef = doc(firestoreDB, "attendance", dateString);
        await setDoc(dateDocRef, { initialized: true }, { merge: true });

        const reportRef = doc(firestoreDB, "attendance", dateString, "report", userInfo.uid);
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

/*
// Para obtener todos los reportes de asistencia entre rango de fechas 
export async function getReportByDateRange (startDate, endDate) {
    console.log('Fetching report between:', startDate, 'and', endDate);

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const attendanceRef = collection(firestoreDB, "attendance");
        //const docs = await attendanceRef.listDocuments();
        const dateStrings = docs.map(doc => doc.id); // Use Node.JS to map all entries 

        //const attendanceRef = collection(firestoreDB, "attendance"); // Reference to the root collection
        const attendanceSnapshot = await getDocs(attendanceRef); // Get all documents in the collection temporarily

        console.log('Attendance dates found:', attendanceSnapshot.docs.map(d => d.id)); // debug to show the dates
        console.log('Dates: ', dateStrings);


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
        // PREVIOUS CLOSING HERE 

        // Uses attendanceRef date to check if it is within the range and stores the report data
        for (const doc of attendanceSnapshot.docs) {
            const docDate = new Date(doc.id); // Parse the document ID as a date

            // Check if the document date is within the specified range
            if (docDate >= start && docDate <= end) {
                const reportRef = collection(firestoreDB, "attendance", doc.id, "report"); // Full path with report date
                const reportSnapshot = await getDocs(reportRef); // Stores full report

                // Loop through each document in the "report" subcollection
                reportSnapshot.forEach((reportDoc) => {
                    const reportData = reportDoc.data();
                    console.log('✅ Processed date in range:', doc.id);

                    
                    // Creates array of reports
                    report.push({
                        id: reportDoc.id,
                        ...reportData,
                        date: doc.id, // string like '2025-03-14'
                    });

                    /*report[reportDoc.id] = {
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

export async function getReportByDateRange(startDate, endDate) {
    console.log('Fetching report between:', startDate, 'and', endDate);

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const attendanceRef = collection(firestoreDB, "attendance");
        const attendanceSnapshot = await getDocs(attendanceRef);

        console.log('Attendance dates found:', attendanceSnapshot.docs.map(d => d.id));

        const report = [];

        for (const doc of attendanceSnapshot.docs) {
            const docDate = new Date(doc.id);

            if (docDate >= start && docDate <= end) {
                const reportRef = collection(firestoreDB, "attendance", doc.id, "report");
                const reportSnapshot = await getDocs(reportRef);

                reportSnapshot.forEach((reportDoc) => {
                    const reportData = reportDoc.data();
                    report.push({
                        id: reportDoc.id,
                        ...reportData,
                        date: doc.id,
                    });
                });
            }
        }

        return report;
    } catch (error) {
        console.error("Error fetching report: ", error);
        return [];
    }
}
*/


function getDateStringsBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList = [];

    while (start <= end) {
        const year = start.getFullYear();
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const day = String(start.getDate()).padStart(2, '0');
        dateList.push(`${year}-${month}-${day}`);
        start.setDate(start.getDate() + 1);
    }

    return dateList;
}

export async function getReportByDateRange(startDate, endDate) {
    console.log('📅 Fetching report between:', startDate, 'and', endDate);

    const dateStrings = getDateStringsBetween(startDate, endDate);
    const report = [];

    for (const date of dateStrings) {
        const reportRef = collection(firestoreDB, "attendance", date, "report");
        try {
            const reportSnap = await getDocs(reportRef);

            if (!reportSnap.empty) {
                console.log(`✅ Found report data for ${date}`);
                reportSnap.forEach((doc) => {
                    report.push({
                        id: doc.id,
                        ...doc.data(),
                        date,
                    });
                });
            }
        } catch (error) {
            console.warn(`⚠️ Skipping ${date}:`, error.message);
        }
    }

    return report;
}