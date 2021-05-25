import React from 'react';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
} from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
        <Header>
          <UserWrapper>
            <UserInfo>
                <Photo source={{ uri:'https://avatars.githubusercontent.com/u/51103445?v=4'}}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Jordão</UserName>
                </User>
            </UserInfo>
            <Icon name="power"/>
          </UserWrapper>
        </Header>
    </Container>
  );
}

export default Dashboard;