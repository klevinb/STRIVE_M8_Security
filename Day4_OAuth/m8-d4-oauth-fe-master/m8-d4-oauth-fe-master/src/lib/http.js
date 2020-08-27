import axios from "axios"

import Cookies from "js-cookie"

const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
})

//Add a response interceptor

authAxios.interceptors.response.use(
  (response) => {
    return response
  },
  function (error) {
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      originalRequest.url === "users/refreshToken"
    ) {
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = Cookies.get("refreshToken")
      console.log(refreshToken)
      return axios
        .post(
          "http://localhost:3002/users/refreshToken",
          {},
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            return Promise.resolve()
          }
        })
    }
    return Promise.reject(error)
  }
)

export default authAxios
