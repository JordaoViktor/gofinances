import React from 'react';
import { Input } from '../../components/Form'
import { Container, Header, Title, Form } from './styles';

function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Input 
          placeholder="Nome"
        />
        <Input 
          placeholder="Preço"
        />  
      </Form>
    </Container>
  );
};

export default Register;
