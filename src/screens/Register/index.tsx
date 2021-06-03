import React, {useState, useEffect} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert, 
} from 'react-native';
import * as Yup from 'yup';
import { useNavigation} from '@react-navigation/native'
import {yupResolver} from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useForm} from 'react-hook-form'
import { CategorySelect } from '../../screens';
import {useAuth} from '../../hooks/auth';
import { Button, TransactionTypeButton, CategorySelectButton, InputForm } from '../../components/Form';
import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';
import uuid from 'react-native-uuid';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor númerico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório'),
});

function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  
  const {user} = useAuth();
  
  const dataKey = `@gofinances:transactions_${user.id}`;

  const [category, setCategory] = useState({
    key: 'category',
    name:'Categoria',
  });
  const navigation = useNavigation()
  const {
    control,
    handleSubmit,
    formState:{errors},
    reset,
    } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive'| 'negative'){
    setTransactionType(type);
  };

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  };

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  };

  async function handleRegister (form: FormData){
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação')

    if(category.key === 'category')
      return Alert.alert('Selecione o tipo da categoria')

    const newTransaction = {
      id:String(uuid.v4()),
      name:form.name,
      amount:form.amount,
      type:transactionType,
      category:category.key,
      date: new Date(),
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType('');
      setCategory(
        {
          key: 'category',
          name:'Categoria',
        }
      )
      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar")
      
    }
  }
  useEffect(() => {
    async function loadData(){
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));
    }
    loadData()
    
  },[])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />  
            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={()=> handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={()=> handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}  
          />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Register;
