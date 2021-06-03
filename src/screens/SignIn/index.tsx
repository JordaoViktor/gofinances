import React, {useContext} from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import {useAuth} from '../../hooks/auth';
import { 
  Container,
  Header,
  Title,
  TitleWraper,
  SignInTitle,
  Footer,
  FooterWraper,
} from './styles';
import SignInSocialButton from '../../components/SignInSocialButton'
import { Alert } from 'react-native';

function SignIn() {
  const {user, signInWithGoogle, signInWithApple} = useAuth();
  async function handleSignInWithGoogle(){
    try {
      await signInWithGoogle()
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Google')
    }
  }
  async function handleSignInWithApple(){
    try {
      await signInWithApple()
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Apple')
    }
  }
  console.log(user)

  return (
    <Container>
      <Header>
        <TitleWraper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>

        </TitleWraper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWraper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInWithApple}
          />
        </FooterWraper>
      </Footer>
    </Container>
  );
};

export default SignIn;
