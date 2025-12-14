// src/pages/MainPage.jsx
import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Home/Hero";
import PopularSlider from "../components/Home/PopularSlider";
import Footer from "../components/Footer/Footer";
import styled from "styled-components";
import Recommendation from "../components/Home/Recomendation";
import Material from "../components/Home/Materail";
import Subscribe from "../components/Home/Subscribe";
import Extra from "../components/Home/Extra";

export default function MainPage() {
  return (
    <Page>
      <Header />
      <Main>
        <Hero />
        <Section>
          <PopularSlider />
        </Section>

        <Section>
          <Recommendation />
        </Section>

        <Section>
          <Material />
        </Section>

        <Section>
          <Subscribe />
        </Section>

        <Section>
          <Extra />
        </Section>
      </Main>
      <Footer />
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f3f3f3; /* ✅ 2번 이미지 핵심 */
  color: #111;
`;

const Main = styled.main`
  padding-top: 108px; /* 헤더 높이만큼 */
`;

const Section = styled.section`
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px 10px;
`;
