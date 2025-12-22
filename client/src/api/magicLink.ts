const API_URL = import.meta.env.VITE_API_URL;

export const requestMagicLink = async (email: string) => {
  const response = await fetch(`${API_URL}/magic-link/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to send magic link");
  }

  return response.json();
};

export const verifyMagicLink = async (token: string) => {
  const response = await fetch(`${API_URL}/magic-link/verify?token=${token}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to verify magic link");
  }

  return response.json();
};
