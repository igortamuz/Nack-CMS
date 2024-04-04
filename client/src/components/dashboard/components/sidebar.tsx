import tw from 'twin.macro'
import styled from 'styled-components'

export const SidebarArea = tw.div`fixed min-h-screen w-16 lg:w-60 overflow-x-hidden bg-black opacity-90 bg-no-repeat`

// export const SidebarArea = styled.div`
//   background: rgba(0,0,0,0.9) none repeat scroll 0% 0%;
//   ${tw`fixed min-h-screen w-16 lg:w-60 overflow-x-hidden`}
// `

export const SidebarHeader = tw.div`flex h-16 bg-black opacity-90 items-center justify-center border-b`
export const SidebarLogo = styled.div``
export const SidebarMenu = tw.div`flex flex-col flex-wrap`
// export const SidebarMenuGroupHeader = styled.div`
//   display: flex;
//   -moz-box-pack: justify;
//   justify-content: space-between;
//   ${tw`pl-0 lg:pl-8 text-xs lg:text-sm uppercase tracking-normal lg:tracking-widest`}
//   padding-right: 1.6rem;
//   padding-top: 1rem;
//   margin-bottom: 0.9rem;
//   color: rgb(91, 98, 111);
//   font-weight: 800;
//   max-height: 26px;
// `

export const SidebarMenuGroupHeader = tw.div`
  flex flex-col justify-between pr-6 pt-4 mb-4 text-gray-500 font-bold max-h-6
  pl-0 lg:pl-8 text-xs lg:text-sm uppercase tracking-normal lg:tracking-widest
`

// export const SidebarMenuGroup = styled.div`
//   max-height: 180px;
//   margin-bottom: 19px;
//   overflow: auto;
// `
export const SidebarMenuGroup = tw.div`overflow-auto mb-5 max-h-44`
// color: rgb(145, 155, 174);
// padding-bottom: 0.2rem;
export const SidebarMenuItem = styled.div`
  a {
    ${tw`flex relative cursor-pointer no-underline pt-2 pl-8 pb-1 text-gray-500`};
    min-height: 2.5rem;
    border-left: 0.3rem solid transparent;
    &:hover {
      ${tw`text-white bg-gray-800 border-l-4 border-green-custom no-underline`}
    };
    &.active {
      ${tw`text-white bg-gray-800 border-l-4 border-green-custom no-underline`}
    }
  }
`

export const SidebarMenuItemText = styled.span`
  display: inline-block;
  ${tw`pl-8 w-full`}
`

export const SidebarMenuItemIcon = (icon: any) => tw(icon)`absolute h-5 leading-4 top-menu-item left-1` 