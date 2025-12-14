// src/components/Footer/Footer.jsx
import React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <Wrap>
      <Inner>
        {/* LEFT */}
        <Left>
          <BigLinks>
            <BigLink href="#">올멤버스 가입하기</BigLink>
            <BigLink href="#">오프라인 매장 찾기</BigLink>
            <BigLink href="#">카카오 채널 추가하기</BigLink>
            <BigLink href="#">올버즈 브랜드 스토리</BigLink>
          </BigLinks>

          <Follow>
            <FollowTitle>ALLBIRDS를 팔로우하세요!</FollowTitle>
            <FollowDesc>
              최신 정보나 Allbirds 상품의 스냅샷 등을
              <br />
              볼 수 있습니다. 올버즈 귀여운 영상도 보실 수 있죠.
              <br />
              #weareallbirds #올버즈
            </FollowDesc>

            <SNS>
              <SNSIcon href="#" aria-label="instagram" title="Instagram">
                {/* camera icon */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.5 6.5h.01"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </SNSIcon>

              <SNSIcon href="#" aria-label="facebook" title="Facebook">
                {/* simple f */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </SNSIcon>
            </SNS>
          </Follow>

          <BottomLeft>
            <Copyright>
              © 2025 EFG.CO All Rights Reserved.{" "}
              <FooterSmallLink href="#">이용약관</FooterSmallLink>,{" "}
              <FooterSmallLink href="#">개인정보 처리방침</FooterSmallLink>
            </Copyright>
          </BottomLeft>
        </Left>

        {/* RIGHT */}
        <Right>
          <SupportTitle>올버즈 지원</SupportTitle>
          <SupportList>
            <SupportLink href="#">교환 및 반품</SupportLink>
            <SupportLink href="#">수선</SupportLink>
            <SupportLink href="#">문의하기</SupportLink>
            <SupportLink href="#">FAQ</SupportLink>
            <SupportLink href="#">채용</SupportLink>
          </SupportList>

          <BadgeWrap>
            <BadgeTop>Certified</BadgeTop>
            <BadgeCircle>B</BadgeCircle>
            <BadgeBottom>Corporation</BadgeBottom>
            <BadgeLine />
          </BadgeWrap>

          <CompanyInfo>
            (주)이에프지 대표 박지우 | 서울특별시 강남구 강남대로 160길 45
            <br />
            통신판매업신고번호 2023-서울강남-04461 | 등록번호 146-81-03205
            <br />
            전화번호 070-4138-0128(수신자 부담) | E-mail help@efg.earth
          </CompanyInfo>
        </Right>
      </Inner>
    </Wrap>
  );
}

/* ===== styles ===== */

const Wrap = styled.footer`
  width: 100%;
  height: 799px; /* ✅ 요구사항 */
  background: #1f1f1f;
  color: #fff;
  box-sizing: border-box;
`;

/**
 * ✅ 여기서 좌/우가 너무 벌어지는 문제 해결:
 * - max-width로 내부 폭 제한
 * - grid + gap으로 간격을 직접 제어
 */
const Inner = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 110px 80px 70px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 1.2fr 0.8fr; /* ✅ 좌/우 비율 */
  gap: 120px; /* ✅ 좌/우 거리 (여기 줄이면 더 가까워짐) */

  @media (max-width: 1024px) {
    padding: 90px 40px 60px;
    gap: 70px;
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BigLinks = styled.div`
  display: grid;
  gap: 22px;
`;

const BigLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 44px;
  line-height: 1.15;
  font-weight: 400;
  letter-spacing: -0.8px;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 8px;
  }

  @media (max-width: 1024px) {
    font-size: 34px;
  }
`;

const Follow = styled.div`
  margin-top: 55px;
  max-width: 360px;
`;

const FollowTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 14px;
`;

const FollowDesc = styled.div`
  color: rgba(255, 255, 255, 0.75);
  font-size: 12.5px;
  line-height: 1.7;
`;

const SNS = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 14px;
`;

const SNSIcon = styled.a`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.15);

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const BottomLeft = styled.div`
  margin-top: 60px;
`;

const Copyright = styled.div`
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.7);
`;

const FooterSmallLink = styled.a`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

/* RIGHT */

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SupportTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.5px;
`;

const SupportList = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 12px;
`;

const SupportLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 13px;
  font-weight: 400;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const BadgeWrap = styled.div`
  margin-top: 70px;
  display: grid;
  place-items: center;
  gap: 10px;
  width: 170px;
`;

const BadgeTop = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

const BadgeCircle = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.85);
  display: grid;
  place-items: center;
  font-size: 44px;
  font-weight: 900;
`;

const BadgeBottom = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
`;

const BadgeLine = styled.div`
  width: 86px;
  height: 2px;
  background: rgba(255, 255, 255, 0.55);
`;

const CompanyInfo = styled.div`
  margin-top: 55px;
  font-size: 11px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.65);
  max-width: 420px;
`;
