// Example implementation of fetching data for the Horarios dataTable

export const MaeInfoService = {
    getData() {
        return [
            {
                id: 1000,
                name: 'Oscar Arreola',
                modalidad: 'Remota',
                horario: [
                    ['Lunes', [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5]],
                    ['Jueves', [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5]],
                    ['Viernes', [9]]
                ],
                subjects: [{ area: 'ING', id: 'TC1030', intensiva: false, name: 'Programación orientada a objetos', semester: 2, top: true }]
            },
            {
                id: 1001,
                name: 'Juan Perez',
                modalidad: 'Presencial',
                horario: [
                    ['Lunes', [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5]],
                    ['Viernes', [9]]
                ],
                subjects: [
                    { area: 'ING', id: 'TC1030', intensiva: false, name: 'Programación orientada a objetos', semester: 2, top: true },
                    { area: 'ING', id: 'TC1030', intensiva: false, name: 'Programación 2', semester: 2, top: true },
                    { area: 'ING', id: 'TC1030', intensiva: false, name: 'Programación 3', semester: 3, top: true }
                ]
            }
        ];
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    }
};
