import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, Heading, Image, ScrollView, Skeleton, Text, useToast, VStack } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Select } from "@components/Select";

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
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) => schema
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value : null),
    }),
  old_password: yup
    .string()
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) => schema
        .nullable()
        .required('É necessário informar a senha antiga para alterar a senha atual.')
        .transform((value) => !!value ? value : null),
    }),
})

export function RegisterExercise() {
  const [groupsFormatted, setGroupsFormatted] = useState<GroupsFormattedProps[]>([])
  const [isRegistering, setIsRegistering] = useState(false);
  const [thumbIsLoading, setThumbIsLoading] = useState(false);
  const [demoIsLoading, setDemoIsLoading] = useState(false);

  const toast = useToast();
  const { user } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema)
  });

  async function fetchGroups() {
    try {
      // setIsLoading(true);
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
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function handleUserPhotoSelect(){
    // setPhotoIsLoading(true);

    // try {
    //   const photoSelected = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     quality: 1,
    //     aspect: [4,4],
    //     allowsEditing: true,
    //     // base64: true
    //   })
      
    //   if(photoSelected.canceled) {
    //     return
    //   }

    //   if(photoSelected.assets[0].uri) {
    //     const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        
    //     if(photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5){
    //       return toast.show({
    //         title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
    //         placement: 'top',
    //         bgColor: 'red.500'
    //       })          
    //     }
        
    //     const fileExtension = photoSelected.assets[0].uri.split('.').pop();

    //     const photoFile = {
    //       name: `${user.name}.${fileExtension}`.toLowerCase().replace(/\s/g,''),
    //       uri: photoSelected.assets[0].uri,
    //       type: `${photoSelected.assets[0].type}/${fileExtension}`
    //     } as any;

    //     const userPhotoUploadForm = new FormData();
    //     userPhotoUploadForm.append('avatar', photoFile);

    //     const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });

    //     const userUpdated = user;
    //     userUpdated.avatar = avatarUpdatedResponse.data.avatar;
    //     updateUserProfile(userUpdated);

    //     toast.show({
    //       title: 'Foto atualizada!',
    //       placement: 'top',
    //       bgColor: 'green.500'
    //     })
    //   }
      
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setPhotoIsLoading(false)
    // }
  }

  async function handleRegisterExercise(data: FormDataProps) {
    console.log(data)
    // try {
    //   setUpdating(true);

    //   const userUpdated = user;
    //   userUpdated.name = data.name;

    //   await api.put('/users', data);

    //   await updateUserProfile(userUpdated);

    //   toast.show({
    //     title: 'Perfil atualizado com sucesso!',
    //     placement: 'top',
    //     bgColor: 'green.500'
    //   })
    // } catch (error) {
    //   const isAppError = error instanceof AppError;
    //   const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

    //   toast.show({
    //     title,
    //     placement: 'top',
    //     bgColor: 'red.500'
    //   })
    // } finally {
    //   setUpdating(false);
    // }
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
              user.avatar
               ? {uri: user.avatar}
               : defaultUserPhotoImg} 
               alt="Demo do exercício"
               w={DEMO_SIZE}
               h={DEMO_SIZE} 
              rounded="md"
              mr={4}
              resizeMode="center"
            />
          </Skeleton>
         
         <TouchableOpacity onPress={handleUserPhotoSelect}>
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
                user.avatar
                 ? {uri: user.avatar}
                 : defaultUserPhotoImg} 
              alt="Thumbnail do exercício"
              size={THUMB_SIZE} 
              rounded="sm"
           />
          </Skeleton>
         
         <TouchableOpacity onPress={handleUserPhotoSelect}>
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
              />
            )}
          />

          <Controller
            control={control}
            name="group"
            render={({field: {onChange}}) => (
              <Select 
                placeholder="Selecione um grupo"
                accessibilityLabel="Selecione um grupo"
                items={groupsFormatted}
                onValueChange={onChange}
            />
            )}
          />
    
          <Button 
            title="Adicionar"
            mt={4}
            onPress={handleSubmit(handleRegisterExercise)}
            isLoading={isRegistering}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}