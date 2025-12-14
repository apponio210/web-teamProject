// src/components/Header/Header.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);

  // ✅ MegaMenu 열릴 때 컬럼 글자 애니메이션(왼→오 순서)
  const [animateOn, setAnimateOn] = useState(false);

  const openMega = () => {
    setMegaOpen(true);
  };

  const closeMega = () => {
    setMegaOpen(false);
    setAnimateOn(false);
  };

  // ✅ 스크롤 시 TopBar 숨기기
  useEffect(() => {
    const onScroll = () => setHideTop(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ 헤더 높이를 CSS 변수로 내려줘서 main padding-top 맞추기
  useEffect(() => {
    const headerH = hideTop ? MAIN_H : TOP_H + MAIN_H;
    document.documentElement.style.setProperty("--header-h", `${headerH}px`);
  }, [hideTop]);

  // ✅ 패널이 열릴 때 컬럼만 애니메이션 시작(transition 트리거)
  useEffect(() => {
    if (!megaOpen) return;

    setAnimateOn(false);

    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAnimateOn(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [megaOpen]);

  return (
    <HeaderWrap>
      {/* Top announcement bar */}
      <TopBar $hide={hideTop}>
        <TopBarInner $hide={hideTop}>
          세상에서 가장 편한 신발, 올버즈
        </TopBarInner>
      </TopBar>

      {/* Main header */}
      <MainBar>
        <MainInner>
          <Left>
            <Logo href="/">
              <LogoImg src="/logo.jpg" alt="logo" />
            </Logo>
          </Left>

          <Center>
            <Nav>
              <NavItem>
                <NavLink href="/blackfriday">슈퍼 블랙프라이데이</NavLink>
              </NavItem>

              <NavItem>
                <NavLink href="/stores">매장 위치</NavLink>
              </NavItem>

              <NavItem onMouseEnter={openMega}>
                <NavLinkStrong href="/sustainability">
                  지속 가능성
                </NavLinkStrong>
              </NavItem>
            </Nav>
          </Center>

          <Right>
            <IconBtn aria-label="search" href="/search" title="검색">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </IconBtn>

            <IconBtn aria-label="account" href="/login" title="계정">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M4.5 21a7.5 7.5 0 0 1 15 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </IconBtn>

            <IconBtn aria-label="cart" href="/cart" title="장바구니">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M6 7h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5.5 4H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  fill="currentColor"
                />
              </svg>
            </IconBtn>
          </Right>
        </MainInner>
      </MainBar>

      {/* Mega Menu */}
      {megaOpen && (
        <>
          {/* 바깥으로 나가면 즉시 닫힘 */}
          <Backdrop $hideTop={hideTop} onMouseEnter={closeMega} />

          <MegaMenu $hideTop={hideTop} onMouseLeave={closeMega}>
            <MegaInner>
              <MegaGrid>
                <MegaCol $i={0} $open={animateOn}>
                  <MegaTitle>
                    <span>올버즈</span>
                  </MegaTitle>
                  <MegaList>
                    <MegaLink href="/about/brand-story">브랜드 스토리</MegaLink>
                    <MegaLink href="/sustainability">지속 가능성</MegaLink>
                    <MegaLink href="/about/intro">소개</MegaLink>
                    <MegaLink href="/about/mission">수선</MegaLink>
                  </MegaList>
                </MegaCol>

                <MegaCol $i={1} $open={animateOn}>
                  <MegaTitle>
                    <span>스토리</span>
                  </MegaTitle>
                  <MegaList>
                    <MegaLink href="/story/allbirds-lab">올맴버스</MegaLink>
                    <MegaLink href="/story/ambassador">
                      올버즈 앰배서더
                    </MegaLink>
                    <MegaLink href="/story/rerun">ReRun</MegaLink>
                    <MegaLink href="/story/care">신발 관리 방법</MegaLink>
                  </MegaList>
                </MegaCol>

                <MegaCol $i={2} $open={animateOn}>
                  <MegaTitle>
                    <span>소식</span>
                  </MegaTitle>
                  <MegaList>
                    <MegaLink href="/news/campaign">캠페인</MegaLink>
                    <MegaLink href="/news">뉴스</MegaLink>
                  </MegaList>
                </MegaCol>
              </MegaGrid>
            </MegaInner>
          </MegaMenu>
        </>
      )}
    </HeaderWrap>
  );
}

/* ===== constants ===== */
const TOP_H = 40;
const MAIN_H = 68;

/* ✅ MegaTitle hover 작대기/밀림 세팅 */
const TITLE_LINE = 26; // 작대기 길이
const TITLE_GAP = 10; // 작대기와 텍스트 사이 간격

/* ===== styles ===== */
const HeaderWrap = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const TopBar = styled.div`
  height: ${(p) => (p.$hide ? "0px" : `${TOP_H}px`)};
  background: #111;
  color: #fff;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: height 180ms ease;
`;

const TopBarInner = styled.div`
  width: 100%;
  text-align: center;
  font-size: 11.5px;
  opacity: ${(p) => (p.$hide ? 0 : 1)};
  transition: opacity 120ms ease;
`;

const MainBar = styled.div`
  height: ${MAIN_H}px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
`;

const MainInner = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 80px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Logo = styled.a`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImg = styled.img`
  width: 120px;
  height: 40px;
  display: block;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled.a`
  font-size: 16px;
  color: #111;
  text-decoration: none;
  padding: 10px 2px;

  &:hover {
    text-underline-offset: 6px;
  }
`;

const NavLinkStrong = styled(NavLink)``;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
`;

const IconBtn = styled.a`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #111;
  text-decoration: none;
`;

/* ===== Mega Menu ===== */

const Backdrop = styled.div`
  position: fixed;
  top: ${(p) => (p.$hideTop ? `${MAIN_H}px` : `${TOP_H + MAIN_H}px`)};
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 90;
`;

const MegaMenu = styled.div`
  position: fixed;
  top: ${(p) => (p.$hideTop ? `${MAIN_H}px` : `${TOP_H + MAIN_H}px`)};
  left: 0;
  right: 0;
  background: #fff;
  z-index: 101;
  border-bottom: 1px solid #eee;
  padding: 46px 0 60px 0;
`;

const MegaInner = styled.div`
  max-width: 1200px;
  padding: 10px 80px;
`;

const MegaGrid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  gap: 140px;
  justify-content: start;
  align-items: start;
`;

const MegaCol = styled.div`
  /* 컬럼 등장 애니메이션 */
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transform: translateX(${(p) => (p.$open ? "0px" : "-18px")});
  transition: opacity 260ms ease, transform 260ms ease;
  transition-delay: ${(p) => (p.$i ?? 0) * 90}ms;
  will-change: opacity, transform;
`;

const MegaTitle = styled.div`
  position: relative;
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 18px;
  line-height: 1.2;

  /* 텍스트(기본 위치는 그대로) */
  > span {
    display: inline-block;
    transform: translateX(0);
    transition: transform 220ms ease;
    will-change: transform;
  }

  /* 왼쪽 가로 작대기 (hover 시 자라남) */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: ${TITLE_LINE}px;
    height: 2px;
    background: #111;

    transform: translateY(-50%) scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
    will-change: transform;
  }

  /* ✅ hover 시: 작대기 등장 + 텍스트 밀림 */
  &:hover::before {
    transform: translateY(-50%) scaleX(1);
  }

  &:hover > span {
    transform: translateX(${TITLE_LINE + TITLE_GAP}px);
  }
`;

const MegaList = styled.div`
  border-left: 1px solid #111;
  padding-left: 18px;
  display: grid;
  gap: 12px;
`;

const MegaLink = styled.a`
  font-size: 16px;
  color: #111;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
`;
