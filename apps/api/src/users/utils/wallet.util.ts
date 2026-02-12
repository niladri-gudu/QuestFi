export function normalizeWallet(wallet: string): string {
  return wallet.toLowerCase();
}

export function isValidWallet(wallet: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(wallet);
}
