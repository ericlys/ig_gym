import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, Image, Modal, ScrollView, Skeleton, Text, useToast, VStack } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import defaultUserPhotoImg from "@assets/addImg.png";

import { Controller, useForm } from "react-hook-form";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Select } from "@components/Select";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

const THUMB_SIZE = 20;
const DEMO_SIZE = 80;

type GroupsFormattedProps = {
  label: string,
  value: string
}

type FormDataProps = {
  name: string;
  series: number;
  repetitions: number;
  group: string;
  demo: string;
  thumb: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome do exercício'),
  series: yup
    .number()
    .required('Informe a quantidade de series'),
  repetitions: yup
    .number()
    .required('Informe a quantidade de repetições'),
  group: yup
    .string()
    .required('Informe o grupo'),
  thumb: yup
    .string()
    .required('Adicione uma thumb'),
  demo: yup
    .string()
    .required('Adicione uma demo'),
})

export function RegisterExercise() {
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [groupsFormatted, setGroupsFormatted] = useState<GroupsFormattedProps[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [thumbIsLoading, setThumbIsLoading] = useState(false);
  const [demoIsLoading, setDemoIsLoading] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema)
  });

  const demoUrl = watch('demo');
  const thumbUrl = watch('thumb');

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      const groups = response.data.map((group: string) => ({ label: group, value: group}))
      setGroupsFormatted(groups);

    }catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } 
  }

  async function handleDemoSelect(){
    setDemoIsLoading(true);

    try {
      const demoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
      })
      
      if(demoSelected.canceled) {
        return
      }

      if(demoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(demoSelected.assets[0].uri)
        if(photoInfo.exists && (photoInfo.size / 1024 / 1024) > 8){
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 8MB.",
            placement: 'top',
            bgColor: 'red.500'
          })          
        }
        
        const fileExtension = demoSelected.assets[0].uri.split('.').pop();
        const filenameFormatted = demoSelected.assets[0].uri;

        const demoFile = {
          name: filenameFormatted.toLowerCase().replace(/\s/g,''),
          uri: demoSelected.assets[0].uri,
          type: `${demoSelected.assets[0].type}/${fileExtension}`
        } as any;

        const demoUploadForm = new FormData();
        demoUploadForm.append('demo', demoFile);

        const demoUploadResponse = await api.post('/exercises/demo', demoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setValue('demo', demoUploadResponse.data.img_url);

        toast.show({
          title: 'Demo adicionada',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setDemoIsLoading(false)
    }
  }

  async function handleThumbSelect(){
    setThumbIsLoading(true);

    try {
      const thumbSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.1,
        aspect: [4,4],
        allowsEditing: true,
      })
      
      if(thumbSelected.canceled) {
        return
      }

      if(thumbSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(thumbSelected.assets[0].uri)
        if(photoInfo.exists && (photoInfo.size / 1024 / 1024) > 1){
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 1MB.",
            placement: 'top',
            bgColor: 'red.500'
          })          
        }
        
        const fileExtension = thumbSelected.assets[0].uri.split('.').pop();
        const filenameFormatted = thumbSelected.assets[0].uri;

        const thumbFile = {
          name: filenameFormatted.toLowerCase().replace(/\s/g,''),
          uri: thumbSelected.assets[0].uri,
          type: `${thumbSelected.assets[0].type}/${fileExtension}`
        } as any;

        const thumbUploadForm = new FormData();
        thumbUploadForm.append('thumb', thumbFile);

        const thumbUploadResponse = await api.post('/exercises/thumb', thumbUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setValue('thumb', thumbUploadResponse.data.img_url);

        toast.show({
          title: 'Thumb adicionada',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setThumbIsLoading(false)
    }
  }

  async function handleRegisterExercise(data: FormDataProps) {
    try {
      setIsRegistering(true);

      await api.post('/exercises', {
        name: data.name,
        series: data.series,
        repetitions: data.repetitions,
        group: data.group,
        demo: demoUrl,
        thumb: thumbUrl
      });

      toast.show({
        title: 'Exercício registrado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      reset();
      navigation.navigate('home');

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsRegistering(false);
    }
  }

  function handleAddNewGroup() {
    setNewGroup('')
    setShowModal(false)
    const newGroupFormatted = newGroup.replace(/\s/g, '');
    const checkIfGroupAlreadyExists = groupsFormatted.find(group => group.label.toLowerCase() === newGroupFormatted.toLowerCase())

    if(!!checkIfGroupAlreadyExists){
      setValue("group", checkIfGroupAlreadyExists.value)
      return
    }

    const group = {label: newGroupFormatted, value: newGroupFormatted}
    setGroupsFormatted([group, ...groupsFormatted])

    setValue("group", newGroupFormatted)
  }

  useEffect(() => {
    fetchGroups();
  },[])

  return(
    <VStack flex={1}>
      <ScreenHeader title="Novo exercício"/>

      <ScrollView contentContainerStyle={{paddingBottom: 36}}>
        <Center mt={6} px={10} >        
          <Skeleton 
            isLoaded={!demoIsLoading}
            w={DEMO_SIZE}
            h={DEMO_SIZE} 
            startColor="gray.500"
            endColor="gray.400"
          >
            <Image 
             source={ 
              demoUrl
               ? {uri: demoUrl}
               : defaultUserPhotoImg} 
              alt="Demo do exercício"
              w={DEMO_SIZE}
              h={DEMO_SIZE} 
              borderWidth="1"
              borderColor={errors.demo ? "red.500" : "gray.400"}
              rounded="md"
              mr={4}
              resizeMode="contain"
            />
          </Skeleton>
         
         <TouchableOpacity onPress={handleDemoSelect}>
          <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
            Adicionar Demonstração (gif)
          </Text>
         </TouchableOpacity>

         <Skeleton 
            isLoaded={!thumbIsLoading}
            w={THUMB_SIZE}
            h={THUMB_SIZE} 
            startColor="gray.500"
            endColor="gray.400"
          >
            <Image 
              source={ 
                thumbUrl
                 ? {uri: thumbUrl}
                 : defaultUserPhotoImg} 
              alt="Thumbnail do exercício"
              borderWidth="1"
              borderColor={errors.demo ? "red.500" : "gray.400"}
              size={THUMB_SIZE} 
              rounded="sm"
              resizeMode="contain"
           />
          </Skeleton>
         
         <TouchableOpacity onPress={handleThumbSelect}>
          <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
            Adicionar thumbnail
          </Text>
         </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({field: {value, onChange}}) => (
              <Input 
                placeholder="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="series"
            render={({field: {onChange}}) => (
              <Input
                placeholder="Series"
                bg="gray.600"
                onChangeText={onChange}
                keyboardType={"decimal-pad"}
                errorMessage={errors.series?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="repetitions"
            render={({field: {onChange}}) => (
              <Input
                placeholder="Repetições"
                bg="gray.600"
                onChangeText={onChange}
                keyboardType={"decimal-pad"}
                errorMessage={errors.repetitions?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="group"
            render={({field: {value, onChange}}) => (
              <Select 
                placeholder="Selecione um grupo"
                accessibilityLabel="Selecione um grupo"
                items={groupsFormatted}
                onValueChange={onChange}
                selectedValue={value}
                errorMessage={errors.group?.message}
                
              />
            )}
          />
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={4}>
              Adicionar novo grupo
            </Text>
          </TouchableOpacity>
    
          <Button 
            title="Adicionar"
            mt={4}
            onPress={handleSubmit(handleRegisterExercise)}
            isLoading={isRegistering}
          />
        </Center>
      </ScrollView>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
         <Modal.Content maxW="400px" bg="gray.600">
         <Modal.CloseButton />
         <Modal.Body>
            <Input 
              mt={10} 
              placeholder="Nome do novo grupo"
              onChangeText={setNewGroup}
              value={newGroup}
            />

            <Button 
              title="Criar"
              mb={2}
              variant="outline"
              onPress={handleAddNewGroup}
              disabled={newGroup.replace(/\s/g, '').length < 3}
              isLoading={isRegistering}
            />
          </Modal.Body>
         </Modal.Content>
      </Modal>
    </VStack>
  )
}