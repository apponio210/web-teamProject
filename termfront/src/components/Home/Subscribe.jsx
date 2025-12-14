// src/components/Subscribe/Subscribe.jsx
import React, { useState } from "react";
import styled from "styled-components";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  return (
    <Wrap>
      <Inner>
        <Title>올버즈 뉴스레터 구독</Title>
        <SubTitle>최신 신제품 소식과 혜택을 가장 먼저 받아보세요.</SubTitle>

        <Form>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="email"
          />
          <Btn type="submit">구독</Btn>
        </Form>

        <Notice>
          구독 시 마케팅 이메일 수신에 동의하게 됩니다. 자세한 내용은{" "}
          <NoticeLink href="#">개인정보 처리방침</NoticeLink> 및{" "}
          <NoticeLink href="#">이용약관</NoticeLink>을 확인해 주세요.
        </Notice>
      </Inner>
    </Wrap>
  );
}

/* ===== styles ===== */

const Wrap = styled.section`
  width: 100%;
  background: #f3f3f3;
`;

const Inner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 10px 18px 10px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 43px;
  font-weight: 400;
  letter-spacing: -1.2px;
  color: #444;
`;

const SubTitle = styled.p`
  margin: 18px 0 34px;
  font-size: 14px;
  color: #666;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 92px;
  gap: 12px;
  max-width: 560px;
  margin: 0 auto;
`;

const Input = styled.input`
  height: 48px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #9a9a9a;
  }

  &:focus {
    border-color: #111;
  }
`;

const Btn = styled.button`
  height: 48px;
  border: 1px solid #111;
  border-radius: 4px;
  background: #111;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #000;
    border-color: #000;
  }
`;

const Notice = styled.p`
  max-width: 560px;
  margin: 14px auto 0;
  font-size: 11px;
  color: #9a9a9a;
  line-height: 1.6;
  text-align: left;
`;

const NoticeLink = styled.a`
  color: #8a8a8a;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #111;
  }
`;
