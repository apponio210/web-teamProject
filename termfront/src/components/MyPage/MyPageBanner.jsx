import React from "react";
import styled from "styled-components";

export default function MyPageBanner() {
  return (
    <Wrap>
      <Bg aria-hidden="true" />
      <Overlay aria-hidden="true" />
      <Content>
        <Title>올멤버스 (All-members)</Title>
      </Content>
    </Wrap>
  );
}

const Wrap = styled.section`
  margin-top: 68px;
  position: relative;
  width: 100%;
  height: 574px; /* 필요하면 360~520 사이로 조절 */
  overflow: hidden;
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("/mypagebanner.avif");
  background-size: cover;
  background-position: center;
  transform: scale(1.02); /* 약간 꽉 차게 */
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
`;

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 67px;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-align: center;
`;
