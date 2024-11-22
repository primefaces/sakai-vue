import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    getDocs,
    where,
    updateDoc,
    doc, getDoc
    
} from 'firebase/firestore';
import { addAnnoucement } from "../img/users";
import { 
    updatePoints
} from './users'; 

export async function saveAnnouncement(announcementData, selectedFile) {
    try {
        let imageUrl = '';

        if (selectedFile) {
            const filePath = `announcements/${announcementData.type}/${selectedFile.name}`;
            imageUrl = await addAnnoucement(selectedFile, filePath);
        }

        const docRef = await addDoc(collection(firestoreDB, 'announcements'), {
            ...announcementData,
            imageUrl, 
            preregister: {},
            asistence: {},
            createdAt: new Date(),
            visible: true
        });

        return docRef.id;
    } catch (error) {
        console.error('Error al guardar el anuncio:', error);
        throw error;
    }
}

export async function getAnnouncementsEdit() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        
        const querySnapshot = await getDocs(query(announcementsCollection));
        
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt )); 


        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}


export async function getAnnouncements() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        const querySnapshot = await getDocs(query(announcementsCollection));
        const now = new Date();
        
        
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(announcement => {
                if (announcement.dateTime) {
                    const dateTime = announcement.dateTime.seconds 
                        ? new Date(announcement.dateTime.seconds * 1000) 
                        : new Date(announcement.dateTime);
                    return dateTime >= now || dateTime.toDateString() === now.toDateString() ;
                }
                return true; 
            })
            .sort((a, b) => {
                const dateA = a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
                const dateB = b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
                return dateA - dateB;
            });

        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}

export async function getAnnouncementsGrupales() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');

        const q = query(
            announcementsCollection,
            where('type', '==', 'Asesoría'),
            where('visible', '==', true)
        );

        const querySnapshot = await getDocs(q);

        const now = new Date();
        console.log(now);

        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateTime: doc.data().dateTime.toDate(), 
            }))
            .filter(ann => {
                return ann.dateTime >= now || ann.dateTime.toDateString() === now.toDateString();
            })
            .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds); // Ordenar por fecha de creación

        console.log(announcements);
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}


export async function addUserToPreregsiter(announcementId, user) {
    try {
        const announcementRef = doc(firestoreDB, 'announcements', announcementId);
        const announcementSnapshot = await getDoc(announcementRef);
        if (!announcementSnapshot.exists()) {
            throw new Error(`El anuncio con ID ${announcementId} no existe.`);
        }

        const announcementData = announcementSnapshot.data();

        const currentPreregs = announcementData.preregister || {};
        if (currentPreregs[user.uid]) {
            throw new Error('Usuario ya registrado');
        }
        const updatedPreregs = {
            ...currentPreregs,
            [user.uid]: user,
        };

        const currentAsistence = announcementData.asistence || {};
        const updatedAsistence = {
            ...currentAsistence,
            [user.uid]: false,
        };

        await updateDoc(announcementRef, {
            preregister: updatedPreregs,
            asistence: updatedAsistence,
        });

        console.log(`Usuario ${user.uid} agregado exitosamente a preregister y asistencia.`);
    } catch (error) {
        console.error('Error añadiendo usuario a preregister:', error);
        throw error; 
    }
}


export async function processAsistence(announcementId) {
    const announcementRef = doc(firestoreDB, 'announcements', announcementId);
    const announcementSnapshot = await getDoc(announcementRef);
    const data = announcementSnapshot.data();

    const preregister = data.preregister || {};
    const asistence = data.asistence || {};
    const dateTime = data.dateTime || '';

    const preregisterKeys = Object.keys(preregister);
    if (preregisterKeys.length === 0) {
        console.log("No preregister data found.");
        return [];  
    }

    const result = preregisterKeys.map(uid => {
        const user = preregister[uid];

        return {
            uid: uid,
            dateTime: dateTime,
            name: user.name || '',
            career: user.career || '',
            area: user.area || '',
            campus: user.campus || '',
            asistence: asistence[uid] || false 
        };
    });

    console.log("Result:", result);
    return result;
}


