import axios from "axios"

const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
})

//Add a response interceptor (sort of axios middleware or prehooks)

authAxios.interceptors.response.use(
  (response) => {
    return response
  },
  function (error) {
    const originalRequest = error.config
    if (
      error.response.status === 401 &&
      originalRequest.url === "/users/refreshToken"
    ) {
      console.log("REDIRECT TO LOGIN!")
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("refreshToken")
      return authAxios
        .post("/users/refreshToken", {
          refreshToken: refreshToken,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("refreshToken", res.data.refreshToken)
            localStorage.setItem("accessToken", res.data.token)
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem("accessToken")
            return axios(originalRequest)
          }
        })
    }
    return Promise.reject(error)
  }
)

export default authAxios
