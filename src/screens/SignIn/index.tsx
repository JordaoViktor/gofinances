import React,{useState} from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import {ActivityIndicator, Platform} from 'react-native';
import {useTheme} from 'styled-components/native'
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
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple} = useAuth();

  const theme = useTheme()
  async function handleSignInWithGoogle(){
    try {
      setIsLoading(true)
      return await signInWithGoogle()
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Google')
      setIsLoading(false)
    }
  }
  async function handleSignInWithApple(){
    try {
      setIsLoading(true)
      return await signInWithApple()
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Apple')
      setIsLoading(false)
    }
  }

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
          {Platform.OS === 'ios' && 
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          }
        </FooterWraper>
        {isLoading &&
         <ActivityIndicator
            color={theme.colors.shape}
            style={{marginTop:18}}
          />}
      </Footer>
    </Container>
  );
};

export default SignIn;
