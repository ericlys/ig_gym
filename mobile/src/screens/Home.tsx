import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";

import {AppNavigatorRoutesProps} from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState("")

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId })
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const response = await api.get('/groups');
      setGroups(response.data);
      setGroupSelected(response.data[0]);

    }catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchExercisesByGroup() {
    if(!groupSelected){
      return
    }
    
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  },[])

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]))

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
        isLoading ? <Loading/> :
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
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
          />
        </VStack>
      }
    </VStack>
    )
}