import { ISelectProps, Select as NativeSelect } from "native-base";

type SelectProps = ISelectProps & {
  items: {label: string, value: string}[],
  errorMessage?: string | null;
}

export function Select({items, errorMessage=null,  ...rest}: SelectProps) {

  return (
    // <FormControl w="full" isRequired isInvalid={!!errorMessage}>
    <NativeSelect
      bg="gray.600"
      w="full" 
      placeholderTextColor="gray.300"
      fontSize="md"
      color="white"
      fontFamily="body"
      h={14}
      px={4}
      borderWidth={!!errorMessage ? 1 : 0}
      borderColor='red.500'
      
      {...rest}
      >
      {items.map(item => (
        <NativeSelect.Item 
        key={item.value} 
        label={item.label} 
        value={item.value}
        fontSize="md"
        fontFamily="body"
        />
      ))}
    </NativeSelect>
      // <FormControl.ErrorMessage _text={{color: "red.500"}}>
      //   {errorMessage}
      // </FormControl.ErrorMessage>
    // </FormControl>
  )
}