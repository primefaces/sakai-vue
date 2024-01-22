// JSON de Intensivas

export const IntensivasInfoService = {
    getIntensivas() {
        return [
            { 
                id: 1,
                fecha: 'Lunes 22 de Enero', 
                asesor: 'Kraken Cordova', 
                hora: '11:00', 
                salon: 'A7-201',
            },
            { 
                id: 2,
                fecha: 'Lunes 22 de Enero', 
                asesor: 'Bernardo de la S', 
                hora: '11:00', 
                salon: 'A7-201',
            },
            { 
                id: 3,
                fecha: 'Lunes 22 de Enero', 
                asesor: 'Luis Angel', 
                hora: '11:00', 
                salon: 'A7-201',
            },
            { 
                id: 4,
                fecha: 'Lunes 22 de Enero', 
                asesor: 'Pepe Lopez', 
                hora: '11:00', 
                salon: 'A7-201',
            },    
        ];
    },

    getCustomersMedium() {
        return Promise.resolve(this.getIntensivas().slice(0, 50));
    }
};
