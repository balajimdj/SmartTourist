const STORAGE_KEY = 'safetrek_demo_chain'

const digest = async (value) => {
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Open this app on localhost or HTTPS.')
  const bytes = new TextEncoder().encode(value)
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const readChain = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (error) {
    console.error('Unable to read the demonstration chain', error)
    return []
  }
}

export const addIdentityBlock = async (tourist) => {
  const chain = readChain()
  const data = {
    touristId: tourist.id,
    name: tourist.name,
    email: tourist.email,
    createdAt: tourist.createdAt,
  }
  const previousHash = chain.at(-1)?.hash || 'GENESIS'
  const timestamp = new Date().toISOString()
  const hash = await digest(JSON.stringify({ index: chain.length, timestamp, data, previousHash }))
  const block = { index: chain.length, timestamp, data, previousHash, hash }
  chain.push(block)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chain))
  return block
}

export const verifyIdentity = async (touristId) => {
  const chain = readChain()
  let foundIndex = -1
  chain.forEach((block, index) => {
    if (block.data.touristId === touristId) foundIndex = index
  })
  if (foundIndex < 0) return { found: false, valid: false, block: null }

  let valid = true
  for (let index = 0; index <= foundIndex; index += 1) {
    const block = chain[index]
    const expectedPrevious = index > 0 ? chain[index - 1].hash : 'GENESIS'
    const expectedHash = await digest(JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
    }))
    if (block.index !== index || block.previousHash !== expectedPrevious || block.hash !== expectedHash) {
      valid = false
      break
    }
  }
  return { found: true, valid, block: chain[foundIndex] }
}
