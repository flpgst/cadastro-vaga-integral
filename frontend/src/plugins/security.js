export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token && `Bearer ${token}`;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.clear();
  window.location.reload();
}
