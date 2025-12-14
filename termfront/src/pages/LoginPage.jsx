import React from "react";
import styled from "styled-components";
import Extra from "../components/Home/Extra";

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 나중에 API 붙일 자리
  };

  return (
    <Wrap>
      <Inner>
        <Title>로그인</Title>

        <Form onSubmit={handleSubmit}>
          <Input type="email" placeholder="이메일 주소" autoComplete="email" />
          <Input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
          />

          <HelpRow>
            <HelpLink href="#">비밀번호를 잊으셨나요?</HelpLink>
          </HelpRow>

          <LoginButton type="submit">로그인</LoginButton>

          <KakaoButton type="button">
            <KakaoIcon aria-hidden="true">●</KakaoIcon>
            카카오 회원가입 및 로그인
          </KakaoButton>
        </Form>

        <Spacer />

        <SectionTitle>계정이 없으신가요?</SectionTitle>
        <SectionDesc>
          월별 1만원 할인 쿠폰 포함한 특별한 멤버십 혜택을 누려보세요.
          <br />
          * 이메일에 마케팅 수신 동의 필수
          <br />* 쿠폰은 발급 후 30일까지 유효
        </SectionDesc>

        <SignupButton type="button">회원가입 하기</SignupButton>
      </Inner>

      <Section>
        <Extra />
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 16px 20px;
  gap: 140px;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 360px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight: 700;
  margin: 0 0 22px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  height: 50px;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const HelpRow = styled.div`
  text-align: left;
  margin-top: -2px;
`;

const HelpLink = styled.a`
  font-size: 12px;
  color: #777;
  text-decoration: none;

  &:hover {
    color: #555;
  }
`;

const LoginButton = styled.button`
  height: 55px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #000;
    border-color: #000;
  }
`;

const KakaoButton = styled.button`
  height: 55px;
  border: 1px solid #f7e317;
  background: #f7e317;
  color: #111;
  cursor: pointer;
  font-weight: 500;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const KakaoIcon = styled.span`
  font-size: 12px;
  line-height: 1;
  transform: translateY(-1px);
`;

const Spacer = styled.div`
  height: 42px;
`;

const SectionTitle = styled.h2`
  font-size: 25px;
  font-weight: 700;
  margin: 0 0 10px;
`;

const SectionDesc = styled.p`
  font-size: 14px;
  color: #777;
  line-height: 1.6;
  margin: 0 0 30px;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 55px;
  border: 1px solid #bbb;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font-weight: 400;
`;

const Section = styled.section`
  max-width: 1360px;
  margin: 0 auto;
  padding: 10px 10px;
`;
