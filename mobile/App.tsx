import { StatusBar} from 'react-native';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import { NativeBaseProvider } from 'native-base';
import { Loading } from '@components/Loading';
import { THEME } from './src/theme';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/ReactQuery';
import { ExerciseHistoricContextProvider } from '@contexts/ExerciseHistoric';
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_ID } from '@env';

export default function App() {

  OneSignal.setAppId(ONESIGNAL_ID!)

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
          />
        <AuthContextProvider>
          <ExerciseHistoricContextProvider>
            {fontsLoaded ? <Routes/> : <Loading/>}
          </ExerciseHistoricContextProvider>
        </AuthContextProvider>
        </QueryClientProvider>
    </NativeBaseProvider>
  );
}