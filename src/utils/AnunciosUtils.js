export const formatDate = (date) => {
    if (!date) return ''; // Si no hay fecha, retorna una cadena vacía

    // Si el campo date es un Timestamp (de Firestore), lo convertimos a Date
    if (date.toDate) {
        date = date.toDate(); // Convertimos el Timestamp a Date
    }

    const validDate = new Date(date);

    // Verificar si la fecha es válida
    if (isNaN(validDate.getTime())) {
        return ''; // Si no es válida, retornar cadena vacía
    }

    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(validDate);
};

export const formatTime = (date, showMeridiem = false) => {
    if (!date) return ''; // Si no hay fecha, retorna una cadena vacía
    
    // Si el campo `date` es un Timestamp de Firestore, convertirlo a `Date`
    if (date.toDate) {
        date = date.toDate(); // Convertimos el Timestamp a Date
    }

    const validDate = new Date(date);
    // Verificar si la fecha es válida
    if (isNaN(validDate.getTime())) {
        return ''; // Si no es válida, retornar cadena vacía
    }
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // Para mostrar el formato de 12 horas siempre
    };
    const formattedTime = new Intl.DateTimeFormat('es-MX', options).format(validDate);
    // Solo muestra "a.m." o "p.m." si `showMeridiem` es true, de lo contrario los elimina
    return showMeridiem ? formattedTime : formattedTime.replace(/(a\.m\.|p\.m\.)/g, '').trim();
};