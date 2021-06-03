import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VictoryPie} from 'victory-native';
import { ActivityIndicator } from 'react-native';
import { HistoryCard } from '../../components';
import { useTheme } from 'styled-components/native';
import { useFocusEffect} from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import {addMonths, subMonths, format} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import {useAuth} from '../../hooks/auth';
import { categories } from '../../Utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
 } from './styles';
 
interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date:string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormmated:string;
  color:string;
  percentFormatted: string;
  percent: number;
}

function Resume() {
  const [isLoading, setIsLoading]= useState(false);
  const [selectedDate, setSelectedDate]= useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme()

  function handleDateChange(action: 'next' | 'prev'){
    if(action === 'next'){
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate)
    } else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate)

    }
  }
  const {user} = useAuth()
  async function loadData(){
    setIsLoading(true)
    const dataKey = `@gofinances:transactions_${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) =>
        expensive.type === 'negative' && 
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
      );

    const expensivesTotal = expensives.reduce((accumulator: number, expensive: TransactionData) => {
      return accumulator + Number(expensive.amount);
    },0);

    const totalByCategory:CategoryData[] = []
    categories.forEach(category=> {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount);
        }

      })
      if(categorySum > 0){
        const totalFormmated = categorySum.toLocaleString('pt-BR',{
          style:'currency',
          currency:'BRL',
        })

        const percent = (categorySum / expensivesTotal * 100);
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name:category.name,
          color:category.color,
          total:categorySum,
          totalFormmated,
          percent,
          percentFormatted
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
     
  }
  
  useFocusEffect(useCallback(() =>{
    loadData();
  },[selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ?
      <LoadingContainer>
        <ActivityIndicator 
          color={theme.colors.primary}
          size="large"
        />
        </LoadingContainer> :
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal:24,
            paddingBottom:useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={()=>handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left"/>
            </MonthSelectButton>
            <Month>
            {format(selectedDate, "MMMM, yyy",{locale:ptBR})}
            </Month>
            <MonthSelectButton onPress={()=>handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right"/>
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie 
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              style={{labels:{
                fontSize:RFValue(18),
                fontWeight:'bold',
                fill:theme.colors.shape
              }}}
              labelRadius={50}
              x="percentFormatted"
              y="total"
            />
          </ChartContainer>
          {
            totalByCategories.map(item=>(
              <HistoryCard
                key={item.key}
                title={item.name}
                amount={item.totalFormmated}
                color={item.color}
              />
            ))
          }
        </Content>
      }
    </Container>
  );
};

export default Resume;
