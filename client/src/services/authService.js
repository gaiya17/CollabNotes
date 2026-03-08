import api from "./api";

export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};