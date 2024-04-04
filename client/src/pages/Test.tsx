import React, {useEffect} from 'react';
import { useState } from 'react';
import api from '../api';

import tw from 'twin.macro';
import styled from 'styled-components';

const RadioImage = styled.label`
  width: 100px;
  height: 70px;
  ${tw`cursor-pointer bg-contain bg-no-repeat inline-block`}
  filter: brightness(1.8) grayscale(1) opacity(.7);

  &:hover{
    ${tw`filter-none!`}
  }
  input {
    ${tw`appearance-none`}
  }
  &:checked + label{
    ${tw`filter-none!`}
  }
`
const Selector = tw.div`m-0 p-0 appearance-none`

const Test: React.FC = (props) => {

  const [images, setImages] = useState<any[]>([])

  const getImages = async() => {
    const res = await api.get('/content/images')
    setImages(res.data)
  }
  
  useEffect(() => {
    getImages()
  }, []);

  return (
    <Selector>
      {!!images && images.map((image: any, index: number) => {
        return (
          <RadioImage key={index} id={image.filename} style={{backgroundImage: `url(${image.uri})`}}>
            <input type='radio' id={image.filename} />
          </RadioImage>
        )
      })}
    </Selector>
  );
}

export default Test;
