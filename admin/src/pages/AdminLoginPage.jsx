import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);

      // ✅ 관리자만 통과 (role 값은 너희 응답 기준)
      if (user?.role !== "ADMIN") {
        setErrorMsg("관리자 계정만 로그인할 수 있어요.");
        return;
      }

      // (선택) admin 쪽 로컬 저장
      localStorage.setItem("adminUser", JSON.stringify(user));

      navigate("/products", { replace: true });
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          "로그인에 실패했습니다. 정보를 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Brand>
          <LogoDot />
          <BrandText>Allbirds_wp-Admin</BrandText>
        </Brand>

        <Title>관리자 로그인</Title>
        <Desc>관리자 전용 페이지입니다.</Desc>

        <Form onSubmit={onSubmit}>
          <Label>이메일</Label>
          <Input
            type="email"
            placeholder="admin@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Label>비밀번호</Label>
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </Form>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: #f3f3f3;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 14px;
  padding: 30px 28px 26px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const LogoDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #111;
`;

const BrandText = styled.div`
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Title = styled.h1`
  font-size: 22px;
  margin: 0 0 6px;
`;

const Desc = styled.p`
  margin: 0 0 18px;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: grid;
  gap: 10px;
`;

const Label = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #444;
`;

const Input = styled.input`
  height: 44px;
  border: 1px solid #e7e7e7;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const LoginButton = styled.button`
  height: 46px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  margin-top: 6px;

  &:hover {
    background: #000;
    border-color: #000;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 12px;
`;
