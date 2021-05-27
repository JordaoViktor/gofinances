import React, {useState} from 'react';
import { Input, Button, TransactionTypeButton } from '../../components/Form'
import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';

function Register() {
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(type: 'up'| 'down'){
    setTransactionType(type);
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
        </Fields>
        <Button title="Enviar"/>
      </Form>
    </Container>
  );
};

export default Register;
