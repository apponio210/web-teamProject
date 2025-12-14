import React, { useState } from "react";
import styled from "styled-components";
import MyPageMenu from "./MyPageMenu";
import MyOrderHistory from "./MyOrderHistory";

export default function MyPageLayout() {
  const [active, setActive] = useState("orders"); // ✅ 기본: 지난 주문 내역

  return (
    <Wrap>
      <Sidebar>
        <MyPageMenu active={active} onChange={setActive} />
      </Sidebar>

      <Content>
        <MyOrderHistory />
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 80px;
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 20px;
`;

const Sidebar = styled.aside``;
const Content = styled.section``;
