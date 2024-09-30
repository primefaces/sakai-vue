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
import * as XLSX from 'xlsx';

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

    // Crear dos arrays, uno para los días futuros y otro para los pasados
    const futureDays = daysOfWeek.slice(today);
    const pastDays = daysOfWeek.slice(0, today);

    let closestDay = null;
    let earliestStartTime = null;

    // Buscar primero entre los días futuros (desde hoy hasta el final de la semana)
    futureDays.forEach(day => {
        if (Array.isArray(schedules[day])) {
            schedules[day].forEach(schedule => {
                if (schedule.start) {
                    if (closestDay === null || (earliestStartTime === null || schedule.start < earliestStartTime)) {
                        closestDay = day;
                        earliestStartTime = schedule.start;
                    }
                }
            });
        }
    });

    // Si no se encontró ningún día en el futuro, buscar en los días pasados (inicio de semana hasta hoy)
    if (closestDay === null) {
        pastDays.forEach(day => {
            if (Array.isArray(schedules[day])) {
                schedules[day].forEach(schedule => {
                    if (schedule.start) {
                        if (closestDay === null || (earliestStartTime === null || schedule.start < earliestStartTime)) {
                            closestDay = day;
                            earliestStartTime = schedule.start;
                        }
                    }
                });
            }
        });
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

        // Obtener el día actual
        const today = new Date().getDay(); // Día actual (0-6)

        // Ordenar por el día más cercano, la hora de inicio más temprana y alfabéticamente por nombre
        data.sort((a, b) => {
            // Obtener el día más cercano y la hora de inicio más temprana
            const { day: dayA, startTime: startTimeA } = getClosestDayAndStartTime(a.weekSchedule);
            const { day: dayB, startTime: startTimeB } = getClosestDayAndStartTime(b.weekSchedule);

            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'];

            // Crear un array cíclico desde el día actual
            const daysOrdered = [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];

            // Comparar días más cercanos, teniendo en cuenta el ciclo
            const dayIndexA = daysOrdered.indexOf(dayA);
            const dayIndexB = daysOrdered.indexOf(dayB);
            const dayComparison = (dayIndexA === -1 ? 1 : (dayIndexB === -1 ? -1 : dayIndexA - dayIndexB));
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

export async function checkAndUpdateUserRole(file = null) {
    try {
        const usersRef = collection(firestoreDB, "users");
        const querySnapshot = await getDocs(usersRef);

        // Si se subió un archivo Excel, ejecutamos la lógica relacionada con el archivo
        if (file) {
            // Leer y procesar el archivo Excel
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[3]];
                    const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    // Convertimos las matrículas del Excel a correos en formato lowercase@tec.mx
                    const emailsFromExcel = excelData.slice(1)
                        .map(row => row[1]?.toLowerCase() + '@tec.mx')
                        .filter(email => email && !['undefined@tec.mx', 'zzzzz@tec.mx'].includes(email)); // Filtrar valores no deseados

                    console.log(emailsFromExcel);
                    // Procesamos cada usuario
                    const promises = querySnapshot.docs.map(async (doc) => {
                        const userRef = doc.ref;
                        const userData = doc.data();
                        const eligibleRoles = ['mae', 'coordi', 'publi']; // Roles que serán filtrados

                        if (eligibleRoles.includes(userData.role)) {
                            const userEmail = userData.email?.toLowerCase(); // Convertir a minúsculas para comparar

                            // Si el correo no está en la lista de correos del Excel, actualizamos el rol a "exmae"
                            if (!emailsFromExcel.includes(userEmail)) {
                                return updateDoc(userRef, { role: "exmae" });
                            }
                        }

                        return Promise.resolve();
                    });

                    await Promise.all(promises);
                    console.log("Roles actualizados con base en el archivo Excel.");
                } catch (error) {
                    console.error("Error al procesar el archivo Excel:", error);
                    throw error;
                }
            };

            reader.readAsArrayBuffer(file);
        } else {
            // Si no hay archivo, ejecutamos la lógica normal
            const eligibleRoles = ['mae', 'coordi', 'publi'];

            const promises = querySnapshot.docs.map(async (doc) => {
                const userRef = doc.ref;
                const userData = doc.data();

                // Verificar si el rol es "mae", "coordi" o "publi"
                if (eligibleRoles.includes(userData.role)) {

                    // Verificar si weekSchedule está vacío
                    const isWeekScheduleEmpty = Object.values(userData.weekSchedule).every(day => day.length === 0);

                    // Verificar si totalTime es 0
                    const isTotalTimeEquals0 = userData.totalTime == 0;

                    // Verificar si subjects está vacío
                    const hasNoSubjects = !userData.subjects || userData.subjects.length === 0;

                    // Si no tiene horario, su tiempo es 0 y no tiene materias, actualizar el rol
                    if (isWeekScheduleEmpty && isTotalTimeEquals0 && hasNoSubjects) {
                        return updateDoc(userRef, { role: "exmae" });
                    }
                }

                return Promise.resolve();
            });

            await Promise.all(promises);
            console.log("Roles actualizados con base en weekSchedule, totalTime, y subjects.");
        }
    } catch (error) {
        console.error("Error actualizando roles de los usuarios: ", error);
        throw error;
    }
}



export async function updateUserToMae(data) {
    const { role, matricula, status } = data;

    // Asegurarse de que los datos necesarios no sean nulos
    if (!role || !matricula || !status) {
        throw new Error("role, matricula, and status are required fields.");
    }

    // Buscar el usuario en la base de datos usando la matricula
    try {
        const usersRef = collection(firestoreDB, "users");
        const userQuery = query(usersRef, where("email", "==", `${matricula.toLowerCase()}@tec.mx`));
        const querySnapshot = await getDocs(userQuery);
    
        if (querySnapshot.empty) {
            console.log("No user found with the given matricula.");
            return;
        }

        // Procesar cada usuario encontrado
        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref;
            const userData = doc.data();

    
            // Condicionar la actualización según el role o status
            if (userData.role === 'user' || userData.status === 'estudiante') {
                // Si role es "user" o status es "estudiante", actualizar todos los campos
                return updateDoc(userRef, {
                    role: role.value,
                    status: status.value,
                    weekSchedule: {}, 
                    subjects: [],
                    totalTime: 0
                });
            } else {
                // De lo contrario, solo actualizar role y status
                return updateDoc(userRef, {
                    role: role.value,
                    status: status.value
                });
            }
        });

        await Promise.all(promises);
        console.log("Usuarios actualizados exitosamente.");
    } catch (error) {
        console.error("Error al actualizar los usuarios: ", error);
    }
}
