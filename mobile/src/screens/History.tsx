import { Heading, Pressable, SectionList, Text, useToast, VStack } from "native-base";
import { useCallback } from "react";
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

export function History() {
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
          <Pressable onPress={() => handleOpenExerciseDetails(item.exercise_id)}>
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

    </VStack>
  )
}