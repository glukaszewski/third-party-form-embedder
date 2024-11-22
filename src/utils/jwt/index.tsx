
export const convertToMilliseconds = (expiry: string) => {
    const expiryValue = parseInt(expiry.substring(0, expiry.length - 1))
    const expiryUnit = expiry.substring(expiry.length - 1)
    let expiryInMilliseconds = 0;
    switch (expiryUnit) {
      case "y":
        expiryInMilliseconds = expiryValue * 365 * 24 * 60 * 60 * 1000
        break;
      case "w":
        expiryInMilliseconds = expiryValue * 7 * 24 * 60 * 60 * 1000
        break;
      case "d":
        expiryInMilliseconds = expiryValue * 24 * 60 * 60 * 1000
        break;
      case "h":
        expiryInMilliseconds = expiryValue * 60 * 60 * 1000
        break;
      case "m":
        expiryInMilliseconds = expiryValue * 60 * 1000
        break;
      case "s":
        expiryInMilliseconds = expiryValue * 1000
        break;
      default:
        expiryInMilliseconds = expiryValue
        break;
    }
    return expiryInMilliseconds
}
