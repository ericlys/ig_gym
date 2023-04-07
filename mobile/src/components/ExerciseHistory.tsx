import { Accordion, Box, Heading, HStack, Icon, Input, Pressable, SectionList, Text, useToast, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useExerciseHistoric } from "@hooks/useExerciseHistoric";
import { useEffect, useState } from "react";
import { ExerciseHistoricProps } from "@contexts/ExerciseHistoric";
import uuid from "react-native-uuid";

type Props = {
  id: string;
}

const ExerciseHistoricSchema = yup.object({
  kilograms: yup.number().required('Informe quantos quilos.'),
  repetitions: yup.number().required('Informe a quantidade de repetições.')
})

type FormDataProps = {
  kilograms: number;
  repetitions: number;
}

export function ExerciseHistory({id}: Props) {
  const [ exerciseHistoric, setExerciseHistoric ] = useState<ExerciseHistoricProps[]>([])

  const { getExerciseHistoric, registerExerciseHistoric } = useExerciseHistoric();

  const toast = useToast();

  async function updateHistoricList() {
    const historic = await getExerciseHistoric(id)
    setExerciseHistoric(historic)
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(ExerciseHistoricSchema)
  })
  
  async function handleAddNewExerciseHistoric(data: FormDataProps) {
    try {
      await registerExerciseHistoric({
        date: new Date(),
        exerciseId: id,
        id: uuid.v4().toString(),
        kilograms: data.kilograms,
        repetitions: data.repetitions
      });

      reset();

      updateHistoricList();

    } catch (err) {
      toast.show({
        title: "Erro inesperado ao tentar salvar, tente recarregar o aplicativo.",
        placement: 'top',
        bgColor: 'red.500'
      })
      
    } 
  }

  useEffect(() => {
    updateHistoricList();
  },[])

  return (
    <VStack bg="gray.600" px={2} mt={4} mb={16}>

      <HStack alignItems="center" justifyContent="space-around" my={2}>

      <Controller
        control={control}
        name="kilograms"
        render={({ field: { onChange, value }}) => (
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
            value={value?.toString()}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="repetitions"
        render={({ field: { onChange, value }}) => (      
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
            value={value?.toString()}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity 
        onPress={handleSubmit(handleAddNewExerciseHistoric)}
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
        {exerciseHistoric.length > 0 && 
          <Heading mt={2} color="white" fontSize="md" >Histórico</Heading>
        }

        {
          exerciseHistoric.map(item => (
            <VStack>
             <Heading key={item.date} color="gray.200" fontSize="md" mt={2} mb={2} fontFamily="heading">
              {item.date}
            </Heading>

            { item.data.map((item) => (
              <Accordion.Item>
                <Pressable onPress={() => {}}>
                  <HStack w="full" px={2}  mb={2} bg="gray.600" rounded="md" alignItems="center" justifyContent="space-between">
                    <Text color="gray.100" fontSize="sm" numberOfLines={1}>
                      {item.kilograms} kg, {item.repetitions} repetições
                    </Text>
                  </HStack>
                </Pressable>
              </Accordion.Item>
            ))}
          </VStack>   
      ))
    }
       
    </VStack>
  )
}