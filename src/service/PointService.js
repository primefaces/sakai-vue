const HOST = window.BACKEND_HOST

export const getPoints = async (platformID = null, from = null, to = null, limit = null) => {
    var url = new URL(`${HOST}/api/points`)
    var params = new URLSearchParams(url.search);


    if (platformID != null) {
        params.append("platform_id", platformID)
    }

    if (from != null) {
        params.append("datetime_from", from.toISOString())
    }

    if (to != null) {
        params.append("datetime_to", to.toISOString())
    }

    if (limit != null) {
        params.append("limit", limit)
    }

    var entryPoint = `${url}?${params.toString()}`

    return fetch(entryPoint, {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })
        .then((res) => {
            if (res.status == 401) {
                window.location = "#/auth/login"
            }
            return res.json()
        })
        .then((d) => d.points);

}

export const addPoints = async (points) => {
    return fetch(`${HOST}/api/points`, {
        method: "POST",
        body: JSON.stringify({ "points": points }),
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
    }).then((res) => {
        if (res.status == 401) {
            window.location = "#/auth/login"
        }
    })

}

export const getTags = async () => {
    return fetch(`${HOST}/api/tags`, {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    })
        .then((res) => {
            if (res.status == 401) {
                window.location = "#/auth/login"
            }
            return res.json()
        })
        .then((d) => d.tags);

}


export const loginGetToken = async (username, password) => {
    return fetch(`${HOST}/auth/login`, {

        method: "POST",
        body: JSON.stringify({ "username": username, "password": password }),
        headers: {
            "mode": "no-cors",
            "Content-Type": "application/json"
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Login failed")
        }
        return res.json()

    }).then((data) => data.token)
}

export const whoami = async () => {

}
