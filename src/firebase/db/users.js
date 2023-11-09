import { firestoreDB } from "../../main";
import { getAuth } from 'firebase/auth';
import {
    doc,
    getDoc
} from 'firebase/firestore';

function getEmailUsername(email) {
    var atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.slice(0, atIndex);
    }
    return null; // Return null if there is no "@" symbol in the email
  }
  

export async function getUser(uid) {
    const docRef = doc(firestoreDB, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

export async function getCurrentUser() {
    const auth = getAuth();
    if (auth.currentUser) {
        const uid = getEmailUsername(auth.currentUser.email);
        return getUser(uid);
    }
    return null;
}