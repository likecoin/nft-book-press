declare module 'ipfs-only-hash' {
  export function of(data: ArrayBuffer | Buffer | Blob | string, options?: { cidVersion?: 0 | 1, rawLeaves?: boolean }): Promise<string>;
}