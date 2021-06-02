import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VictoryPie} from 'victory-native';
import {HistoryCard} from '../../components';
import {useTheme } from 'styled-components/native';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
 } from './styles';
import { categories } from '../../Utils/categories';
import { useFocusEffect} from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize';

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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme()
  async function loadData(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) =>expensive.type === 'negative');

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
     
  }
  useEffect(() => {
    loadData();
  },[])
  useFocusEffect(useCallback(() =>{
    loadData();
  },[]))
  console.log(totalByCategories)

  return (
    <Container>
     <Header>
       <Title>Resumo por categoria</Title>
     </Header>

     <Content>
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
    </Container>
  );
};

export default Resume;
