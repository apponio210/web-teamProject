import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCart } from "../../context/useCart";

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const [animateOn, setAnimateOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { totalCount, openCart } = useCart();

  const openMega = () => {
    setMegaOpen(true);
  };

  const closeMega = () => {
    setMegaOpen(false);
    setAnimateOn(false);
  };

  useEffect(() => {
    const sync = () => {
      const u = localStorage.getItem("user");
      setIsLoggedIn(!!u);
    };

    sync();

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const accountHref = isLoggedIn ? "/mypage" : "/login";

  const handleCartClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      openCart();
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const onScroll = () => setHideTop(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headerH = hideTop ? MAIN_H : TOP_H + MAIN_H;
    document.documentElement.style.setProperty("--header-h", `${headerH}px`);
  }, [hideTop]);

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
      <TopBar $hide={hideTop}>
        <TopBarInner $hide={hideTop}>
          세상에서 가장 편한 신발, 올버즈
        </TopBarInner>
      </TopBar>

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
            <IconBtn aria-label="search" title="검색">
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

            <IconBtn aria-label="account" href={accountHref} title="계정">
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

            <CartIconBtn
              aria-label="cart"
              onClick={handleCartClick}
              title="장바구니"
            >
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
              {totalCount > 0 && <CartBadge>{totalCount}</CartBadge>}
            </CartIconBtn>
          </Right>
        </MainInner>
      </MainBar>

      {megaOpen && (
        <>
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

const TOP_H = 40;
const MAIN_H = 68;

const TITLE_LINE = 26;
const TITLE_GAP = 10;

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

const CartIconBtn = styled.button`
  position: relative;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #111;
  background: none;
  border: none;
  cursor: pointer;
`;

const CartBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #111;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

  > span {
    display: inline-block;
    transform: translateX(0);
    transition: transform 220ms ease;
    will-change: transform;
  }

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
