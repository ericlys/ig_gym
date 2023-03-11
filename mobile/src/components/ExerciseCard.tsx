import { Heading, HStack, Icon, Image, Text, VStack } from "native-base";
import { TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons'

type Props = TouchableOpacityProps & {
  title: string
}

export function ExerciseCard({title, ...rest}: Props) {
  return(
    <TouchableOpacity {...rest}>
      <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
        <Image 
          source={{uri: "https://static.wixstatic.com/media/2edbed_39fe8b6d3b054e2ba239a436f2ce5cc4~mv2.gif"}}
          alt="Imagem do exercício"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="center"
        />
        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon 
          as={Entypo}
          name="chevron-thin-right"
          color="gray.300"
        />

      </HStack>
    </TouchableOpacity>
  )
}