// JSON de Usuarios

export const UsuariosInfoService = {
    getUsuarios() {
        return [
            { 
                id: 1,
                rol: 'Mae', 
                matricula: 'A01735722', 
                nombre: 'Juan', 
                asesorias: 15, 
                horas: 10, 
                actHorario: true 
            },
            { 
                id: 2, 
                rol: 'Estudiante', 
                matricula: '123', 
                nombre: 'Pedro Lopez', 
                asesorias: 2, 
                horas: 12, 
                actHorario: false
            },
            { 
                id: 3, 
                rol: 'Administrador', 
                matricula: '123', 
                nombre: 'Kraken Cordova', 
                asesorias: 5, 
                horas: 10, 
                actHorario: false
            },
            { 
                id: 4, 
                rol: 'Coordinador', 
                matricula: '123', 
                nombre: 'Luis Angel', 
                asesorias: 5, 
                horas: 10, 
                actHorario: false
            },
            { 
                id: 5, 
                rol: 'Tecnologia', 
                matricula: '123', 
                nombre: 'Bernardo de la S', 
                asesorias: 5, 
                horas: 10, 
                actHorario: true
            },
            { 
                id: 6, 
                rol: 'Mae', 
                matricula: '123', 
                nombre: 'Lamborghini', 
                asesorias: 5, 
                horas: 10, 
                actHorario: true
            },
        ];
    },

    getCustomersMedium() {
        return Promise.resolve(this.getUsuarios().slice(0, 50));
    }
};
