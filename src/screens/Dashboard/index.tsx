import React from 'react';
import { HighlightCard, TransactionCard } from '../../components';
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
  HighlightCards,
  Transactions,
  Title,
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
      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard 
          type="down"
          title="Saídas"
          amount="R$ 17.400,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard 
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionCard/>
      </Transactions>

    </Container>
  );
}

export default Dashboard;