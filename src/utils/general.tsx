export function isValidAddress(address: string) {
  try {
    const isAddress = address.length > 31 && address.length < 45;
    return isAddress;
  } catch (error) {
    return false;
  }
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
