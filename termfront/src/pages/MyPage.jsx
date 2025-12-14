import React from "react";
import MyPageBanner from "../components/MyPage/MyPageBanner";
import MyPageLayout from "../components/MyPage/MyPageLayout";
import Extra from "../components/Home/Extra";

export default function MyPage() {
  return (
    <>
      <MyPageBanner />
      <MyPageLayout />
      <Extra />
    </>
  );
}
