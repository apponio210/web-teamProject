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

  /* 가로선 (항상 유지) */
  &::before {
    width: 100%;
    height: 1.5px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  /* 세로선 (열리면 90도 회전해서 가로선과 겹침) */
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

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      title: "상세 정보",
      content: (
        <ul>
          <li>메리노 울 블렌드 어퍼로 부드럽고 통기성이 좋습니다</li>
          <li>쿠셔닝이 뛰어난 SweetFoam® 미드솔</li>
          <li>천연 고무 아웃솔로 내구성과 그립력 확보</li>
          <li>리사이클 소재로 만든 신발끈</li>
        </ul>
      ),
    },
    {
      title: "지속 가능성",
      content: (
        <ul>
          <li>ZQ 인증 메리노 울 사용</li>
          <li>사탕수수 기반 SweetFoam® 기술</li>
          <li>탄소 발자국 저감을 위한 지속적인 노력</li>
        </ul>
      ),
    },
    {
      title: "케어 방법",
      content: (
        <ul>
          <li>세탁기 사용 가능 (찬물, 약한 세탁)</li>
          <li>울 전용 세제 사용 권장</li>
          <li>자연 건조 (직사광선 피하기)</li>
        </ul>
      ),
    },
    {
      title: "배송 & 반품",
      content: (
        <ul>
          <li>무료 배송 (3-5 영업일 소요)</li>
          <li>30일 이내 무료 반품 가능</li>
          <li>미착용 상품에 한해 전액 환불</li>
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
