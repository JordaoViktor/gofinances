import React, {useState} from 'react';
import { Modal } from 'react-native';
import {CategorySelect} from '../../screens'
import { Input, Button, TransactionTypeButton, CategorySelectButton } from '../../components/Form'
import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';

function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name:'Categoria',
  });

  function handleTransactionTypeSelect(type: 'up'| 'down'){
    setTransactionType(type);
  }
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }
  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input 
            placeholder="Nome"
          />
          
          <Input 
            placeholder="Preço"
          />  
          <TransactionTypes>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={()=> handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={()=> handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionTypes>
          <CategorySelectButton
            title="Categoria"
            onPress={handleOpenSelectCategoryModal}
           />
        </Fields>
        <Button title="Enviar"/>
      </Form>
      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  );
};

export default Register;
