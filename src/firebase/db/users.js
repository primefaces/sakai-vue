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
    getFirestore,
} from 'firebase/firestore';
import { getUserProfilePicture } from "../img/users";
import * as XLSX from 'xlsx';

const db = getFirestore();


function getEmailUsername(email) {
    var atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.slice(0, atIndex);
    }
    return null;
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
    const q = query(usersRef, where('role', 'in', ['mae', 'coordi', 'admin', 'subjectCoordi', 'publi','tec']));

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

        const usersRef = collection(firestoreDB, "users");

        const querySnapshot = await getDocs(usersRef);


        const eligibleRoles = ['admin', 'coordi', 'mae','tec','publi'];

        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref; 
            const userData = doc.data(); 

    
            if (eligibleRoles.includes(userData.role)) {
                return updateDoc(userRef, {
                    weekSchedule: {} 
                });
            } else {
                return Promise.resolve();
            }
        });

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

                    //console.log(emailsFromExcel);
                    // Procesamos cada usuario
                    const promises = querySnapshot.docs.map(async (doc) => {
                        const userRef = doc.ref;
                        const userData = doc.data();
                        const eligibleRoles = ['mae', 'coordi', 'publi','tec']; // Roles que serán filtrados

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
                   // console.log("Roles actualizados con base en el archivo Excel.");
                } catch (error) {
                    console.error("Error al procesar el archivo Excel:", error);
                    throw error;
                }
            };

            reader.readAsArrayBuffer(file);
        } else {
            // Si no hay archivo, ejecutamos la lógica normal
            const eligibleRoles = ['mae', 'coordi', 'publi','tec'];

            const promises = querySnapshot.docs.map(async (doc) => {
                const userRef = doc.ref;
                const userData = doc.data();
                if (eligibleRoles.includes(userData.role)) {
                    const isWeekScheduleEmpty = Object.values(userData.weekSchedule).every(day => day.length === 0);
                    const isTotalTimeEquals0 = userData.totalTime == 0;
                    const hasNoSubjects = !userData.subjects || userData.subjects.length === 0;
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
    const badges = [
        { "id": "1", "name": "Mi primera asesoría", "description": "Da tu primera asesoría", "image_url": "/assets/badges/1.svg", "achieved": false },
        { "id": "2", "name": "MAE aprendiz", "description": "Da 10 asesorías", "image_url": "/assets/badges/2.svg", "achieved": false },
        { "id": "3", "name": "MAE en ascenso", "description": "Da 30 asesorías", "image_url": "/assets/badges/3.svg", "achieved": false },
        { "id": "4", "name": "MAE destacado", "description": "Da 50 asesorías", "image_url": "/assets/badges/4.svg", "achieved": false },
        { "id": "5", "name": "Super MAE", "description": "Da 100 asesorías", "image_url": "/assets/badges/5.svg", "achieved": false },
        { "id": "6", "name": "Leyenda MAE", "description": "Da 200 asesorías", "image_url": "/assets/badges/6.svg", "achieved": false },
        { "id": "7", "name": "MAE de MAEs", "description": "Da 500 asesorías", "image_url": "/assets/badges/7.svg", "achieved": false },
        { "id": "8", "name": "Cambio de look", "description": "Añade una foto de perfil", "image_url": "/assets/badges/8.svg", "achieved": false },
        { "id": "9", "name": "Trabajo bien hecho", "description": "Completa 80 horas", "image_url": "/assets/badges/9.svg", "achieved": false },
        { "id": "10", "name": "Siempre a tiempo", "description": "Obtén asistencia perfecta durante 1 periodo", "image_url": "/assets/badges/10.svg", "achieved": false },
        { "id": "11", "name": "Top MAE", "description": "Se #1 en el leaderboard", "image_url": "/assets/badges/11.svg", "achieved": false },
        { "id": "12", "name": "MAE", "description": "Obtén el rol de MAE", "image_url": "/assets/badges/12.svg", "achieved": false },
        { "id": "13", "name": "Coordi", "description": "Obtén el rol de coordi", "image_url": "/assets/badges/13.svg", "achieved": false },
        { "id": "14", "name": "Tecnológico", "description": "Obtén el rol de tecnología", "image_url": "/assets/badges/14.svg", "achieved": false },
        { "id": "15", "name": "Publicista", "description": "Obtén el rol de publicidad", "image_url": "/assets/badges/15.svg", "achieved": false },
        { "id": "16", "name": "Especialista", "description": "Mete 3 materias top", "image_url": "/assets/badges/16.svg", "achieved": false },
        { "id": "17", "name": "Trabajo de campo", "description": "Da 5 asesorías de materias top", "image_url": "/assets/badges/17.svg", "achieved": false },
        { "id": "18", "name": "Ups...", "description": "Pierde puntos de experiencia una vez", "image_url": "/assets/badges/18.svg", "achieved": false }
    ];

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
                    totalTime: 0,
                    badges: badges
                });
            } else {
            
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

export const saveScheduleSubjectsExperience = async () => {
    try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);

        if (usersSnap.empty) {
            console.error("No se encontraron usuarios en la tabla 'users'.");
            return;
        }

        const rolesPermitidos = ['admin', 'publi', 'mae', 'coordi', 'tec'];

        const updatePromises = []; 
        usersSnap.forEach(async (userDoc) => {
            const user = userDoc.data();

            if (!rolesPermitidos.includes(user.role)) {
                return;
            }

            let puntos = 0;

            if (user.subjects && user.subjects.length > 0) {
                puntos += 15;
            } else {
                puntos -= 30;
                await  updateUserAchievementBadge(user.uid, "18");
            }

            if (user.weekSchedule && Object.keys(user.weekSchedule).length > 0) {
                puntos += 100;
            } else {
                puntos -= 500;
                await updateUserAchievementBadge(user.uid, "18");
            }

            const userRef = doc(db, 'users', userDoc.id); 
            updatePromises.push(
                updateDoc(userRef, {
                    points: (user.points || 0) + puntos
                })
            );
        });

        await Promise.all(updatePromises);
    } catch (error) {
        console.error("Error al guardar la experiencia:", error);
    }
};


