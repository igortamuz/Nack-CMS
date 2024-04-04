import React, { Fragment } from 'react';
import Header from '../components/header';
import Footer from '../components/footer'
import tw from 'twin.macro';
import styled from 'styled-components';

const Wrapper = styled.div`
  ${tw`max-w-screen-xl mx-auto flex flex-row flex-wrap`}
`

const Rules: React.FC = () => {
  return (
    <Fragment>
      <Header scrollTo=""/>
      <div className="flex items-center justify-center py-12">
        <h1 className="text-3xl border-gray-400 uppercase font-bold tracking-widest">Regulamento</h1>
      </div>
      <Wrapper className="mb-8">
        <p className="text-justify">
        GOSORTE<br/><br/>
        1. DA PARTCIPAÇÃO<br/><br/>
        Toda e qualquer pessoa acima de 18 anos pode participar do sorteio.<br/><br/>
        2. PAGAMENTO DO BILHETE<br/>
        O Pagamento deverá ser efetuado através de Transferência Bancaria, deposito, Boleto ou Cartão de Credito, depois nos enviar o comprovante ou anexar na sua conta.<br/><br/>
        3. O GANHADOR<br/>
        O ganhador do sorteio será sempre participante que tiver seu nome no celular gravado no bilhete premiado. No caso de pagamento em duplicidade, ou seja, em caso raro onde duas pessoas clicam no mesmo bilhete simultaneamente o ganhador do sorteio será o participante que tiver o nome e celular gravados no bilhete no momento do sorteio. por isso confira sempre no seu bilhete (Nome, telefone e CPF), havendo solicite o reembolso ou substituição da cota para outro número de bilhete.<br/><br/>
        4. REEMBOLSO.<br/>
        O reembolso de bilhete ocorre exclusivamente em casos de cancelamento da ação, (sistema Gosrte) ou seja, o criador da ação ou site não se obriga a reembolsar participantes em caso de desistência própria. OBS. Os pagamentos feitos com cartão de credito ou débitos recebera o valor pago menos a taxa da financeira do cartão, os demais que for na modalidade transferência ou deposito recebera o valor integral.<br/><br/>
        5. AQUI SUA COTA É GARANTIDA.<br/>
        Mesmo não sendo adquiridas todas as cotas da extração ativa ocorrerá o sorteio, sobre a quantidade mínima exigida pelo sistema Gosorte.<br/><br/>
        6. DAS PROIBIÇÕES<br/>
        É completamente vedado o uso de perfis falsos visando criar ações sem a genuína intenção de realiza-las seguindo os termos aqui dispostos, É completamente vedado a participação do organizador em sua própria ação.<br/>
        O sistema pode alterar a qualquer momento estes termos visando melhorar a qualidade do serviço oferecido, O site informará a todos os usuários sempre que ocorre uma alteração nos termos de uso, o usuários deverá aceitar as mudanças para continuar utilizando o site.<br/><br/>
        7. REGULAMENTO<br/>
        A  GoSorte é um  Pagamento Único, da Modalidade Filantropia Premiável regulamentada na  Lei Federal n. 13.019/14 art. 84 b , 84 c, cedida pela  ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAS (APAE) é uma entidade sem fins lucrativos de direito privado, além de proporcionar ajuda e distribuição de mantimentos você também tem direito de participação em sorteios da ação ativa, com a Gosorte você  irá  contribuir para o desenvolvimento e mantimentos da entidade (APAES) Adquira um ou mais bilhetes da Gosorte, e colabore com estes projetos, além de ajudar a muitas pessoas você pode sair com um prêmio excelente.<br/><br/>
        8. QUANDO SÃO OS SORTEIOS?<br/>
        O Sorteio ocorrerá através da extração da Loteria Federal, o sistema infomara com antecedência o dia mês de cada sorteio.<br/><br/>
        9. COMO FUNCIONA?<br/>
        Os sorteios da Gosorte são baseados nos resultados oficiais da Loteria Federal da Caixa. Você escolhe o prêmio que quer participar, escolhe quantos números quiser do certificado disponível com seu respectivo prêmio, recebe seu(s) número(s) dá sorte depois e só cruzar os dedos.<br/>
        Os resultados serão disponibilizados em nosso site (www.gosorte.com) ou pode acompanhar diretamente no site da caixa loteria federal http://loterias.caixa.gov.br/wps/portal/loterias  você também pode assistir  http://www.caixa.gov.br/loterias/transmissao/Paginas/default.aspx<br/>
        outra fonte que podera ser usada para caso o site da caixa loteria federal, não esteja disponível sera usado o site do jogo do bicho oficial https://www.ojogodobicho.com/deu_no_poste.htm o mesmo usara resultado da 1° coluna da data do dia da estração<br/>
        Características do sorteio (série 000 a 9999) podendo ter várias combinações dentre esses números o mesmo pode ser de 000 a 999 ou de 000 a 4999 ou de 000 a 9999 quem defini isso e o administrativo do sistema de acordo com o respectivo prêmio não podendo mexer na quantidade após o lançamento.<br/>
        A cada Título será atribuído a quantidade de cotas Número da Sorte para concorrer ao sorteio, não repetido na mesma série, composto de 3 (três) algarismos, compreendido entre 000 e 999.<br/><br/>
        Extração da Loteria Federal do Brasil<br/>
        5º.prêmio = 78488<br/>
        4º.prêmio = 44129<br/>
        3º.prêmio = 92652<br/>
        2º.Prêmio = 64624<br/>
        1º.prêmio = 50411<br/><br/>                                                               
        N° da sorte, 142<br/>
        N° da sorte, 042<br/>
        N° da sorte, 002<br/>
        N° da sorte, 014<br/><br/>
        O Número Sorteado neste caso o sorteio foi de 000 a 999 cotas (exemplos)<br/><br/>
        Será considerado contemplado o Título que tiver seu Número da Sorte, lido da esquerda para a direita, coincidente com o Número Sorteado apurado. Caso o número sorteado não seja contemplado por não ser adquirido na extração ativa, o prêmio acumulara para um novo sorteio na próxima extração da caixa loterias federais.<br/>
        Caso não ocorra extração da Loteria Federal do Brasil em alguma da(s) data(s) prevista(s), será considerada a próxima extração da Loteria Federal do Brasil que venha a ser realizada.<br/><br/>
        10. DIVULGAÇÃO<br/>
        A Gosorte obriga-se a identificar todos os Participantes ganhador de cada sorteio. Na hipótese da GOSORTE não conseguir identificar algum ganhador do prêmio dos sorteios em decorrência da informação de dados cadastrais incorretos, a mesma aguardará 40 (quarenta) dias, contados a partir da data do sorteio, para que o participante contemplado reclame o prêmio. Caso contrário, o mesmo será desclassificado. As informações sobre a Promoção Comercial, como o regulamento, o resultado do sorteio e os ganhadores serão divulgadas pelas redes sociais, grupos, por e-mail, através do site www.gosorte.com, bem como por outros meios, a exclusivo critérios da GOSORTE. As comunicações aos participantes sorteados serão feitas pela GOSORTE.<br/><br/>
        DESCLASSIFICAÇÃO<br/>
        Os Participantes poderão ser desclassificados automaticamente desta Promoção em caso de suspeita justificada de fraude ou fraude comprovada, podendo ainda responder nas esferas penal e cível. Haverá a desclassificação dos participantes que não atenderem a quaisquer dos requisitos, termos e condições previstos neste Regulamento, como, por exemplo, a prestação de informações inverídicas, incorretas, incompletas ou equivocadas.<br/>
        Poderão ser abertas tantas séries quantas forem necessárias desde que solicitadas pela subscritora. A Promoção tem abrangência em todo território Nacional.<br/><br/>
        11. DUVIDAS<br/>
        Entre em contato conosco através – telefone (84) 99935-7887.<br/>
        Período de elegibilidade descrito no slip do seu certificado de contribuição.<br/><br/>
        OBRIGADO PELA SUA DOAÇÃO.
        </p>
      </Wrapper>
      <Footer/>
    </Fragment>
  );
}

export default Rules;
