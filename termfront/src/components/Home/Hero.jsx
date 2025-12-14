import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  // ✅ public 폴더에 이미지 넣었다고 가정: /slide1.jpg, /slide2.jpg, /slide3.jpg
  const slides = [
    {
      src: "/slide1.webp",
      title: "홀리데이 컬렉션",
      desc: "소중한 사람에게 전하는 마음",
    },
    { src: "/slide2.jpg", title: "윈터 에센셜", desc: "따뜻하고 가볍게" },
    { src: "/slide3.jpg", title: "베스트 셀러", desc: "매일 신는 편안함" },
  ];

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = (nextIdx) => {
    const last = slides.length - 1;
    if (nextIdx < 0) setIndex(last);
    else if (nextIdx > last) setIndex(0);
    else setIndex(nextIdx);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      // ✅ 최신 index 보장
      setIndex((prevIdx) => (prevIdx + 1) % slides.length);
    }, 2000); // 2초마다 (원하면 변경)
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrap onMouseEnter={stopAuto} onMouseLeave={startAuto}>
      <Track style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <Slide key={i}>
            <Bg src={s.src} alt={`slide-${i + 1}`} />
            <Overlay />
            <TextBox>
              <Title>{s.title}</Title>
              <Desc>{s.desc}</Desc>
              <BtnRow>
                <GhostBtn onClick={() => navigate("/menshoes")}>남성</GhostBtn>
                <GhostBtn>여성</GhostBtn>
              </BtnRow>
            </TextBox>
          </Slide>
        ))}
      </Track>

      <ArrowLeft onClick={prev} aria-label="prev">
        ‹
      </ArrowLeft>
      <ArrowRight onClick={next} aria-label="next">
        ›
      </ArrowRight>

      <Dots>
        {slides.map((_, i) => (
          <Dot
            key={i}
            $active={i === index}
            onClick={() => goTo(i)}
            aria-label={`go ${i + 1}`}
          />
        ))}
      </Dots>
    </Wrap>
  );
}

/* ===== styles ===== */

const Wrap = styled.section`
  width: 100%;
  height: 800px;
  position: relative;
  overflow: hidden;
  background: #000;
`;

const Track = styled.div`
  height: 100%;
  display: flex;
  transition: transform 520ms ease;
  will-change: transform;
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  position: relative;
`;

const Bg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.05) 55%,
    rgba(0, 0, 0, 0.35) 100%
  );
`;

const TextBox = styled.div`
  position: absolute;
  right: 130px;
  top: 80%;
  transform: translateY(-50%);
  color: #fff;
  text-align: right;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.5px;
`;

const Desc = styled.div`
  margin-top: 10px;
  font-size: 18px;
  opacity: 0.9;
`;

const BtnRow = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: right;
  gap: 12px;
`;

const GhostBtn = styled.button`
  height: 42px;
  padding: 0 30px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  cursor: pointer;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 34px;
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.35);
  }
`;

const ArrowLeft = styled(Arrow)`
  left: 24px;
`;

const ArrowRight = styled(Arrow)`
  right: 24px;
`;

const Dots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const Dot = styled.button`
  width: ${(p) => (p.$active ? "22px" : "8px")};
  height: 8px;
  border-radius: 999px;
  border: 0;
  background: ${(p) =>
    p.$active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)"};
  cursor: pointer;
  transition: width 200ms ease, background 200ms ease;
`;
