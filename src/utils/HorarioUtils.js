import { getClosestDayAndStartTime } from "../firebase/db/users";

export function normalize(objecto) {
    console.log(objecto)
    return objecto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


export function translateDayToSpanish(day) {
    const daysMapping = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };
    return daysMapping[day] || 'Sin horario';
}

export function translateDayToEnglish(day) {
    const daysMapping = {
        'Lunes': 'monday',
        'Martes': 'tuesday',
        'Miércoles': 'wednesday',
        'Jueves': 'thursday',
        'Viernes': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
    };
    return daysMapping[day] || 'Invalid day';
}

export function getDayColor(day) {
    if (!day) return '';

    const dayLC = day.toLowerCase();
    switch (dayLC) {
        case 'monday': return 'bg-blue-600';
        case 'tuesday': return 'bg-green-600';
        case 'wednesday': return 'bg-yellow-600';
        case 'thursday': return 'bg-red-600';
        case 'friday': return 'bg-purple-600';
        default: return '';
    }
}

export function getSubjectColor(area) {
    console.log(area)
    switch (area) {
        case 'ING': return 'bg-cyan-600';
        case 'NEG': return 'bg-blue-600';
        case 'SLD': return 'bg-teal-600';
        case 'CIS': return 'bg-red-600';
        case 'AMC': return 'bg-green-600';
        case 'ART': return 'bg-purple-600';
        default: return 'bg-yellow-600';
    }
}

export function formatScheduleHours(hours) {
    if (!Array.isArray(hours) || hours.length === 0) return '';

    const timeEntries = hours.map(hour => {
        const start = new Date(`1970-01-01T${hour.start}:00Z`);
        const end = new Date(`1970-01-01T${hour.end}:00Z`);
        return { start, end };
    });

    const sortedEntries = timeEntries.sort((a, b) => a.start - b.start);

    let result = '';
    for (let i = 0; i < sortedEntries.length; i++) {
        const { start, end } = sortedEntries[i];

        const startHour = start.toISOString().substr(11, 5);
        const endHour = end.toISOString().substr(11, 5);

        if (i < sortedEntries.length - 1 && sortedEntries[i + 1].start.getTime() === end.getTime()) {
            result += `${startHour} - `;
        } else {
            result += `${startHour} - ${endHour}`;
            if (i < sortedEntries.length - 1) result += ', ';
        }
    }
    return ' • ' + result;
}

export function closestDay(schedule) {
    const { day } = getClosestDayAndStartTime(schedule);
    return day;
}

export function weekCountDisplay(weekSchedule) {
    const numberOfKeys = Object.keys(weekSchedule).length;
    if (numberOfKeys <= 1) return null;
    return `+${numberOfKeys - 1}`;
}

export function subjectCountDisplay(subjects) {
    if (subjects.length <= 1) return null;
    return `+${subjects.length - 1}`;
}

