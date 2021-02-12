const ADMIN = "Super Administrador";
const GESTOR = "Gestor";

export function getAuthToken(api) {
  const token = localStorage.getItem(`token-${api}`);
  return token && `Bearer ${token}`;
}

export function isAdmin() {
  const userRole = JSON.parse(localStorage.getItem("user")).role;
  return userRole === ADMIN;
}

export function isGestor() {
  const userRole = JSON.parse(localStorage.getItem("user")).role;
  return userRole === GESTOR;
}

export function getUser() {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token-vaga-integral");
}

export function logout() {
  localStorage.clear();
  window.location.assign("/");
}
