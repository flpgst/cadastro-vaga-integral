export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token && `Bearer ${token}`;
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
  window.location.reload();
}
