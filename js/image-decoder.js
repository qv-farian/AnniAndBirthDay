/* --------------------------------------------------------------------------
   IMAGE DECODER MODULE
   Sole responsibility: decode an encrypted Base64 string → ObjectURL.
   Does NOT cache — caching is the responsibility of ImageProvider.
   -------------------------------------------------------------------------- */

const ImageDecoder = (function () {
  'use strict';

  /**
   * Decodes an encrypted Base64 image string into a usable ObjectURL.
   *
   * Pipeline:
   *   Base64 String
   *     → AppCrypto.decryptBytes() → raw ArrayBuffer
   *     → Blob (auto-detected MIME)
   *     → URL.createObjectURL()
   *     → return ObjectURL string
   *
   * @param {string} encodedString — Base64(IV + Ciphertext)
   * @returns {Promise<string>} — ObjectURL (blob:...)
   */
  async function decode(encodedString) {
    // 1. Base64 → decrypt via AppCrypto
    const plainBuffer = await AppCrypto.decryptBytes(encodedString);

    // 2. Sniff magic bytes for accurate image MIME type
    const bytes = new Uint8Array(plainBuffer);
    let mime = 'image/webp';
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      mime = 'image/png';
    } else if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
      mime = 'image/jpeg';
    } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      mime = 'image/webp';
    }

    // 3. ArrayBuffer → Typed Blob → ObjectURL
    const blob = new Blob([plainBuffer], { type: mime });
    return URL.createObjectURL(blob);
  }

  const api = { decode };
  if (typeof window !== 'undefined') window.ImageDecoder = api;
  return api;
})();
