import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function AdminHeader() {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    } finally {
      localStorage.removeItem("adminUser");
      navigate("/", { replace: true });
    }
  };

  return (
    <Bar>
      <Brand>Allbirds_wp-Admin</Brand>
      <Right>
        <LogoutBtn onClick={onLogout}>로그아웃</LogoutBtn>
      </Right>
    </Bar>
  );
}

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;

  height: 56px;
  background: #111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
`;

const Brand = styled.div`
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoutBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #fff;
    color: #111;
  }
`;
