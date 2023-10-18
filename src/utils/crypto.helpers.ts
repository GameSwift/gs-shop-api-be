import { createHash } from 'crypto';

export const encryptSHA256 = (text: string, salt: string) => {
    const hash = createHash('sha256');
    hash.update(text + salt);
    return hash.digest('hex');
};
