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
    increment,
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

// Función para obtener el día más cercano en la semana y la hora de inicio más temprana
export const getClosestDayAndStartTime = (schedules) => {
    if (typeof schedules !== 'object' || schedules === null || Array.isArray(schedules)) {
        console.error('Expected a map of schedules, but received:', schedules);
        return { day: null, startTime: null };
    }

    const today = new Date().getDay(); // Día actual (0-6) donde 0 es domingo
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Buscar el día más cercano con horarios
    let closestDay = null;
    let earliestStartTime = null;

    Object.keys(schedules).forEach(day => {
        if (Array.isArray(schedules[day])) {
            schedules[day].forEach(schedule => {
                if (schedule.start) {
                    const dayIndex = daysOfWeek.indexOf(day);
                    if (dayIndex >= today) {
                        if (closestDay === null || dayIndex < daysOfWeek.indexOf(closestDay) || (dayIndex === daysOfWeek.indexOf(closestDay) && (earliestStartTime === null || schedule.start < earliestStartTime))) {
                            closestDay = day;
                            earliestStartTime = schedule.start;
                        }
                    }
                }
            });
        }
    });

    // Si no se encuentra ningún día, establecer valores nulos
    if (closestDay === null) {
        return { day: null, startTime: null };
    }

    return { day: closestDay, startTime: earliestStartTime };
};



export async function getMaes() {
    const usersRef = collection(firestoreDB, "users");
    const q = query(usersRef, where('role', 'in', ['mae', 'coordi', 'admin', 'subjectCoordi', 'publi']));

    const querySnapshot = await getDocs(q);

    if (querySnapshot) {
        let data = querySnapshot.docs.map(doc => doc.data());

        // Filtrar usuarios que tienen un nombre
        data = data.filter(item => item.name);

        // Obtener la URL de la foto de perfil
        data = await Promise.all(data.map(async (item) => {
            const profilePictureUrl = await getUserProfilePicture(item.email);
            return { ...item, profilePictureUrl };
        }));

        // Ordenar por el día más cercano, la hora de inicio más temprana y alfabéticamente por nombre
        data.sort((a, b) => {
            // Obtener el día más cercano y la hora de inicio más temprana
            const { day: dayA, startTime: startTimeA } = getClosestDayAndStartTime(a.weekSchedule);
            const { day: dayB, startTime: startTimeB } = getClosestDayAndStartTime(b.weekSchedule);

            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            // Comparar días más cercanos
            const dayComparison = (dayA === null ? 1 : (dayB === null ? -1 : daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB)));
            if (dayComparison !== 0) return dayComparison;

            // Comparar horas de inicio si los días son iguales
            const startTimeComparison = (startTimeA === null ? 1 : (startTimeB === null ? -1 : startTimeA.localeCompare(startTimeB)));
            if (startTimeComparison !== 0) return startTimeComparison;

            // Comparar alfabéticamente si ambos días y horas son iguales
            return a.name.localeCompare(b.name);
        });

        return data;
    } else {
        return null;
    }
}


/**
 * Retrieve users with an active session within the last 5 hours.
 *
 * This function queries the "users" collection in Firestore, filtering for users who have an 
 * 'activeSession' object that was started within the last 5 hours. If `getProfilePicture` is set 
 * to true, the function will also fetch the user's profile picture URL using the `getUserProfilePicture` 
 * function.
 *
 * @param {boolean} getProfilePicture - (Optional) Flag to determine whether to fetch profile pictures for users.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user data objects with their active session 
 * information. If `getProfilePicture` is true, each object will also include a `profilePictureUrl` field.
 * @throws Will log an error if there is an issue with the Firestore query or data processing.
 */
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
        users.sort((a, b) => {

            // TODO: Change to this when updating user schedule format
            const aStartTime = a.weekSchedule[currentDay][0]?.start;
            const bStartTime = b.weekSchedule[currentDay][0]?.start;            

            // const bStartTime = b.weekSchedule[currentDay][0]?.start ?? `${Math.round((b.weekSchedule[currentDay][0]))}:00`;
            // const aStartTime = a.weekSchedule[currentDay][0]?.start ?? `${Math.round((a.weekSchedule[currentDay][0]))}:00`;
            
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

        if (differenceInMinutes > 310) {
            await updateDoc(userRef, {
                activeSession: deleteField()
            });
            return { timeLimitExceded: true, activeSessionDeleted: false, differenceInMinutes }
        }

        const totalTime = (userData.totalTime || 0) + differenceInMinutes;

        // Updates the total time and stops current session
        await updateDoc(userRef, {
            totalTime: totalTime,
            activeSession: deleteField()
        });

        return { totalTime, differenceInMinutes, activeSessionDeleted: true };
    } catch (error) {
        return { activeSessionDeleted: false };
    }
}

export async function incrementTotalTime(userId, time) {
    const userRef = doc(firestoreDB, "users", userId);

    await updateDoc(userRef, {
        totalTime: increment(time*60)
    });
}


export async function updateUserProfilePicture(userId, photoURL) {
    try {
        const userRef = doc(firestoreDB, 'users', userId);
        console.log(userId)
        // Actualizar el documento con la nueva URL de la foto
        await updateDoc(userRef, {
            photoURL: photoURL
        });
        
    } catch (error) {
        console.error('Error updating user profile picture: ', error);
        throw error;
    }
}

/**
 * Clears the content of the weekSchedule field for users with specific roles (admin, coordi, mae),
 * but keeps the field as an empty object.
 *
 * @returns {Promise<void>} - A promise that resolves when all eligible weekSchedules are cleared.
 */
export async function clearAllUsersWeekSchedule() {
    try {
        // Get a reference to the "users" collection
        const usersRef = collection(firestoreDB, "users");

        // Get all user documents from the collection
        const querySnapshot = await getDocs(usersRef);

        // Roles that are eligible for clearing the weekSchedule
        const eligibleRoles = ['admin', 'coordi', 'mae'];

        // Iterate through each document and update the weekSchedule field to an empty object if the role matches
        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref; // Reference to the specific user document
            const userData = doc.data(); // Get the user data

            // Check if the user's role is in the list of eligible roles
            if (eligibleRoles.includes(userData.role)) {
                return updateDoc(userRef, {
                    weekSchedule: {} // Set weekSchedule to an empty object
                });
            } else {
                return Promise.resolve(); // Skip the update for users with other roles
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        console.log("Week schedule content has been successfully cleared for eligible users.");
    } catch (error) {
        console.error("Error clearing weekSchedule content for eligible users: ", error);
        throw error;
    }
}
