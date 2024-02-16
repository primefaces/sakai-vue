// JSON de Materias

export const MateriasInfoService = {
    getMaterias() {
        return [
            { 
                id: 1,
                materia: 'Modelación matemática intermedia', 
                abreviacion: 'TC10028', 
                cantidad: 15, 
            },
            { 
                id: 2,
                materia: 'Planeación de Software', 
                abreviacion: 'TC10038', 
                cantidad: 25, 
            },
            { 
                id: 3,
                materia: 'Desarrollo de Aplicaciones Móviles', 
                abreviacion: 'TC10028', 
                cantidad: 25, 
            },
            { 
                id: 4, 
                materia: 'Programación Orientada a Objetos', 
                abreviacion: 'TC10048', 
                cantidad: 25, 
            },
            { 
                id: 5, 
                materia: 'Introducción a la Vida Profesional', 
                abreviacion: 'OP10018', 
                cantidad: 25, 
            },
            
        ];
    },

    getCustomersMedium() {
        return Promise.resolve(this.getMaterias().slice(0, 50));
    }
};
