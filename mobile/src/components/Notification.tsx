import { HStack, Text, IconButton, CloseIcon, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { OSNotification } from 'react-native-onesignal';
import * as Linking from 'expo-linking';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

type Props = {
  data: OSNotification;
  onClose: () => void;
};

type additionalDataProps = {
  route?: 'exercise';
  exercise_id?: string;
}

export function Notification({ data, onClose }: Props) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleOnPress() {
    if (data.launchURL) {
      Linking.openURL(data.launchURL);
      onClose();
    }

    if (data.additionalData) {
      const { route, exercise_id } = data.additionalData as additionalDataProps;

      if (route === 'exercise' && exercise_id) {
        navigate('exercise', { exerciseId: exercise_id });
        onClose();
      }
    }
  }

  return (
    <Pressable w="full" pt={12} p={4} bgColor="gray.200" position="absolute" top={0} onPress={handleOnPress}>
    <HStack justifyContent="space-between" alignItems="center" >        
    <Icon as={Ionicons} name="notifications-outline" size={5} color="black" mr={2}/>

        <Text fontSize="md" color="black" flex={1}>
          {data.title}
        </Text>

      <IconButton 
        variant="unstyled" 
        _focus={{ borderWidth: 0 }} 
        icon={<CloseIcon size="3" />} 
        _icon={{ color: "coolGray.600"}} 
        color="black"
        onPress={onClose}
      />
    </HStack>
    </Pressable>
  );
}