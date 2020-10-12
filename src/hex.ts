export function reverseHex(s: string): string {
  const array = []
  for (let i = 0; i <= s.length - 2; i++) {
    if (i % 2 === 0) array.push(s.substring(i, i + 2))
  }
  return array.reverse().join("")
}

export function num2bin(num: number, byteSize: number = 1): string {
  return ("0".repeat(byteSize * 4) + num.toString(16).toUpperCase()).slice(-byteSize * 2)
}
