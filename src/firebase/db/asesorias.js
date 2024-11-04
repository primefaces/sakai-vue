import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { 
    updatePoints,
    updateUserAchievementBadge
} from './users'; 


export async function addAsesoria(maeInfo, userInfo, subject, comment, rating) {
    
     await addDoc(collection(firestoreDB, "asesorias"), {
        peerInfo: maeInfo,
        userInfo,
        rating,
        comment,
        subject,
        date: Timestamp.now()
    });

    updateExperienceAsesorias(maeInfo.uid ,userInfo.uid, subject.id,Timestamp.now());
    return;
}

export async function getAsesoriasCountForUserInCurrentSemester(userId) {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        let startOfSemester, endOfSemester;

        // Determine the current semester range
        if (now.getMonth() < 6) { // January to June
            startOfSemester = new Date(currentYear, 0, 1); // January 1st
            endOfSemester = new Date(currentYear, 5, 30, 23, 59, 59, 999); // June 30th, end of day
        } else { // July to December
            startOfSemester = new Date(currentYear, 6, 1); // July 1st
            endOfSemester = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st, end of day
        }

        const startTimestamp = Timestamp.fromDate(startOfSemester);
        const endTimestamp = Timestamp.fromDate(endOfSemester);
        const valueAsesoria = false;
        const requestsRef = collection(firestoreDB, "asesorias");

        // Realiza la consulta solo por userId
        const q = query(requestsRef, where("peerInfo.uid", "==", userId));
        const querySnapshot = await getDocs(q);

        // Filtrar los resultados en el cliente
        const filteredCount = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.date >= startTimestamp && data.date <= endTimestamp && data.duplicate === valueAsesoria;
        }).length;

        return filteredCount;
    } catch (error) {
        console.error("Error fetching request count: ", error);
        return 0;
    }
}



export async function getAsesorias(startDate = null, endDate = null) {
    try {
        const asesoriasRef = collection(firestoreDB, "asesorias");
        let q;

        if (startDate && endDate) {
            // Ajustar endDate para incluir todo el último día
            const endDateAdjusted = new Date(endDate);
            endDateAdjusted.setHours(23, 59, 59, 999);

            const startTimestamp = Timestamp.fromDate(new Date(startDate));
            const endTimestamp = Timestamp.fromDate(endDateAdjusted);

            q = query(
                asesoriasRef,
                where("date", ">=", startTimestamp),
                where("date", "<=", endTimestamp)
            );
        } else {
            q = query(asesoriasRef);
        }

        const querySnapshot = await getDocs(q);
        const asesorias = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Ordena las asesorías por fecha de la más reciente a la más antigua
        asesorias.sort((a, b) => {
            const dateA = a.date?.seconds || 0;
            const dateB = b.date?.seconds || 0;
            return dateB - dateA;
        });

        return asesorias;
    } catch (error) {
        console.error("Error fetching asesorias: ", error);
        return [];
    }
}

// Función para obtener asesorías por UID, reutilizando getAsesorias
export async function getAsesoriasByUid(uid) {
    try {
        const startDate = new Date('2024-08-05'); 
        const today = new Date(); 
        const asesorias = await getAsesorias(startDate, today);

        const asesoriasFiltradas = asesorias.filter(asesoria => asesoria.peerInfo?.uid === uid);

        return asesoriasFiltradas;
    } catch (error) {
        console.error("Error fetching asesorias by UID: ", error);
        return [];
    }
}

