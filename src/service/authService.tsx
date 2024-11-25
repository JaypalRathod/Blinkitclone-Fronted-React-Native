import axios from 'axios';
import { BASE_URL } from './confix';
import { tokenStorage } from '@states/storage';
import { useAuthStore } from '@states/authStore';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { appAxios } from './apiInterceptors';


export const customerLogin = async (phone: string) => {
    try {
        console.log("base url: " + BASE_URL)
        const responce = await axios.post(`${BASE_URL}/customer/login`, { phone })
        console.log("response", responce)
        const { accessToken, refreshToken, customer } = responce.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser } = useAuthStore.getState()
        setUser(customer);
    } catch (error) {
        console.log("Login Error", error);
    }
}

export const deliveryLogin = async (email: string, password: string) => {
    try {
        const responce = await axios.post(`${BASE_URL}/delivery/login`, { email, password })
        const { accessToken, refreshToken, deliveryPartner } = responce.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser } = useAuthStore.getState()
        setUser(deliveryPartner);
    } catch (error) {
        console.log("Login Error", error);
    }
}

export const refetchUser = async (setUser: (user: any) => void) => {
    try {
        const responce = await appAxios.get(`/user`);
        setUser(responce.data.user);
    } catch (error) {
        console.log("Login Error", error);
    }
}

export const refresh_tokens = async () => {
    try {
        const refreshToken = tokenStorage.getString('refreshToken');
        const responce = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken
        })

        const new_access_token = responce.data.accessToken
        const new_refresh_token = responce.data.refreshToken

        tokenStorage.set('access_token', new_access_token)
        tokenStorage.set('refresh_token', new_refresh_token)

        return new_access_token
    } catch (error) {
        console.log("REFRESH TOKEN ERROR", error);
        tokenStorage.clearAll();
        resetAndNavigate("CustomerLogin")
    }
}
