

const token = window.localStorage.getItem("token")

if (!token) {
    console.log("no token")
    window.location = "#/auth/login"
}