export async function updatePoints(uid, newPoints) {
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const user = users.find(user => user.uid === uid);

    if (user) {
        const userRef = doc(db, 'users', user.id); 
        const updatedPoints = (user.points || 0) + newPoints; 
        await updateDoc(userRef, { points: updatedPoints });
        //console.log(`Puntos actualizados para ${user.name}: ${updatedPoints}`);
        user.points = updatedPoints; 
        if (newPoints < 0){
            await updateUserAchievementBadge(uid, "18")
        }
    } else {
        console.log(`Usuario con uid ${uid} no encontrado.`);
    }

    return users; 
}

export async function getExperience() {
    const usersRef = collection(firestoreDB, "users");
    const q = query(usersRef, where('role', 'in', ['mae', 'coordi', 'admin', 'subjectCoordi', 'publi','tec']));

    const querySnapshot = await getDocs(q);

    if (querySnapshot) {
        let data = querySnapshot.docs.map(doc => doc.data());

        // Filtrar usuarios que tienen un nombre
        data = data.filter(item => item.name);

        // Ordenar por puntos de mayor a menor
        data.sort((a, b) => b.points - a.points);

        return data;
    } else {
        return null;
    }
}

// Funcion especial si mas adelante quieren agregar logros
export async function addBadgesToEligibleUsers() {
    try {
        const usersRef = collection(firestoreDB, "users");
        const querySnapshot = await getDocs(usersRef);

        const eligibleRoles = ['admin', 'coordi', 'mae', 'tec', 'publi'];

        const badges = [
            { "id": "1", "name": "Mi primera asesoría", "description": "Da tu primera asesoría", "image_url": "/assets/badges/1.svg", "achieved": false },
            { "id": "2", "name": "MAE aprendiz", "description": "Da 10 asesorías", "image_url": "/assets/badges/2.svg", "achieved": false },
            { "id": "3", "name": "MAE en ascenso", "description": "Da 30 asesorías", "image_url": "/assets/badges/3.svg", "achieved": false },
            { "id": "4", "name": "MAE destacado", "description": "Da 50 asesorías", "image_url": "/assets/badges/4.svg", "achieved": false },
            { "id": "5", "name": "Super MAE", "description": "Da 100 asesorías", "image_url": "/assets/badges/5.svg", "achieved": false },
            { "id": "6", "name": "Leyenda MAE", "description": "Da 200 asesorías", "image_url": "/assets/badges/6.svg", "achieved": false },
            { "id": "7", "name": "MAE de MAEs", "description": "Da 500 asesorías", "image_url": "/assets/badges/7.svg", "achieved": false },
            { "id": "8", "name": "Cambio de look", "description": "Añade una foto de perfil", "image_url": "/assets/badges/8.svg", "achieved": false },
            { "id": "9", "name": "Trabajo bien hecho", "description": "Completa 80 horas", "image_url": "/assets/badges/9.svg", "achieved": false },
            { "id": "10", "name": "Siempre a tiempo", "description": "Obtén asistencia perfecta durante 1 periodo", "image_url": "/assets/badges/10.svg", "achieved": false },
            { "id": "11", "name": "Top MAE", "description": "Se #1 en el leaderboard", "image_url": "/assets/badges/11.svg", "achieved": false },
            { "id": "12", "name": "MAE", "description": "Obtén el rol de MAE", "image_url": "/assets/badges/12.svg", "achieved": false },
            { "id": "13", "name": "Coordi", "description": "Obtén el rol de coordi", "image_url": "/assets/badges/13.svg", "achieved": false },
            { "id": "14", "name": "Tecnológico", "description": "Obtén el rol de tecnología", "image_url": "/assets/badges/14.svg", "achieved": false },
            { "id": "15", "name": "Publicista", "description": "Obtén el rol de publicidad", "image_url": "/assets/badges/15.svg", "achieved": false },
            { "id": "16", "name": "Especialista", "description": "Mete 3 materias top", "image_url": "/assets/badges/16.svg", "achieved": false },
            { "id": "17", "name": "Trabajo de campo", "description": "Da 5 asesorías de materias top", "image_url": "/assets/badges/17.svg", "achieved": false },
            { "id": "18", "name": "Ups...", "description": "Pierde puntos de experiencia una vez", "image_url": "/assets/badges/18.svg", "achieved": false }
        ];

        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref;
            const userData = doc.data();

            if (eligibleRoles.includes(userData.role)) {
                return updateDoc(userRef, {
                    badges: badges
                });
            } else {
                return Promise.resolve();
            }
        });

        await Promise.all(promises);

        console.log("Badges have been successfully added to eligible users.");
    } catch (error) {
        console.error("Error adding badges to eligible users: ", error);
        throw error;
    }
}


