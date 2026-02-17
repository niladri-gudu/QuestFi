export const ADMIN_WALLET =
  "0x8B3A3cEE208Be2E631950715273ef5bB541ae082".toLowerCase();

export function isAdmin(address?: string) {
  if (!address) return false;
  return address.toLowerCase() === ADMIN_WALLET;
}
