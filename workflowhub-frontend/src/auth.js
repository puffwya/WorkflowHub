import { jwtDecode } from "jwt-decode";

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getUserRole = () => {
  const user = getUser();

  return (
    user?.role ||
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null
  );
};
