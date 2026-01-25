import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "~/components/Header";
import { fetchHeaderInfo } from "~/api/auth.api";
import type { HeaderUserDto } from "~/api/auth.api";

export default function Layout() {
  const [user, setUser] = useState<HeaderUserDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHeaderInfo = async () => {
      try {
        const data = await fetchHeaderInfo();
        setUser(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
      }
    };

    loadHeaderInfo();
  }, [navigate]);

  return (
    <>
      <Header isLoggedIn={true} user={user} />
      <div className="pt-24 flex h-screen">
        <Outlet />
      </div>
    </>
  );
}
