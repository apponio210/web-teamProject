import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <Shell>
      <AdminHeader />
      <Body>
        <AdminSidebar />
        <Main>
          <Outlet />
        </Main>
      </Body>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100vh;
  background: #f6f7f9;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
`;

const Main = styled.main`
  min-height: calc(100vh - 56px); /* header height */
  padding: 24px;
`;
