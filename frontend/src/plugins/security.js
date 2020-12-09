const ADMIN = "Super Administrador";
const GESTOR = "Gestor";

export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token && `Bearer ${token}`;
}

export function isAdmin() {
  const userRole = JSON.parse(localStorage.getItem("user")).role;
  return userRole === ADMIN || userRole === GESTOR;
}

export function getUser() {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.clear();
  window.location.assign("/");
}
