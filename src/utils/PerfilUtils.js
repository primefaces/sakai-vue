


export const areaOptions = [
    {label: 'Todos', value: null},
    { label: 'Ingeniería y Ciencias', value: 'ING' },
    { label: 'Salud y Medicina', value: 'SLD' },
    { label: 'Negocios', value: 'NEG' },
    { label: 'Ciencias Sociales', value: 'CIS' },
    { label: 'Arquitectura y Diseño', value: 'AMC' },
    { label: 'General', value: 'GEN' },
    { label: 'Artes', value: 'ART' }
  ];

export const topOptions = [
    {label: 'Todos', value: null},
    {label: 'Si', value: true},
    {label: 'No', value: false}
  ];

export const daysArray = [
    { en: 'monday', es: 'Lunes' },
    { en: 'tuesday', es: 'Martes' },
    { en: 'wednesday', es: 'Miércoles' },
    { en: 'thursday', es: 'Jueves' },
    { en: 'friday', es: 'Viernes' }
  ];

export const timeSlots = [
    { name: '09:00 AM', code: '09:00' },
    { name: '09:30 AM', code: '09:30' },
    { name: '10:00 AM', code: '10:00' },
    { name: '10:30 AM', code: '10:30' },
    { name: '11:00 AM', code: '11:00' },
    { name: '11:30 AM', code: '11:30' },
    { name: '12:00 PM', code: '12:00' },
    { name: '12:30 PM', code: '12:30' },
    { name: '01:00 PM', code: '13:00' },
    { name: '01:30 PM', code: '13:30' },
    { name: '02:00 PM', code: '14:00' },
    { name: '02:30 PM', code: '14:30' },
    { name: '03:00 PM', code: '15:00' },
    { name: '03:30 PM', code: '15:30' },
    { name: '04:00 PM', code: '16:00' },
    { name: '04:30 PM', code: '16:30' },
    { name: '05:00 PM', code: '17:00' },
    { name: '05:30 PM', code: '17:30' },
    { name: '06:00 PM', code: '18:00' }
  ];

export const timeToDecimal = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };
  