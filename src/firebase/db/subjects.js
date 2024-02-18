import { firestoreDB } from "../../main";
import {
    collection,
    getDocs
} from 'firebase/firestore';

export async function getSubjects() {
    const subjectsRef = collection(firestoreDB, "schools/tec.mx/subjects");

    const docsSnap = await getDocs(subjectsRef);

    if (docsSnap) {
        return docsSnap.docs.map(doc => doc.data());
    } else {
        return null;
    }
}