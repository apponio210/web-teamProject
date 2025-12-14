import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function AdminSidebar() {
  return (
    <Aside>
      <Nav>
        <Item to="/products">상품관리</Item>
        <Item to="/sales">판매현황</Item>
      </Nav>
    </Aside>
  );
}

const Aside = styled.aside`
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
  background: #fff;
  border-right: 1px solid #eee;
  padding: 18px 14px;
`;

const Nav = styled.nav`
  display: grid;
  gap: 8px;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #222;
  font-weight: 700;

  &.active {
    background: #111;
    color: #fff;
  }

  &:hover {
    background: #f2f2f2;
  }
  &.active:hover {
    background: #111;
  }
`;
