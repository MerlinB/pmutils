const crypto = require("crypto")

const maxShares = 2 ** 7
const maxLiquidity = 2 ** 2
const scalingFactor = 2 ** 35

function lmsr(liquidity, sharesPro, sharesContra) {
  return liquidity * Math.log(Math.exp(sharesPro / liquidity) + Math.exp(sharesContra / liquidity))
}

function sha256(x) {
  return crypto.createHash("sha256").update(x).digest("hex")
}

function hex(num, byteSize) {
  return ("0".repeat(byteSize * 4) + num.toString(16).toUpperCase()).slice(-byteSize * 2)
}

function reverse(s) {
  const array = []
  for (let i = 0; i <= s.length - 2; i++) {
    if (i % 2 === 0) array.push(s.substring(i, i + 2))
  }
  return array.reverse().join("")
}

function getLMSRSHAs() {
  let array = []
  let i = 0
  for (let l = 1; l <= maxLiquidity; l++) {
    for (let n = 0; n <= maxShares; n++) {
      for (let m = 0; m <= maxShares; m++) {
        array[i] = sha256(Buffer.from(getLMSRHex(l, n, m)), "hex")
        i++
      }
    }
  }
  return array
}

function getLMSRHex(l, n, m) {
  return hex(l, 1) + hex(n, 1) + hex(m, 1) + hex(Math.round(lmsr(l, n, m) * scalingFactor), 6)
}

function reduce(array) {
  let reduced = []
  for (let i = 0; i <= array.length - 2; i++) {
    if (i % 2 === 0) {
      const hashString = array.slice(i, i + 2).join("")
      const newHash = sha256(Buffer.from(hashString, "hex"))
      reduced.push(newHash)
    }
  }
  if (array.length % 2 == 1) reduced.push(sha256(Buffer.from(array[array.length - 1] + "00".repeat(32), "hex")))
  return reduced
}

function getMerkleRoot(hashes) {
  let array = hashes
  while (array.length > 1) {
    array = reduce(array)
  }

  return array[0]
}

function getPos(l, n, m) {
  return (l - 1) * (maxShares + 1) ** 2 + n * (maxShares + 1) + m
}

function getMerklePath(pos, hashes) {
  const left = pos % 2 === 0 ? true : false
  let neighbor = left ? hashes[pos + 1] : hashes[pos - 1]
  neighbor = neighbor || "00".repeat(32)
  const path = left ? neighbor + "01" : neighbor + "00"
  // console.log(hashes.length, pos, left, left ? `(${hashes[pos]}) + ${neighbor}` : `${neighbor} + (${hashes[pos]})`)
  if (hashes.length <= 2) return path
  return path + getMerklePath(Math.floor(pos / 2), reduce(hashes))
}

function calculateMerkleRoot(leaf, path) {
  const merklePathLength = path.length / 66
  let i = 0
  let merkleValue = leaf
  while (i < merklePathLength) {
    left = parseInt(path.substring(i * 66 + 64, i * 66 + 66))
    const neighbor = path.substring(i * 66, i * 66 + 64)
    const merged = left ? merkleValue + neighbor : neighbor + merkleValue
    // console.log(merged.substring(0, 64) + " + " + merged.substring(64, 128))
    merkleValue = sha256(Buffer.from(merged, "hex"))
    // console.log("= " + merkleValue)
    i++
  }
  return merkleValue
}

const hashes = getLMSRSHAs()
const merkleRoot = getMerkleRoot(hashes)
const leafPos = getPos(1, 2, 3)
const path = getMerklePath(leafPos, hashes)

console.log(merkleRoot)
console.log(getLMSRHex(1, 2, 3))
console.log(hashes[leafPos])
console.log(path)

// const arr = [sha256("1"), sha256("2"), sha256("3"), sha256("4"), sha256("5")]
// console.log(sha256("5"))
// console.log(getMerkleRoot(arr))
// const path = getMerklePath(4, arr)
// console.log(path)
// const root = calculateMerkleRoot(sha256("5"), path)
// console.log(root)
