import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Extra from "../components/Home/Extra";
import { login } from "../api/auth";

export default function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      const user = await login(email, password);

      // ✅ 여기서 로그인 상태 저장(간단버전)
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage")); // ✅ 같은 탭에서도 Header 갱신 트리거

      // TODO: 메인으로 이동하고 싶으면 (react-router-dom)
      nav("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <Inner>
        <Title>로그인</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일 주소"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

          <HelpRow>
            <HelpLink href="#">비밀번호를 잊으셨나요?</HelpLink>
          </HelpRow>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </LoginButton>

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

const ErrorText = styled.div`
  text-align: left;
  font-size: 12px;
  color: #d32f2f;
  margin-top: -4px;
`;

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

  &:disabled {
    opacity: 0.6;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
