export default (hex: string) => {
  return decodeURIComponent(
    hex.replace('0x', '').replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&'), // add '%' before each 2 characters
  )
}
