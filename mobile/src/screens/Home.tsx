import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";
import {
  useQuery
} from '@tanstack/react-query';

import {AppNavigatorRoutesProps} from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";
import { RefreshControl } from "react-native";
import { queryClient } from "../lib/ReactQuery";

export function Home() {
  const [groupSelected, setGroupSelected] = useState("antebraço");

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId })
  }
      
  const { data: groups, isLoading } = useQuery<string[]>(['groups'],
  async () => {
    try {
      const response = await api.get('/groups');
      setGroupSelected(response.data[0]);
      return response.data;
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
      return [];
    }
  });

  const { data: exercises, isLoading: isLoadingExercise } = useQuery<ExerciseDTO[]>(['exerciseDTO', groupSelected], 
  async () => {
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      return response.data;

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

      return [];
    }
  });

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries(['groups']);
    queryClient.invalidateQueries(['exerciseDTO', groupSelected]);
  }, []);
  
  return(
    <VStack flex={1}>
      <HomeHeader/>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Group 
            name={item} 
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase() }
            onPress={() => setGroupSelected(item)}
          />
        )}
        _contentContainerStyle={{px:8}}
        my={10}
        maxH={10}
        minH={10}
      />

      {
        isLoading || isLoadingExercise ? <Loading/> :
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises?.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)}/>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{paddingBottom:20}}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
          />
        </VStack>
      }
    </VStack>
    )
}