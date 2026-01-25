export async function login(username: string,password: string): Promise<{ accessToken: string }> {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw {
      status: res.status,
      message: message || "Invalid username or password.",
    };
  }

  return res.json();
}


export type RegisterDto = {
  username: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: boolean;
};

export async function registerUser(registerDto: RegisterDto, image?: File | null): Promise<void> {
  const formData = new FormData();

  if (image) formData.append("image", image);

  formData.append("registerDto",new Blob([JSON.stringify(registerDto)], { type: "application/json" }));

  const res = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw { status: res.status, message: message || "Registration failed." };
  }
}


export interface HeaderUserDto {
  username: string;
  profileImageUrl: string;
}

export async function fetchHeaderInfo(): Promise<HeaderUserDto> {
  const res = await fetch("http://localhost:8080/api/auth/header-info", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw {
      status: res.status,
      message: message || "Failed to fetch header info",
    };
  }

  return res.json();
}
