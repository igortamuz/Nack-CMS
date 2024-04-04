import React from 'react';
import tw from 'twin.macro'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';
import {FaDollarSign, FaHourglass} from 'react-icons/fa'

interface CardProps {
  imageSrc: string;
  title: string;
  quantity: string;
  id: string;
  price: number;
}

const CardArea = tw.div`h-full flex! flex-col sm:border
  max-w-sm sm:rounded-tl-3xl sm:rounded-br-3xl relative focus:outline-none md:w-96 w-80
  first:ml-4 last:mr-0 mx-0 md:mx-4 mb-4 bg-white
`;

const CardImage = styled.div`
  ${tw`w-full h-56 sm:h-64 bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-3xl`}
`
const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-xl font-bold text-gray-800`;
const Text = styled.div`
  ${tw`ml-2 text-sm font-semibold`}
  color: #718096
`

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
// const Description = tw.p`text-sm leading-loose mt-2 sm:mt-4`;
const PrimaryButtonBase = tw.button`px-8 py-3 font-bold rounded text-gray-100 hocus:text-gray-200 focus:shadow focus:outline-none transition duration-300`;
const PrimaryButton = styled(PrimaryButtonBase)`
  ${tw`mt-auto sm:text-lg rounded-none w-full rounded sm:rounded-none sm:rounded-br-3xl py-3 sm:py-6`}
  background-color: #02c10e;
  &:hover, &:focus{
    background-color: #00ae0b;
  }
`;
const Card: React.FC<CardProps> = ({imageSrc, title, quantity, price, id}) => {

  const history = useHistory()
  return (
    <CardArea>
      <CardImage style={{backgroundImage: `url(${imageSrc})`}}/>
      <TextInfo>
        <TitleReviewContainer>
          <Title>{title}</Title>
        </TitleReviewContainer>
        <SecondaryInfoContainer>
          <IconWithText>
            <IconContainer>
              <FaHourglass />
            </IconContainer>
            <Text>{quantity} disponíveis</Text>
          </IconWithText>
          <IconWithText>
            <IconContainer>
              <FaDollarSign/>
            </IconContainer>
            <Text>{price}.00</Text>
          </IconWithText>
        </SecondaryInfoContainer>
      </TextInfo>
      <PrimaryButton onClick={() => history.push(`/premio/${id}`)}>Comprar</PrimaryButton>
    </CardArea>
  )
}

export default Card;
