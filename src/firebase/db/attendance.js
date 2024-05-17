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
        const reportRef = doc(firestoreDB, "attendance", getCurrentDateFormatted(), "report", userInfo.uid);

        console.log(getCurrentDateFormatted())
        console.log(userInfo.uid)
        console.log(userInfo)

        return await setDoc(reportRef, {
            ...userInfo,
            report
        });
    } catch (error) {
        console.error("Error fetching filtered users: ", error);
        return [];
    }
}

