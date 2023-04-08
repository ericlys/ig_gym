import { Heading, HStack, Icon, Modal, Text, useToast, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useExerciseHistoric } from "@hooks/useExerciseHistoric";
import { useEffect, useState } from "react";
import { ExerciseHistoricProps } from "@contexts/ExerciseHistoric";
import uuid from "react-native-uuid";
import { Button } from "./Button";
import { Input } from "./Input";

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
  const [showModal, setShowModal] = useState(false);
  const [deleteHistoricId, setDeleteHistoricId] = useState('');
  const [ exerciseHistoric, setExerciseHistoric ] = useState<ExerciseHistoricProps[]>([])

  const { getExerciseHistoric, registerExerciseHistoric, deleteExerciseHistoric } = useExerciseHistoric();

  const toast = useToast();

  async function updateHistoricList() {
    const historic = await getExerciseHistoric(id)
    setExerciseHistoric(historic)
  }

  const { control, handleSubmit, reset, setValue } = useForm<FormDataProps>({
    resolver: yupResolver(ExerciseHistoricSchema)
  })

  function handleOpenDeleteModal(id: string) {
    setShowModal(true)
    setDeleteHistoricId(id);
  }

  async function handleDeleteExerciseHistoric() {
    await deleteExerciseHistoric(deleteHistoricId, id);
    updateHistoricList();
    setDeleteHistoricId('')
    setShowModal(false)
  }
  
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

  function handleSetValuesInFields(item: FormDataProps) {
    setValue("kilograms", item.kilograms)
    setValue("repetitions", item.repetitions)
  }

  useEffect(() => {
    updateHistoricList();
  },[])

  return (
    <VStack bg="gray.600" px={2} mt={4} mb={16}>

      <HStack alignItems="baseline" my={2}>

      <Controller
        control={control}
        name="kilograms"
        render={({ field: { onChange, value }}) => (
          <Input 
            placeholder="Quilogramas"
            bg="gray.600"
            borderWidth={1}
            borderColor="gray.300"
            h={12}
            mr={2}
            keyboardType="number-pad"
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
            placeholder="Repetições"
            bg="gray.600"
            borderWidth={1}
            borderColor="gray.300"
            h={12}
            mr={2}
            keyboardType="number-pad"
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
          size={12}
        />
      </TouchableOpacity>
      </HStack>
        {exerciseHistoric.length > 0 && 
          <Heading mt={2} color="white" fontSize="md" >Histórico</Heading>
        }

        {
          exerciseHistoric.map(item => (
            <VStack key={item.date}>
             <Heading key={item.date} color="gray.200" fontSize="md" mt={2} mb={2} fontFamily="heading">
              {item.date}
            </Heading>

            { item.data.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => handleSetValuesInFields({kilograms: item.kilograms, repetitions: item.repetitions})}
                onLongPress={() => handleOpenDeleteModal(item.id)}>
                <HStack w="full" px={2}  mb={2} bg="gray.600" rounded="md" alignItems="center" justifyContent="space-between">
                  <Text color="gray.100" fontSize="sm" numberOfLines={1}>
                    {item.kilograms} kg, {item.repetitions} repetições
                  </Text>
                </HStack>
              </TouchableOpacity>
            ))}
          </VStack>   
      ))
    }
    
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
         <Modal.Content maxW="400px" bg="gray.600">
         <Modal.CloseButton />
         <Modal.Body>
           <Heading mx={2} py={6} color="white" fontSize="md">
            Realmente deseja excluir o histórico?
          </Heading>

          <HStack>
            <Button 
              title="Excluir"
              mb={2}
              variant="outline"
              flex={1}
              onPress={handleDeleteExerciseHistoric}
              mr={4}
            />
            <Button 
              title="Cancelar"
              mb={2}
              variant="solid"
              flex={1}
              onPress={() => setShowModal(false)}
            />
          </HStack>
          </Modal.Body>
         </Modal.Content>
      </Modal>
    </VStack>
  )
}