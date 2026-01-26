import { useState } from "react";
import AuthInput from "../components/auth_text_input";
import AuthButton from "../components/auth_button";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "~/api/auth.api";

interface LoginResponse {
  accessToken: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("username", username);

      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Invalid username or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-300 rounded-xl px-16 py-8 shadow-2xl">
      <AuthInput onChange={setUsername} placeholder="Username" type="text" />
      <AuthInput onChange={setPassword} placeholder="Password" type="password" />

      {error && (<p className="text-red-500 text-sm mb-4 text-center">{error}</p>)}
      <AuthButton label={"Login"} />
    </form>
  );
}
