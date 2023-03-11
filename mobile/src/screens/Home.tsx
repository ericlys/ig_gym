import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, VStack } from "native-base";

import {AppNavigatorRoutesProps} from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home() {
  const [groups, setGroups] = useState(["Costas", "Bíceps", "Tríceps", "Ombros"])
  const [exercises, setExercises] = useState(["Puxada frontal", "Remada curva", "Remada unilateral", "Levantamento terra"])
  const [groupSelected, setGroupSelected] = useState("Ombros")

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate("exercise")
  }

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
          keyExtractor={item => item}
          renderItem={({item}) => (
            <ExerciseCard title={item} onPress={handleOpenExerciseDetails}/>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{paddingBottom:20}}
        />
      </VStack>

    </VStack>
    )
}