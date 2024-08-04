import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';

export async function addAsesoria(maeInfo, userInfo, subject, comment, rating) {
    
    return await addDoc(collection(firestoreDB, "asesorias"), {
        peerInfo: maeInfo,
        userInfo,
        rating,
        comment,
        subject,
        date: Timestamp.now()
    });
}

export async function getAsesoriasCountForUserInCurrentSemester(userId) {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        let startOfSemester, endOfSemester;

        // Determine the current semester range
        if (now.getMonth() < 6) { // January to June
            startOfSemester = new Date(currentYear, 0, 1); // January 1st
            endOfSemester = new Date(currentYear, 5, 30, 23, 59, 59, 999); // June 30th, end of day
        } else { // July to December
            startOfSemester = new Date(currentYear, 6, 1); // July 1st
            endOfSemester = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st, end of day
        }

        // Convert to Firestore Timestamps
        const startTimestamp = Timestamp.fromDate(startOfSemester);
        const endTimestamp = Timestamp.fromDate(endOfSemester);

        // Construct the query
        const requestsRef = collection(firestoreDB, "asesorias");
        const q = query(
            requestsRef,
            where(`peerInfo.uid`, "==", userId),
            where("date", ">=", startTimestamp),
            where("date", "<=", endTimestamp)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        console.log(querySnapshot)

        // Return the number of documents
        return querySnapshot.size;
    } catch (error) {
        console.error("Error fetching request count: ", error);
        return 0;
    }
}
