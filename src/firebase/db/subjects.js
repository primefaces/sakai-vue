import { firestoreDB } from "../../main";
import {
    collection,
    getDocs,
    query,
    orderBy,
} from 'firebase/firestore';

export async function getSubjects() {
    const subjectsRef = collection(firestoreDB, "schools/tec.mx/subjects");
    
    const q = query(subjectsRef, orderBy("name"));

    const docsSnap = await getDocs(q);

    if (!docsSnap.empty) {
        return docsSnap.docs.map(doc => doc.data());
    } else {
        return null;
    }
}