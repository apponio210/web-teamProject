import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../api/auth";

export default function RequireAdminAuth({ children }) {
  const [ok, setOk] = useState(null); // null=로딩, true/false

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const me = await fetchMe(); // ✅ 세션 확인
        // role 체크(너희 값에 맞게)
        if (me?.role === "ADMIN") {
          localStorage.setItem("adminUser", JSON.stringify(me));
          if (alive) setOk(true);
        } else {
          if (alive) setOk(false);
        }
      } catch (e) {
        console.error("admin auth failed", e);
        if (alive) setOk(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (ok === null) return null; // 또는 로딩 UI
  if (!ok) return <Navigate to="/" replace />;
  return children;
}
