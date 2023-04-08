import { Heading, HStack, Modal, Pressable, SectionList, Text, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "@services/api";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { AppError } from "@utils/AppError";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/ReactQuery";
import { RefreshControl } from "react-native";
import { Button } from "@components/Button";

export function History() {
  const [showModal, setShowModal] = useState(false);
  const [deleteExerciseDayHistoryId, setDeleteExerciseDayHistoryId] = useState('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId })
  }

  const toast = useToast();

  const {data: exercises, isLoading} = useQuery<HistoryByDayDTO[]> (['history'], async() => {
    try {
      const response = await api.get('/history');
      return response.data;

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });

      return [];
    }
  })

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries(['history']);
  }, []);

  function handleOpenModalDeleteExerciseDetails(id: string) {
    setShowModal(true)
    setDeleteExerciseDayHistoryId(id)
  }

  async function handleDeleteExerciseDetails() {
    try {
      await api.delete('/history', { params: {id: deleteExerciseDayHistoryId}});
      onRefresh();

      toast.show({
        title: "Histórico apagado.",
        placement: 'top',
        bgColor: 'green.500'
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao tentar apagar, tente novamente mais tarde.';
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setDeleteExerciseDayHistoryId('')
      setShowModal(false)
    }
  }

  useFocusEffect( useCallback( () => {
    onRefresh();
  },[]))

  return(
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios"/>

      {
        isLoading ? <Loading/> :
        <SectionList
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
          sections={exercises ?? []}
          keyExtractor={item => item.id}
          renderItem={({item}) => 
          <Pressable
           onPress={() => handleOpenExerciseDetails(item.exercise_id)}
           onLongPress={() => handleOpenModalDeleteExerciseDetails(item.id)}
           >
            <HistoryCard data={item}/>
          </Pressable>
          }
          renderSectionHeader={({section}) => (
            <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises!.length === 0 && {flex: 1, justifyContent: 'center'}}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
       }

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
         <Modal.Content maxW="400px" bg="gray.600">
         <Modal.CloseButton />
         <Modal.Body>
           <Heading mx={2} py={6} color="white" fontSize="md">
            Realmente deseja excluir o exercício do histórico?
          </Heading>

          <HStack>
            <Button 
              title="Excluir"
              mb={2}
              variant="outline"
              flex={1}
              onPress={handleDeleteExerciseDetails}
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