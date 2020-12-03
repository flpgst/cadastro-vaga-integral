export function createProtocol(id) {
  const protocol =
    new Date().getFullYear() + '100' + String(id).padStart(4, '0');
  return protocol;
}
