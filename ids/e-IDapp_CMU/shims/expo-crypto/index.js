const CryptoJS = require('crypto-js');

const CryptoDigestAlgorithm = Object.freeze({
  MD2: 'MD2',
  MD5: 'MD5',
  SHA1: 'SHA-1',
  SHA256: 'SHA-256',
  SHA384: 'SHA-384',
  SHA512: 'SHA-512',
});

const CryptoEncoding = Object.freeze({
  HEX: 'hex',
  BASE64: 'base64',
});

const digesters = {
  [CryptoDigestAlgorithm.MD5]: CryptoJS.MD5,
  [CryptoDigestAlgorithm.SHA1]: CryptoJS.SHA1,
  [CryptoDigestAlgorithm.SHA256]: CryptoJS.SHA256,
  [CryptoDigestAlgorithm.SHA384]: CryptoJS.SHA384,
  [CryptoDigestAlgorithm.SHA512]: CryptoJS.SHA512,
};

function bytesToWordArray(bytes) {
  const words = [];

  for (let i = 0; i < bytes.length; i += 1) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }

  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function wordArrayToArrayBuffer(wordArray) {
  const bytes = new Uint8Array(wordArray.sigBytes);

  for (let i = 0; i < wordArray.sigBytes; i += 1) {
    bytes[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return bytes.buffer;
}

function normalizeData(data) {
  if (typeof data === 'string') {
    return CryptoJS.enc.Utf8.parse(data);
  }

  if (data instanceof ArrayBuffer) {
    return bytesToWordArray(new Uint8Array(data));
  }

  if (ArrayBuffer.isView(data)) {
    return bytesToWordArray(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
  }

  throw new TypeError('expo-crypto shim only supports string, ArrayBuffer, and ArrayBufferView inputs');
}

function createDigest(algorithm, data) {
  const digester = digesters[algorithm];

  if (!digester) {
    throw new Error(`Unsupported digest algorithm: ${algorithm}`);
  }

  return digester(normalizeData(data));
}

async function digest(algorithm, data) {
  return wordArrayToArrayBuffer(createDigest(algorithm, data));
}

async function digestStringAsync(algorithm, data, options = {}) {
  const result = createDigest(algorithm, data);
  const encoding = options.encoding ?? CryptoEncoding.HEX;

  if (encoding === CryptoEncoding.BASE64) {
    return CryptoJS.enc.Base64.stringify(result);
  }

  return result.toString(CryptoJS.enc.Hex);
}

module.exports = {
  CryptoDigestAlgorithm,
  CryptoEncoding,
  digest,
  digestStringAsync,
};
