import tw from 'twin.macro'
import styled from 'styled-components'

export const Wrapper = tw.div`flex min-h-screen mx-auto`
export const ContentWrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 6rem);
  margin-top: 4rem;
  ${tw`ml-16 w-mini-dash`}
  background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  --tw-bg-opacity: 1;
  ${tw`lg:ml-60 lg:w-max-dash`}
`

export const ContentAreaContainer = tw.div`grid gap-x-6 grid-cols-12`
export const ContentArea = tw.div`col-span-12`

export const ContentAreaHeader = tw.div`grid gap-x-6 lg:grid-cols-2 md:mb-10 mb-24 h-12`
export const ContentAreaHeaderTitleArea = tw.div`relative`
export const ContentAreaHeaderTitle = styled.h1`
  position: relative;
  ${tw`flex flex-row flex-wrap`}
  width: -moz-fit-content;
  max-width: 100%;
  margin-bottom: 0px;
  padding-right: 18px;
  font-size: 2rem;
  line-height: normal;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const ContentAreaHeaderDescription = styled.p`
  width: 100%;
  margin: 0px;
  ${tw`flex flex-row flex-wrap`}
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
  color: rgb(120, 126, 143);
`
export const ContentAreaHeaderActionArea = tw.div`flex md:justify-end justify-start mt-4 md:mt-0`