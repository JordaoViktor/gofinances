import React from 'react';
import { View, Text } from 'react-native';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName
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
          </UserWrapper>
        </Header>
    </Container>
  );
}

export default Dashboard;