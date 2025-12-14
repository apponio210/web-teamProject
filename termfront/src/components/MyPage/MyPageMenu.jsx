import React from "react";
import styled from "styled-components";

export default function MyPageMenu({ active, onChange }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  return (
    <Nav>
      <Item $active={active === "orders"} onClick={() => onChange("orders")}>
        지난 주문 내역
      </Item>

      <LogoutItem onClick={handleLogout}>로그아웃</LogoutItem>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Item = styled.button`
  background: none;
  border: none;
  padding: 0 0 6px;
  text-align: left;
  font-size: 24px;
  cursor: pointer;

  font-weight: ${(p) => (p.$active ? 700 : 400)};
  text-decoration: ${(p) => (p.$active ? "underline" : "none")};
  text-underline-offset: 2px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutItem = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 30px;
  text-align: left;
  cursor: pointer;

  font-size: 16px;
  font-weight: 400;
  color: #777;
  text-decoration: underline;
`;
