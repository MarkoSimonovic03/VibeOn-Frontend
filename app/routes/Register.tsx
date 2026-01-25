import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButton from "../components/auth_button";
import AuthInput from "../components/auth_text_input";
import FileInput from "../components/auth_file_input";
import GenderInput from "../components/auth_gender_input";
import { registerUser } from "~/api/auth.api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatDateToYYYYMMDD = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({username,name,lastName: lastname,email,password,birthDate: formatDateToYYYYMMDD(birthdate),gender: gender === "1",},profilePicture);

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    }
  };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-300 rounded-xl px-16 p-8 shadow-2xl">
        <AuthInput onChange={setUsername} placeholder="Username" type="text" />
        <AuthInput onChange={setPassword} placeholder="Password" type="password" />
        <AuthInput onChange={setName} placeholder="Name" type="text" />
        <AuthInput onChange={setLastname} placeholder="Lastname" type="text" />
        <AuthInput onChange={setEmail} placeholder="Email" type="text" />
        <AuthInput onChange={setBirthdate} placeholder="Birthdate" type="date" />

        <GenderInput onChange={setGender} />
        <FileInput onChange={setProfilePicture} />

        {error && (<p className="text-red-500 text-sm mb-4 text-center"> {error} </p>)}

        <AuthButton label="Register" />
      </form>
  );
}
