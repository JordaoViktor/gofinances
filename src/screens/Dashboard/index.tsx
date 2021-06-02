import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect} from '@react-navigation/native'
import {useTheme} from 'styled-components/native'
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
  LoadingContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction:string;
}
interface HighLightData {
  entries:HighlightProps;
  expensives:HighlightProps;
  total: HighlightProps;
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions]=useState<DataListProps[]>([])
  const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

  function getLastTransactionDate(
    collection:DataListProps[],
    type:'positive'| 'negative'
    ){
    const lastTransaction = new Date(Math.max.apply(Math, collection
      .filter((transaction ) => transaction.type === type)
      .map((transaction) => new Date(transaction.date).getTime())))

      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
        month:'long',
      })}`
  }

  const theme = useTheme()
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

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative')
    const totalInterval = `01 a ${lastTransactionExpensives}`

    const total =  entriesTotal - expensiveTotal;

    setHighLightData({
      entries:{
        amount: entriesTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        }),
        lastTransaction:`Última entrada dia ${lastTransactionEntries}`,
      },
      expensives:{
        amount:expensiveTotal.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        }),
        lastTransaction:`Última saida dia ${lastTransactionExpensives}`,
      },
      total:{
        amount: total.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        }),
        lastTransaction:totalInterval,
      }
    })
    setIsLoading(false)
  }
  useEffect(() =>{
    loadTransactions();
  },[])
  useFocusEffect(useCallback(() =>{
    loadTransactions();
  },[]))
  return (
    <Container>
      
      {
        isLoading ?
          <LoadingContainer>
            <ActivityIndicator 
              color={theme.colors.primary}
              size="large"
            />
          </LoadingContainer> :
        <>
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
              lastTransaction={highLightData.entries.lastTransaction}
            />
            <HighlightCard 
              type="down"
              title="Saídas"
              amount={highLightData.expensives.amount}
              lastTransaction={highLightData.expensives.lastTransaction}
            />
            <HighlightCard 
              type="total"
              title="Total"
              amount={highLightData.total.amount}
              lastTransaction={highLightData.total.lastTransaction}
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

        </>
      }
    </Container>
  );
}

export default Dashboard;