import React, {Fragment} from 'react';
import tw from 'twin.macro'
import styled from 'styled-components'

// import Header from '../components/header';
import Card from '../components/card'

import image from '../assets/images/TESTE.jpg'

const Wrapper = styled.div`
  ${tw`max-w-screen-xl mx-auto flex flex-row flex-wrap`}
` 

const Premios: React.FC = () => {
  return (
    <Fragment>
      {/* <Header /> */}
      <div className="flex items-center justify-center py-12">
        <h1 className="text-3xl border-gray-400">Prêmios disponíveis</h1>
      </div>
      <Wrapper>
        {/* <Card imageSrc={image} title={"Sorteio Iphone 12"} quantity={"X"}/>
        <Card imageSrc={image} title={"Sorteio Iphone 12"} quantity={"X"}/>
        <Card imageSrc={image} title={"Sorteio Iphone 12"} quantity={"X"}/>
        <Card imageSrc={image} title={"Sorteio Iphone 12"} quantity={"X"}/> */}
      </Wrapper>
      
    </Fragment>
  );
}

export default Premios;
