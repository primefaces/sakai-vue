import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { 
    updatePoints
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

        // Convert to Firestore Timestamps
        const startTimestamp = Timestamp.fromDate(startOfSemester);
        const endTimestamp = Timestamp.fromDate(endOfSemester);

        // Construct the query
        const requestsRef = collection(firestoreDB, "asesorias");
        const q = query(
            requestsRef,
            where(`peerInfo.uid`, "==", userId),
            where("date", ">=", startTimestamp),
            where("date", "<=", endTimestamp)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        console.log(querySnapshot)

        // Return the number of documents
        return querySnapshot.size;
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


// Función solo para actualizar de todas las asesorías si es necesario
export async function updateAllExperienceAsesorias() {
    const fixedStartDate = new Date('2024-08-05'); 
    const today = new Date(); 
    const asesorias = await getAsesorias(fixedStartDate, today);
    const processed = new Set(); 

    for (const advisory of asesorias) {
        const { peerInfo, userInfo, date, subject } = advisory;

        // Convertir date de Firestore Timestamp a Date
        const advisoryDate = date.toDate()

        // Comprueba si ya hemos procesado esta combinación
        const key = `${peerInfo.uid}-${userInfo.uid}-${subject.name}`;
        if (!processed.has(key)) {
            // Encuentra otras asesorías con los mismos peerInfo.uid, userInfo.uid, y subject.name
            const similarAdvisories = asesorias.filter(ad => {
                const adDate = ad.date.toDate(); 
                return ad.peerInfo.uid === peerInfo.uid &&
                    ad.userInfo.uid === userInfo.uid &&
                    ad.subject.name === subject.name &&
                    Math.abs(adDate.getTime() - advisoryDate.getTime()) <= 2 * 60 * 60 * 1000; // 2 horas en milisegundos
            });

            // Si hay otras asesorías similares, resta 150 puntos
            if (similarAdvisories.length > 1) {
                await updatePoints(peerInfo.uid, -150);
            } else {
                // Si no hay coincidencias dentro de las 2 horas, añade 50 puntos
                await updatePoints(peerInfo.uid, 50);
            }

            // Marca esta combinación como procesada
            processed.add(key);
        }
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

        const similarAdvisories = asesorias.filter(ad => {
            const adDate = ad.date.toDate();
            return ad.peerInfo.uid === peerUid &&
                ad.userInfo.uid === userUid &&
                ad.subject.id === subjectId && 
                Math.abs(adDate.getTime() - advisoryDate.getTime()) <= 2 * 60 * 60 * 1000;
        });
        // console.log(similarAdvisories)
        if (similarAdvisories.length > 1) {
            await updatePoints(peerUid, -150);
        } else {
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