export async function updateAllExperienceAsesorias() {
    const startDate = new Date('2024-08-05');
    const today = new Date();
    const asesorias = await getAsesorias(startDate, today);
    const processed = new Set(); // Conjunto para evitar procesar la misma asesoría más de una vez

    for (const advisory of asesorias) {
        const { peerInfo, userInfo, date, subject } = advisory;
        const advisoryDate = date.toDate();

        // Generar clave única para evitar reprocesar la misma asesoría
        const key = `${peerInfo.uid}-${userInfo.uid}-${subject.id}-${advisoryDate.getTime()}`;
        if (processed.has(key)) continue; // Si ya se procesó, omitimos esta asesoría
        processed.add(key); // Marcar como procesada

        // Encontrar asesorías similares en un rango de 2 horas
        const similarAdvisories = asesorias.filter(ad => {
            const adDate = ad.date.toDate();
            return (
                ad.peerInfo.uid === peerInfo.uid &&
                ad.userInfo.uid === userInfo.uid &&
                ad.subject.id === subject.id &&
                Math.abs(adDate.getTime() - advisoryDate.getTime()) <= 2 * 60 * 60 * 1000 // 2 horas en ms
            );
        });

        // Iteramos sobre las asesorías similares y actualizamos el campo 'duplicate'
        for (let i = 0; i < similarAdvisories.length; i++) {
            const ad = similarAdvisories[i];
            const isDuplicate = i > 0; // La primera no es duplicada, las demás sí

            try {
                await updateAdvisoryDuplicateField(ad.id, isDuplicate);
                console.log(
                    ad, 
                    isDuplicate 
                        ? "Marcada como duplicada" 
                        : "Primera ocurrencia - No duplicada"
                );
            } catch (error) {
                console.error(`Error al actualizar la asesoría con ID: ${ad.id}`, error);
            }
        }
    }
}

// Función auxiliar para actualizar el campo 'duplicate' en una asesoría
async function updateAdvisoryDuplicateField(advisoryDate, isDuplicate) {
    try {
        const asesoriasRef = collection(firestoreDB, "asesorias");

        const q = query(asesoriasRef, where("date", "==", advisoryDate));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No se encontró ninguna asesoría con la fecha: ${advisoryDate}`);
            return;
        }

        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, { duplicate: isDuplicate });

        console.log(`Asesoría actualizada correctamente con fecha: ${advisoryDate}`);
    } catch (error) {
        console.error(`Error actualizando la asesoría con fecha ${advisoryDate}:`, error);
        throw error; 
    }
}



// Función para actualizar puntos basados en asesorías similares
export async function updateExperienceAsesorias(peerUid, userUid, subjectId, advisoryDate) {
    try {
        if (!(advisoryDate instanceof Date)) {
            if (advisoryDate.toDate) {
                advisoryDate = advisoryDate.toDate();
            } else {
                advisoryDate = new Date(advisoryDate); 
            }
        }

        const today = Timestamp.now().toDate();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999); 

        const asesoriasRef = collection(firestoreDB, "asesorias");

        const q = query(
            asesoriasRef,
            where("date", ">=", startOfDay),
            where("date", "<=", endOfDay)
        );


        const querySnapshot = await getDocs(q);
        const asesorias = querySnapshot.docs.map(doc => doc.data());
        console.log(asesorias, "Asesorias")
        const similarAdvisories = asesorias.filter(ad => {
            const adDate = ad.date.toDate();
            return ad.peerInfo.uid === peerUid &&
                ad.userInfo.uid === userUid &&
                ad.subject.id === subjectId && 
                Math.abs(adDate.getTime() - advisoryDate.getTime()) <= 2 * 60 * 60 * 1000;
        });
        const ultimoElemento = asesorias[asesorias.length - 1];
        if (similarAdvisories.length > 1) {
            await updatePoints(peerUid, -150);
            await updateAdvisoryDuplicateField(ultimoElemento.date, true );
            await updateUserAchievementBadge(userUid, "18");
        } else {
            await updateAdvisoryDuplicateField(ultimoElemento.date, false );
            if(subjectId === "MAE"){
                await updatePoints(peerUid, 10); 
            }else{
                await updatePoints(peerUid, 50); 
            }
            
        }

    } catch (error) {
        console.error("Error actualizando la experiencia de asesorías:", error);
    }
}

// Función para obtener asesorías por UID, reutilizando getAsesorias
export async function getCommentsByUid(uid) {
    try {
        const startDate = new Date('2024-08-05'); 
        const today = new Date(); 
        const asesorias = await getAsesorias(startDate, today);

        const asesoriasFiltradas = asesorias.filter(asesoria => 
            asesoria.peerInfo?.uid === uid && asesoria.comment?.trim()
        );

        return asesoriasFiltradas;
    } catch (error) {
        console.error("Error fetching asesorias by UID: ", error);
        return [];
    }
}
