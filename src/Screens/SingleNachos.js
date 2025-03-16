import React from 'react';
import { useParams } from 'react-router-dom';
import { Nachos } from '../Data/PopcornData'; 
import Layout from '../Layout/Layout';
import NachosInfo from '../Components/SingleNachos/NachosInfo';

function SingleNachos() {
  const { id } = useParams();
  const nachos = Nachos.find(item => item.name === id); 

  if (!nachos) {
    return <div className="text-white">Popcorn not found!</div>;
  }

  return (
    <Layout>
      <NachosInfo nachos={nachos} />

    </Layout>
  );
}

export default SingleNachos
