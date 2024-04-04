import React, { Fragment } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components'
// import Header from '../header'
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useHistory } from 'react-router';

interface IProps {
  images: any[];
  scrollTo: any;
}

interface IImage {
  readonly src: string;
}

const SliderNew = styled(Slider)`
  height: calc(100vh - 5rem)
  
  .slick-slide {
    ${tw`h-auto`}
  }

  .slick-slide > div {
    ${tw`h-full`}
    height: calc(100vh - 35rem)
  }
`

const ImageDiv  = styled.div<IImage>`
  ${tw`bg-center bg-cover h-full`}
  background-image: url(${props => props.src})
`

export const Wrapper = styled.div`
  ${tw`z-20 relative px-0 pt-6 md:pt-0`} 
`

const Hero: React.FC<IProps> = ({images}) => {
  
  const history = useHistory()

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <Fragment>
      {/* <Header scrollTo={scrollTo} /> */}
      <Wrapper>
        <SliderNew {...settings}>
          {images.map((image: any, index: number) =>{
            if (image){
              return <ImageDiv key={index} src={image.src} className="cursor-pointer" onClick={() => history.push(`/premio/${image.id}`)}/>
            }
          })}
        </SliderNew>
      </Wrapper>
    </Fragment>
    
  );
}

export default Hero;
