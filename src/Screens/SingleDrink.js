import React from 'react';
import { useParams } from 'react-router-dom';
import { Drink } from '../Data/PopcornData'; 
import Layout from '../Layout/Layout';
import DrinkInfo from '../Components/SingleDrink/DrinkInfo';


function SingleNachos() {
  const { id } = useParams();
  const drink = Drink.find(item => item.name === id); 

  if (!drink) {
    return <div className="text-white">Popcorn not found!</div>;
  }

  return (
    <Layout>
      <DrinkInfo drink={drink} />

    </Layout>
  );
}

export default SingleNachos
