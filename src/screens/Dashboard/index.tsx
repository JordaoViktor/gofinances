import React, {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect} from '@react-navigation/native'
import { HighlightCard, TransactionCard} from '../../components';
import {TransactionCardProps} from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
}
interface HighLightData {
  entries:HighlightProps;
  expensives:HighlightProps;
  total:HighLightData;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions]=useState<DataListProps[]>([])
  const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);
  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) :[]

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps)=>{
        if(item.type === 'positive'){
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount)
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style:'currency',
          currency:'BRL',
        })
      
        const date = Intl.DateTimeFormat('pt-BR',{
          day:'2-digit',
          month:'2-digit',
          year:'2-digit',
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          type:item.type,
          category: item.category,
          date,
        }
    });
    setTransactions(transactionsFormatted);
    const total =  entriesTotal - expensiveTotal;

    setHighLightData({
      entries:{
        amount: entriesTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        })
      },
      expensives:{
        amount:expensiveTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        })
      },
      total:{
        amount: total.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        })
      }
    })
  }
  useEffect(() =>{
    loadTransactions();
  },[])
  useFocusEffect(useCallback(() =>{
    loadTransactions();
  },[]))
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
          <LogoutButton onPress={()=>{}}>
            <Icon name="power"/>
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas"
          amount={highLightData.entries.amount}
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard 
          type="down"
          title="Saídas"
          amount={highLightData.expensives.amount}
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard 
          type="total"
          title="Total"
          amount={highLightData.total.amount}
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data={item}/>}
        />
        
      </Transactions>

    </Container>
  );
}

export default Dashboard;