import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import logo from "../../assets/images/logo-semfundo.png";

import {FaFacebookF, FaInstagram, FaTwitter} from 'react-icons/fa'
import { useAuth } from "../../hooks/auth";

const Container = tw.div`relative text-gray-100 -mb-8`
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const Row = tw.div`flex items-center justify-center flex-col px-8`

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`
const Link = tw.a`border-b-2 border-transparent hocus:text-gray-300 hocus:border-gray-300 pb-1 transition duration-300 mt-2 mx-4`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`

const Footer: React.FC = () => {
  const {user, signOut} = useAuth()
  return (
    <Container className="bg-black opacity-90">
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>GoSorte</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link href="#">Início</Link>
            <Link href="/regulamento">Regulamento</Link>
            {user && <Link href="#" onClick={() => signOut()}>Sair</Link>}
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com">
              <FaFacebookF />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://instagram.com/GOSORTE.com">
              <FaInstagram />
            </SocialLink>
          </SocialLinksContainer>
          <CopyrightText>
            &copy; Copyright 2021. Todos os direitos reservados.
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};

export default Footer;