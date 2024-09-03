import { firestoreDB } from "../../main";
import {
    collection,
    getDocs,
} from 'firebase/firestore';

export async function getCampuses() {
    const campusesRef = collection(firestoreDB, "schools/tec.mx/campus");

    const docsSnap = await getDocs(campusesRef);

    if (docsSnap) {
        return docsSnap.docs.map(doc => doc.data());
    } else {
        return null;
    }
}