import axios from "axios";
import { BASE_URL } from "./confix";
import { tokenStorage } from "@states/storage";
import { refresh_tokens } from "./authService";
import { Alert } from "react-native";

export const appAxios = axios.create({
    baseURL: BASE_URL
})

appAxios.interceptors.request.use(async confiq => {
    const accessToken = tokenStorage.getString('accessToken')
    if (accessToken) {
        confiq.headers.Authorization = `Bearer ${accessToken}`
    }
    return confiq
})

appAxios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refresh_tokens()
                if (newAccessToken) {
                    error.confiq.header.Authorizaton = `Bearer ${newAccessToken}`;
                    return axios(error.confiq)
                }
            } catch (error) {
                console.log("ERROR REFRESHING TOKEN")
            }
        }

        if (error.responce && error.responce.status !== 401) {
            const errorMessage = error.responce.data.message || 'something went wrong';
            Alert.alert(errorMessage)
        }

        return Promise.resolve(error)
    }
)