export const bigIntToU8Array = (n: bigint) => {
    let hex = BigInt(n).toString(16);
    // Fix invalid hex strings
    if (hex.length % 2) { hex = '0' + hex; }

    // The byteLength will be half of the hex string length
    const len = hex.length / 2;
    const u8 = new Uint8Array(len);

    // Iterate each element by one and each hex segment by two
    let i = 0;
    let j = 0;
    while (i < len) {
      u8[i] = parseInt(hex.slice(j, j+2), 16);
      i += 1;
      j += 2;
    }
    return u8;
}
