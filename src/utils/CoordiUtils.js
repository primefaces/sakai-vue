export const getSubjectColor = (area) => {
    switch (area) {
        case 'Ingeniería y Ciencias':
            return 'bg-cyan-600';
        case 'Negocios':
            return 'bg-blue-600';
        case 'Salud':
            return 'bg-teal-600';
        case 'Derecho, Economía y Relaciones Internacionales':
            return 'bg-red-600';
        case 'Ambiente Construido':
            return 'bg-green-600';
        case 'Estudios Creativos':
            return 'bg-purple-600';
        default:
            return 'bg-yellow-600';
    }
}


export const pointsRules = {
    A: 5,  // Asistencia
    F: -5, // Falta
    R: 3,  // Retraso
    J: 0,   // Justificado
    C: 10 // Coordi
};
