// src/pages/MainPage.jsx
import React from "react";
import styled from "styled-components";
import Hero from "../components/Home/Hero";
import PopularSlider from "../components/Home/PopularSlider";
import Recommendation from "../components/Home/Recomendation";
import Material from "../components/Home/Materail";
import Subscribe from "../components/Home/Subscribe";
import Extra from "../components/Home/Extra";

export default function MainPage() {
  return (
    <>
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
    </>
  );
}

const Section = styled.section`
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px 10px;
`;
