import { HStack, Icon, Input, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


export function ExerciseHistory() {
  return (
    <VStack bg="gray.600" >
      <HStack alignItems="center" justifyContent="space-around" mx={4} my={2}>
        <Input 
          flex={1}
          placeholder="Quilogramas"
          keyboardType="number-pad"
          bg="gray.700"
          h={12}
          px={4}
          mr={2}
          borderWidth={0}
          fontSize="md"
          color="white"
          fontFamily="body"
          placeholderTextColor="gray.300"
        />
        <Input 
          flex={1}
          placeholder="Repetições"
          keyboardType="number-pad"
          bg="gray.700"
          h={12}
          px={4}
          mr={2}
          borderWidth={0}
          fontSize="md"
          color="white"
          fontFamily="body"
          placeholderTextColor="gray.300"
        />

        <TouchableOpacity 
          onPress={() => {}}
          >
          <Icon 
            as={MaterialIcons}
            backgroundColor="blue.600"
            rounded="md"
            name="add"
            color="gray.200"
            size={10}
          />
        </TouchableOpacity>
      </HStack>

      
    </VStack>
  )
}