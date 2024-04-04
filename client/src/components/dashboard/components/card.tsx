import tw from 'twin.macro'
import styled from 'styled-components'

export const Card = tw.div`bg-white shadow-md rounded`
export const CardBody = tw.div`p-5`
export const CardTextArea = tw.div`flex justify-between flex-nowrap pt-4`

export const CardTitle = styled.p`
  margin: 0px;
  line-height: normal;
  color: rgb(41, 43, 44);
  font-size: 13px;
  font-weight: 600;
  text-transform: none;
`

export const CardText = styled.p`
  margin: 0px;
  line-height: normal;
  color: rgb(158, 167, 184);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
`