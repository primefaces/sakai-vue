import { firestoreDB } from "../../main";
import { getAuth } from 'firebase/auth';
import {
    doc,
    collection,
    query,
    where,
    getDoc,
    getDocs,
    updateDoc
} from 'firebase/firestore';

function getEmailUsername(email) {
    var atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.slice(0, atIndex);
    }
    return null; // Return null if there is no "@" symbol in the email
  }
  

export async function getUser(uid) {
    const userRef = doc(firestoreDB, "users", uid);
    const docSnap = await getDoc(userRef);

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

export async function getMaes() {
    const usersRef = collection(firestoreDB, "users");
    const q = query(usersRef, where('role', 'in', ['mae', 'coordi', 'admin', 'subjectCoordi']));

    const querySnapshot = await getDocs(q);


    if (querySnapshot) {
        return querySnapshot.docs.map(doc => doc.data());
    } else {
        return null;
    }
}

export async function updateUserSubjects(userId, newSubjects) {
    const userRef = doc(firestoreDB, "users", userId);
    return await updateDoc(userRef, {
        subjects: newSubjects
    });
}

export async function updateUserSchedule(userId, newSchedule) {
    const userRef = doc(firestoreDB, "users", userId);
    // Iterate over object keys
    for (const day in newSchedule) {
        // Check if the value is an empty array
        if (Array.isArray(newSchedule[day]) && newSchedule[day].length === 0) {
        // Delete the key with an empty array value
        delete newSchedule[day];
        }
    }
    return await updateDoc(userRef, {
        weekSchedule: newSchedule
    });
}