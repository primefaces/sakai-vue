import axios from "axios";
import { response } from "express";
import { defineStore } from "pinia";
import { inject } from "vue";

// Si kiere tu usa kunel API na component, man inject lang.
const api = inject('$api') // try daw si tan work pa syempre todo

// console.log(api)

export const useUserStore = defineStore("user", {
    state: () => ({
        // user: null,
        _id: null,
        email: null,
        password: null, 
        firstName: null, 
        lastName: null, 
        // gender: null, 
        role: null,
        accessToken: null
    }),

    actions: {
        async fetchUser() {
            const res = await fetch("https://localhost:3000/user");

            const user = await res.json();
            this.user = user;
        },

        async signUp(email, password, firstName, lastName, role) {
            try {
                // const { data: user } = await api.post('/api/auth/register', { 
                //     email, password, firstName, lastName, role 
                // })
                /*const res = await axios.post('http://localhost:3000/api/auth/register', {
                    // 'aris@gmail.com', '12345678', 'Aris', 'Moratalla', 'male', 'admin'
                    email: 'aris@gmail.com', password: '12345678', firstName: 'Aris', lastName: 'Moratalla', role: 'admin' 
                })*/

                const res = await axios.post('http://localhost:3000/api/auth/register', {
                    // email: 'aris@gmail.com', password: '12345678', firstName: 'Aris', lastName: 'Moratalla', role: 'admin' 
                    email, password, firstName, lastName, role
                })
                console.log('tried here')
                this.user = res.data
                // this.user = user
            } catch (error) {
                if (!error.response) {
                    // Problem na code
                    console.log('Check code!!!')
                } else {
                    // Problem estaba na API
                    const { data } = error.response
                    console.log('JSON_RESPONSE_ERROR:', data)
                }
            }
            // const res = await fetch("http://localhost:3000/api/auth/register", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ email, password, firstName, lastName, role }),
            // });
            // const user = await res.json()
            // this.user = user;
        },

        /**
         * Sign in a user
         * @param {String} email User email
         * @param {String} password User password
         * @returns Boolean - whether login passed or not
         */
        async signIn(email, password) {
            try {
                // const { data: res } = await api.post('/api/auth/login', {
                //     email, password
                // })

                const res = await axios.post('http://localhost:3000/api/auth/login', {
                    email: 'arismoratalla@gmail.com', password: '12345678'
                })

                // axios.post('https://reqres.in/api/login', {
                //     email: 'eve.holt@reqres.in', password: 'cityslicka'
                // })
                // .then(response => {
                //     console.log(response)
                // })
                

                if (!res.success) {
                    // alert('Unable to sign in.')
                    // console.log(email)
                    // console.log(password)
                    console.log('Unable to sign in.')   
                    return false // yan fail el login
                }

                // Store accessToken from API to userState
                this.accessToken = res.data.accessToken

                // Set access token in every HTTP request
                api.defaults.headers.common.Authorization = 'Bearer ' + this.accessToken // Na next call detuyu tiene ya access token na headers

                // Store email from API to userState
                this.email = res.data.email

                return true // yan succeed el login
                // const res = await fetch("http://localhost:3000/api/auth/login", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({ email, password }),
                // });
                // const user = await res.json();
                // this.user = user;
            } catch (error) {
                console.log('ERROR:', error)
                if (!error.response) {
                    return false
                }

                const { data } = error.response
                alert(data.message) // na API
             }
        },
    },
});