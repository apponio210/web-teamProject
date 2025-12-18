import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  border-top: 1px solid #e5e5e5;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #e5e5e5;
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 28px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  color: #212121;
  text-align: left;

  &:hover {
    color: #666;
  }
`;

const AccordionIcon = styled.span`
  position: relative;
  width: 18px;
  height: 18px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: #212121;
    transition: transform 0.3s ease;
  }

  &::before {
    width: 100%;
    height: 1.5px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  &::after {
    width: 1.5px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%)
      rotate(${(props) => (props.$open ? "90deg" : "0")});
  }
`;

const AccordionContent = styled.div`
  max-height: ${(props) => (props.$open ? "400px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const ContentInner = styled.div`
  padding: 0 0 28px 0;
  font-size: 15px;
  color: #666;
  line-height: 1.8;

  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const Accordion = ({ product }) => {
  console.log("Accordion product:", product);

  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      title: "상세 정보",
      content: (
        <ul>
          {product?.details?.description && (
            <li>{product.details.description}</li>
          )}
          {product?.details?.usages?.map((usage, i) => (
            <li key={i}>{usage}</li>
          ))}
          {product?.details?.temperatureControl && (
            <li>온도 조절: {product.details.temperatureControl}</li>
          )}
          {product?.details?.design && (
            <li>디자인: {product.details.design}</li>
          )}
          {product?.details?.madeIn?.length > 0 && (
            <li>제조국: {product.details.madeIn.join(", ")}</li>
          )}
        </ul>
      ),
    },
    {
      title: "지속 가능성",
      content: (
        <ul>
          {product?.sustainability?.description && (
            <li>{product.sustainability.description}</li>
          )}
          {product?.sustainability?.sustainableMaterials?.map((mat, i) => (
            <li key={i}>{mat}</li>
          ))}
          {product?.sustainability?.carbonFootprintKgCO2e && (
            <li>
              탄소 발자국: {product.sustainability.carbonFootprintKgCO2e} kg
              CO₂e
            </li>
          )}
        </ul>
      ),
    },
    {
      title: "케어 방법",
      content: (
        <ul>
          {product?.care?.instructions?.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
          {product?.care?.tips?.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "배송 & 반품",
      content: (
        <ul>
          {product?.shippingReturn?.description && (
            <li>{product.shippingReturn.description}</li>
          )}
          {product?.shippingReturn?.memberPolicy && (
            <li>회원: {product.shippingReturn.memberPolicy}</li>
          )}
          {product?.shippingReturn?.nonMemberPolicy && (
            <li>비회원: {product.shippingReturn.nonMemberPolicy}</li>
          )}
          {product?.shippingReturn?.returnPolicy && (
            <li>반품: {product.shippingReturn.returnPolicy}</li>
          )}
          {product?.shippingReturn?.exchangePolicy && (
            <li>교환: {product.shippingReturn.exchangePolicy}</li>
          )}
        </ul>
      ),
    },
  ];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container>
      {items.map((item, index) => (
        <AccordionItem key={index}>
          <AccordionHeader onClick={() => toggleItem(index)}>
            {item.title}
            <AccordionIcon $open={openIndex === index} />
          </AccordionHeader>
          <AccordionContent $open={openIndex === index}>
            <ContentInner>{item.content}</ContentInner>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Container>
  );
};

export default Accordion;
