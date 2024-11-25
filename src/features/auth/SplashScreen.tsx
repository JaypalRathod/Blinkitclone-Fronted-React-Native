import { View, StyleSheet, Image, Alert } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Colors } from '@utils/Constants'
import { screenHeight, screenWidth } from '@utils/Scalling'
import Logo from "@assets/images/splash_logo.jpeg"
import Geolocation from '@react-native-community/geolocation';
import { useAuthStore } from '@states/authStore'
import { tokenStorage } from '@states/storage'
import { resetAndNavigate } from '@utils/NavigationUtils'
import { jwtDecode } from "jwt-decode";
import { refetchUser, refresh_tokens } from '@service/authService'

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  locationProvider: 'auto',
  enableBackgroundLocationUpdates: true,
})

interface DecodedToken {
  exp: number;
}

const SplashScreen: FC = () => {
  const { user, setUser } = useAuthStore();

  const tokenChek = async () => {
    const accessToken = tokenStorage.getString('accessToken') as string
    const refreshToken = tokenStorage.getString('refreshToken') as string

    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken)
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken)

      const currentTime = Date.now() / 1000;

      if (decodedAccessToken?.exp < currentTime) {
        resetAndNavigate('CustomerLogin')
        Alert.alert("session Expired", "Please login again")
        return false
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          await refresh_tokens()
          await refetchUser(setUser)
        } catch (error) {
          console.log(error)
          Alert.alert("there was an error refreshing tokens ! ")
          return false
        }
      }

      if (user?.role === 'Customer'){
        resetAndNavigate('ProductDashboard')
      } else {
        resetAndNavigate('DeliveryDashboard')
      }

        return true
    }
    resetAndNavigate("CustomerLogin")
    return false
  }

  useEffect(() => {
    const fetchUserLocation = () => {
      try {
        Geolocation.requestAuthorization()
        tokenChek()
      } catch (error) {
        Alert.alert("sorry we need to location services to give you better shppoing experince")
      }
    }
    const timeoutId = setTimeout(fetchUserLocation, 1000);
    return () => clearTimeout(timeoutId);
  }, [])

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: screenHeight * 0.7,
    width: screenWidth * 0.7,
    resizeMode: 'contain',
  }
})

export default SplashScreen