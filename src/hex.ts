export function reverseHex(s: string): string {
  const array = []
  for (let i = 0; i <= s.length - 2; i++) {
    if (i % 2 === 0) array.push(s.substring(i, i + 2))
  }
  return array.reverse().join("")
}

export function num2bin(num: number | bigint, byteSize?: number): string {
  let hex = num.toString(16)

  if (byteSize) {
    hex = ("0".repeat(byteSize * 4) + hex).slice(-byteSize * 2)
  }

  return reverseHex(hex)
}
