import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    Timestamp
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