import React from 'react';
import { useParams } from 'react-router-dom';
import { Popcorn } from '../Data/PopcornData'; 
import Layout from '../Layout/Layout';
import PopcornInfo from '../Components/SinglePop/PopcornInfo';

function SinglePopcorn() {
  const { id } = useParams();
  const popcorn = Popcorn.find(item => item.name === id); 

  if (!popcorn) {
    return <div className="text-white">Popcorn not found!</div>;
  }

  return (
    <Layout>
      <PopcornInfo popcorn={popcorn} />

    </Layout>
  );
}

export default SinglePopcorn;