// actualizar le achieved del usuario 
export async function updateUserAchievementBadge(uid, badgeId) {
    try {

        const userRef = doc(firestoreDB, "users", uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error("Usuario no encontrado");
            return;
        }

        const userData = userDoc.data();
        const badges = userData.badges || [];

        const updatedBadges = badges.map((badge) => {
            if (badge.id === badgeId) {
                return { ...badge, achieved: true };
            }
            return badge;
        });

        await updateDoc(userRef, {
            badges: updatedBadges
        });

       // console.log(`El logro con id ${badgeId} se ha actualizado correctamente para el usuario ${uid}.`);
    } catch (error) {
        console.error("Error al actualizar el logro del usuario:", error);
        throw error;
    }
}


// Contador de badges
export async function countAchievedBadges(uid) {
    try {
        const userRef = doc(firestoreDB, "users", uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error("Usuario no encontrado");
            return 0;
        }

        const badges = userDoc.data().badges || [];

        const achievedCount = badges.reduce((count, badge) => {
            return count + (badge.achieved ? 1 : 0);
        }, 0);

        return achievedCount;
    } catch (error) {
        console.error("Error al contar los logros alcanzados:", error);
        throw error;
    }
}

// Añadir el background a los usuarios
export async function addBackgroundUsers() {
    try {
        const usersRef = collection(firestoreDB, "users");
        const querySnapshot = await getDocs(usersRef);

        const eligibleRoles = ['admin', 'coordi', 'mae', 'tec', 'publi'];

        const background = [
            { "id": "1", "image_url": "/assets/back/1.svg", "bought": true, "price": 0 },
            { "id": "2", "image_url": "/assets/back/2.svg", "bought": false, "price": 25 },
            { "id": "3", "image_url": "/assets/back/3.svg", "bought": false, "price": 25},
            { "id": "4", "image_url": "/assets/back/4.svg", "bought": false, "price": 25 },
            { "id": "5", "image_url": "/assets/back/5.svg", "bought": false, "price": 50 },
            { "id": "6", "image_url": "/assets/back/6.svg", "bought": false, "price": 50 },
            { "id": "7", "image_url": "/assets/back/7.svg", "bought": false, "price": 75 },
        ];

        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref;
            const userData = doc.data();

            if (eligibleRoles.includes(userData.role)) {
                return updateDoc(userRef, {
                    background:  background,
                    myBackground: "/assets/back/1.svg",
                    useCoins: 0,
                });
            } else {
                return Promise.resolve();
            }
        });

        await Promise.all(promises);

        console.log("Background have been successfully added to eligible users.");
    } catch (error) {
        console.error("Error adding background to eligible users: ", error);
        throw error;
    }
}



