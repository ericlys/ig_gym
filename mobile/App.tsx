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

export default function App() {
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
          {fontsLoaded ? <Routes/> : <Loading/>}
        </AuthContextProvider>
        </QueryClientProvider>
    </NativeBaseProvider>
  );
}