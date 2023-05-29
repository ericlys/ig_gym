import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { useEffect, useState } from "react";
import OneSignal, { NotificationReceivedEvent, OSNotification } from "react-native-onesignal";
import { Notification } from "@components/Notification";

//ex: npx uri-scheme open ignitegym://exercise/dd863b78-35f4-4945-8155-6e4770c7dd10 --android
const linking = {
  prefixes: ['ignitegym://', 'com.ericlys.ignitegym://'],
  config: {
    screens: {
      exercise: {
        path: 'exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId
        }
      },
      home: '*',
    }
  }
}

export function Routes(){
  const [notification, setNotification] = useState<OSNotification>()

  const {colors} = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background= colors.gray[700];

  useEffect(()=> {
    const unsubscribe = OneSignal
    .setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) => {
      const response = notificationReceivedEvent.getNotification()
      setNotification(response)
    })

    return () => unsubscribe;
  }, [])

  if(isLoadingUserStorageData) {
    return (
      <Loading />
    )
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme} 
      linking={linking}
      >
        {user.id ? <AppRoutes/> : <AuthRoutes/> }
        {
          notification?.title &&
          <Notification data={notification} onClose={()=> setNotification(undefined)}/>
        }
      </NavigationContainer>
    </Box>
  )
}