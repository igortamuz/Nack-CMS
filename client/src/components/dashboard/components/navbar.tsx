import tw from 'twin.macro'
import styled from 'styled-components'

export const Navbar = styled.div`
  ${tw`fixed ml-16 lg:ml-60 h-16 w-full z-10 bg-white`}
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`
export const NavbarUser = tw.div`flex fixed top-0 md:right-0 z-20`
export const NavbarUserBtn = styled.div`
  height: 4rem;
  line-height: 3.5rem;
  ${tw`flex flex-row w-full items-center px-8 cursor-pointer hocus:text-white transition duration-200 ease-out
    font-semibold
  `};
`
export const NavbarUserIcon = (icon: any) => tw(icon)`w-4 ml-2 h-14`