import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "~/components/Header";
import { fetchHeaderInfo } from "~/api/auth.api";
import type { HeaderUserDto } from "~/api/auth.api";

export default function Layout() {
  const [user, setUser] = useState<HeaderUserDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clearAuth = () => {
      if (typeof window === "undefined") return;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    };

    const loadHeaderInfo = async () => {
      try {
        const data = await fetchHeaderInfo();
        setUser(data);
      } catch (err: any) {
        console.error(err);
        clearAuth();
        navigate("/login");
      }
    };

    loadHeaderInfo();
  }, [navigate]);

  return (
    <>
      <Header isLoggedIn={!!user} user={user} />
      <div className="pt-24 flex h-screen">
        <Outlet />
      </div>
    </>
  );
}
