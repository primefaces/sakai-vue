import { firestoreDB } from "../../main";
import { getAuth } from 'firebase/auth';
import {
    doc,
    collection,
    query,
    where,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    serverTimestamp,
    deleteField,
    increment
} from 'firebase/firestore';
import { getUserProfilePicture } from "../img/users";

function getEmailUsername(email) {
    var atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.slice(0, atIndex);
    }
    return null; // Return null if there is no "@" symbol in the email
}

export async function createUser(userInfo) {

    userInfo.id = getEmailUsername(userInfo.email);
    userInfo.uid = getEmailUsername(userInfo.email);

    userInfo.career = userInfo.major.id
    userInfo.area = userInfo.major.school

    userInfo.name = userInfo.firstname.trim() + ' ' + userInfo.lastname.trim();

    const userRef = doc(firestoreDB, "users", userInfo.uid);
    return await setDoc(userRef, userInfo);
}

export async function getUser(uid) {
    const userRef = doc(firestoreDB, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        const data = docSnap.data()
        const profilePictureUrl = await getUserProfilePicture(data.email);
        return { ...data, profilePictureUrl };
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

export async function getMaes(getProfilePicture = false) {
    const usersRef = collection(firestoreDB, "users");
    const q = query(usersRef, where('role', 'in', ['mae', 'coordi', 'admin', 'subjectCoordi']));

    const querySnapshot = await getDocs(q);

    if (querySnapshot) {
        if (getProfilePicture) {
            return Promise.all(querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const profilePictureUrl = await getUserProfilePicture(data.email);
                return { ...data, profilePictureUrl };
            }));
        }
        else {
            return querySnapshot.docs.map(doc => doc.data());
        }
    } else {
        return null;
    }
}

export async function getUsersWithActiveSession(getProfilePicture = false) {
    try {
        // Get a reference to the users collection
        const usersRef = collection(firestoreDB, "users");

        // Use where clause to filter users with 'activeSession' object
        const q = query(usersRef, where('activeSession', '!=', null));
        const querySnapshot = await getDocs(q);

        // Process the query results
        if (querySnapshot) {
            // Calculate the time 5 hours ago in seconds (18000 is 5hrs in seconds)
            const fiveHoursAgoTimestampSeconds = Math.floor(Date.now() / 1000) - 18000;

            // Filter the docs before mapping to get profile pictures
            const filteredDocs = querySnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.activeSession.startTime.seconds > fiveHoursAgoTimestampSeconds;
            });

            // Map the filtered docs to an array of promises
            const usersPromises = filteredDocs.map(async (doc) => {
                const data = doc.data();
                const profilePictureUrl = await getUserProfilePicture(data.email);
                return { ...data, profilePictureUrl };
            });

            // Wait for all promises to resolve and return the users
            return Promise.all(usersPromises);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving users:', error);
    }
};

export async function updateUserInfo(userId, userInfo) {
    userInfo['name'] = userInfo['firstname'].trim() + ' ' + userInfo['lastname'].trim()
    const userRef = doc(firestoreDB, "users", userId);
    return await updateDoc(userRef, userInfo);
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

export async function getTodaysMae() {
    try {
        // Step 1: Define the query to get users with a role different from 'user'
        const usersRef = collection(firestoreDB, "users");
        const roleQuery = query(usersRef, where("role", "!=", "user"));

        // Step 2: Execute the role query
        const querySnapshot = await getDocs(roleQuery);
        
        // Step 3: Get current day of the week
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const currentDayIndex = new Date().getDay();
        const currentDay = daysOfWeek[currentDayIndex]


        // Step 4: Filter results client-side to include only those with 'wednesday' in 'weekSchedule'
        const users = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            //   if (data.weekSchedule && data.weekSchedule["thursday"]) {
            if (data.weekSchedule && data.weekSchedule[currentDay]) {
                users.push(data);
            }
        });

        // Step 5: Sort users by the earliest start time of the current day

        console.log(users);

        users.sort((a, b) => {

            // TODO: Change to this when updating user schedule format
            // const aStartTime = a.weekSchedule[currentDay][0]?.start;
            // const bStartTime = b.weekSchedule[currentDay][0]?.start;            

            const bStartTime = b.weekSchedule[currentDay][0]?.start ?? `${Math.round((b.weekSchedule[currentDay][0]))}:00`;
            const aStartTime = a.weekSchedule[currentDay][0]?.start ?? `${Math.round((a.weekSchedule[currentDay][0]))}:00`;
            
            // Convert time strings to Date objects for comparison
            const aTime = aStartTime ? new Date(`1970-01-01T${aStartTime}:00Z`) : new Date();
            const bTime = bStartTime ? new Date(`1970-01-01T${bStartTime}:00Z`) : new Date();

            return aTime - bTime;
        });

        return users;
    } catch (error) {
        console.error("Error fetching filtered users: ", error);
        return [];
    }
}

export async function startActiveSession(userId, userInfo, location) {
    try {
        const userRef = doc(firestoreDB, "users", userId);
        return await updateDoc(userRef, {
            activeSession: {
                peerInfo: userInfo,
                location,
                status: 'PENDING',
                startTime: serverTimestamp(),
            }
        });
    } catch (error) {
        console.error("Error fetching filtered users: ", error);
        return [];
    }
}

export async function stopActiveSession(userId) {
    try {
        const userRef = doc(firestoreDB, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        // Gets start time from current Active Session
        const userData = userDoc.data();
        const startTime = userData.activeSession?.startTime?.toDate();

        if (!startTime) {
            throw new Error("Active session start time not found");
        }

        // Calculates and adds the duration of the current session to the total time
        const currentTime = new Date();
        const differenceInMinutes = Math.floor((currentTime - startTime) / (1000 * 60));

        const totalTime = (userData.totalTime || 0) + differenceInMinutes;

        // Updates the total time and stops current session
        await updateDoc(userRef, {
            totalTime: totalTime,
            activeSession: deleteField()
        });

        return { totalTime, differenceInMinutes, activeSessionDeleted: true };
    } catch (error) {
        console.error("Error stopping active session: ", error);
        return null;
    }
}

export async function incrementTotalTime(userId, time) {
    const userRef = doc(firestoreDB, "users", userId);

    await updateDoc(userRef, {
        totalTime: increment(time*60)
    });
}