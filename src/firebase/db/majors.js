import { firestoreDB } from "../../main";
import {
    collection,
    getDocs,
} from 'firebase/firestore';

export async function getMajors() {
    const majorsRef = collection(firestoreDB, "schools/tec.mx/majors");

    const docsSnap = await getDocs(majorsRef);

    if (docsSnap) {
        return docsSnap.docs.map(doc => doc.data());
    } else {
        return null;
    }
}