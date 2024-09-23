import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { addAnnoucement } from "../img/users";

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


/**
 * Guarda un nuevo anuncio en la colección "announcements".
 *
 * @param {Object} announcementData - Los datos del anuncio a guardar.
 * @param {File} selectedFile - El archivo de imagen seleccionado.
 * @returns {Promise<void>}
 */
export async function saveAnnouncement(announcementData, selectedFile) {
    try {
        let imageUrl = '';

        // Si hay un archivo seleccionado, subirlo a Firebase Storage
        if (selectedFile) {
            const filePath = `announcements/${announcementData.type}/${selectedFile.name}`;
            imageUrl = await addAnnoucement(selectedFile, filePath);
        }

        // Agregar el anuncio a la colección "announcements" en Firestore
        await addDoc(collection(firestoreDB, 'announcements'), {
            ...announcementData,
            imageUrl, // Incluir la URL de la imagen si fue subida
            createdAt: new Date(), // Fecha de creación del anuncio
            visible: true
        });

        console.log('Anuncio guardado exitosamente en Firestore');
    } catch (error) {
        console.error('Error saving announcement:', error);
        throw error;
    }
}