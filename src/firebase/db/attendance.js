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

// Gets dates between specified start and end date
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

// Gets the attendance reports for every day
export async function getReportByDateRange(startDate, endDate) {
    const dateStrings = getDateStringsBetween(startDate, endDate);
    const report = [];

    // Checks each document date w the reports
    for (const date of dateStrings) {
        const reportRef = collection(firestoreDB, "attendance", date, "report");
        try {
            const reportSnap = await getDocs(reportRef);
            // Makes sure not empty date w no attendance
            if (!reportSnap.empty) {
                reportSnap.forEach((doc) => {
                    /*report.push({
                        id: doc.id,
                        ...doc.data(),
                        date,
                    });*/
                    const data = doc.data(); 
                    // Only keeps id and report, modify if want other fields (like name or email)
                    report.push({
                        id: doc.id, // Student matricula
                        report: data.report, // (A, R, F, J)
                    });
                });
            }
        } catch (error) {
            console.warn(`Skipping ${date}:`, error.message);
        }
    }

    return report;
}