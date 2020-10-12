import { sha256 } from "./sha"
import { num2bin } from "./hex"

export const maxShares = 2 ** 7
export const maxLiquidity = 2 ** 2
export const scalingFactor = 2 ** 35

export function lmsr(liquidity: number, sharesPro: number, sharesContra: number): number {
  return liquidity * Math.log(Math.exp(sharesPro / liquidity) + Math.exp(sharesContra / liquidity))
}

export function getLmsrShas(): string[] {
  let array = []
  let i = 0
  for (let l = 1; l <= maxLiquidity; l++) {
    for (let n = 0; n <= maxShares; n++) {
      for (let m = 0; m <= maxShares; m++) {
        array[i] = sha256(getLmsrHex(l, n, m))
        i++
      }
    }
  }
  return array
}

export function getLmsrHex(l: number, n: number, m: number): string {
  return num2bin(l, 1) + num2bin(n, 1) + num2bin(m, 1) + num2bin(Math.round(lmsr(l, n, m) * scalingFactor), 6)
}

export function getPos(l: number, n: number, m: number): number {
  return (l - 1) * (maxShares + 1) ** 2 + n * (maxShares + 1) + m
}