export async function updateUserAsistence(announcementId, userId) {
    try {
        const announcementRef = doc(firestoreDB, 'announcements', announcementId);

        const announcementSnapshot = await getDoc(announcementRef);
        if (!announcementSnapshot.exists()) {
            throw new Error(`El anuncio con ID ${announcementId} no existe.`);
        }

        const announcementData = announcementSnapshot.data();
        const currentAsistence = announcementData.asistence || {};
        const maesAsignados = announcementData.maesAsignados || [];

        const newAsistenceStatus = !currentAsistence[userId];
        const updatedAsistence = {
            ...currentAsistence,
            [userId]: newAsistenceStatus,
        };

        const totalMaes = maesAsignados.length;

        if (totalMaes > 0) {
            const pointsPerMae = 50 / totalMaes;

            
            for (const mae of maesAsignados) {
                if (newAsistenceStatus) {

                    await updatePoints(mae.uid, pointsPerMae);
                    console.log(`Puntos distribuidos a ${mae.name}: +${pointsPerMae}`);
                } else {

                    await updatePoints(mae.uid, -pointsPerMae);
                    console.log(`Puntos distribuidos a ${mae.name}: -${pointsPerMae}`);
                }
            }
        } else {
            console.log('No hay MAEs asignados para asignar puntos.');
        }

        await updateDoc(announcementRef, {
            asistence: updatedAsistence,
        });

        console.log(`Asistencia para el usuario ${userId} actualizada exitosamente a ${newAsistenceStatus}.`);
    } catch (error) {
        console.error('Error actualizando la asistencia del usuario:', error);
        throw error;
    }
}


export async function processConfirms(announcementId) {
    const announcementRef = doc(firestoreDB, 'announcements', announcementId);
    const announcementSnapshot = await getDoc(announcementRef);
    const data = announcementSnapshot.data();

    const preregister = data.preregister || {};  
    const asistence = data.asistence || {}; 
    const dateTime = data.dateTime || '';  

    const preregisterKeys = Object.keys(preregister);  
    if (preregisterKeys.length === 0) {
        console.log("No preregister data found.");
        return [];  
    }

    const result = preregisterKeys
        .filter(uid => asistence[uid] === true)  
        .map(uid => {
            const user = preregister[uid];  
            console.log("Processing user:", user);

            return {
                uid: uid,
                dateTime: dateTime,
                name: user.name || '',
                career: user.career || '',
                area: user.area || '',
                campus: user.campus || '',
                asistence: true 
            };
        });
    return result; 
}


export async function addExtraVariables() {
    try {
        const usersRef = collection(firestoreDB, 'announcements');
        const querySnapshot = await getDocs(usersRef);
        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref; 
                return updateDoc(userRef, {
                    maesAsignados: []
                });
          
        });

        await Promise.all(promises);

        console.log("Background have been successfully added to eligible users.");
    } catch (error) {
        console.error("Error adding background to eligible users: ", error);
        throw error;
    }
}

export async function getAnnouncementsAllGrupales() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');

        const q = query(
            announcementsCollection,
            where('type', '==', 'Asesoría')
        );

        const querySnapshot = await getDocs(q);

        const now = new Date(); 
        const announcements = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateTime: doc.data().dateTime.toDate(),
        }));

        const futureAnnouncements = announcements
            .filter(announcement => 
                announcement.dateTime > now || 
                announcement.dateTime.toDateString() === now.toDateString()
            ) 
            .sort((a, b) => a.dateTime - b.dateTime); 

        const pastAnnouncements = announcements
            .filter(announcement => 
                announcement.dateTime < now &&
                announcement.dateTime.toDateString() !== now.toDateString()
            )
            .sort((a, b) => a.dateTime - b.dateTime); 

   
        const sortedAnnouncements = [...futureAnnouncements, ...pastAnnouncements];


        return sortedAnnouncements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}