// actualizar le achieved del usuario 
export async function updateUserBackground(uid, backId, coins, userCoins) {
    try {
        const userRef = doc(firestoreDB, "users", uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error("Usuario no encontrado");
            return;
        }

        const userData = userDoc.data();
        const background = userData.background || [];

        const updatedBackground = background.map((back) => {
            if (back.id === backId) {
                return { ...back, bought: true };
            }
            return back;
        });
       
        await updateDoc(userRef, {
            background: updatedBackground,  
            useCoins: userCoins + coins
        });

        console.log(`El fondo con id ${backId} se ha actualizado correctamente para el usuario ${uid}.`);
    } catch (error) {
        console.error("Error al actualizar el fondo del usuario:", error);
        throw error;
    }
}

// Actualizar fondo
export async function updateUserBackgroundImage(uid, backgroundUrl) {
    try {
        const userRef = doc(firestoreDB, "users", uid);
        await updateDoc(userRef, {
            myBackground: backgroundUrl
        });
        console.log(`El fondo se ha actualizado a ${backgroundUrl} para el usuario ${uid}.`);
    } catch (error) {
        console.error("Error al actualizar el fondo del usuario:", error);
        throw error;
    }
}


export async function getTotalMaes() {
    try {
        const usersRef = collection(firestoreDB, "users");

        const eligibleRoles = ['admin', 'coordi', 'mae', 'tec', 'publi'];

        const q = query(usersRef, where("role", "in", eligibleRoles));

        const querySnapshot = await getDocs(q);

        return querySnapshot.size -1 ; 
    } catch (error) {
        console.error("Error al obtener el total de MAEs: ", error);
        throw error;
    }
}



// Añadir nuevas variables
export async function addExtraVariables() {
    try {
        const usersRef = collection(firestoreDB, "users");
        const querySnapshot = await getDocs(usersRef);

        const eligibleRoles = ['admin', 'coordi', 'mae', 'tec', 'publi'];

        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref;
            const userData = doc.data();

            if (eligibleRoles.includes(userData.role)) {
                return updateDoc(userRef, {
                    asesoriasGrupales: 0,
                });
            } else {
                return Promise.resolve();
            }
        });

        await Promise.all(promises);

        console.log("Background have been successfully added to eligible users.");
    } catch (error) {
        console.error("Error adding background to eligible users: ", error);
        throw error;
    }
}
