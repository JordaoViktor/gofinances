import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

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

function SignIn() {
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
          />
          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
          />
        </FooterWraper>
      </Footer>
    </Container>
  );
};

export default SignIn;
