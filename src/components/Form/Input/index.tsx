import React from 'react';
import { TextInputProps } from 'react-native';
import { Container } from './styles';

type Props = TextInputProps;

function Input({...rest}) {
  return (
    <Container {...rest}>
      
    </Container>
  );
};

export default Input;
