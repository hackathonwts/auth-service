type GenerateOptions = {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
};
declare const normalizeFilename: (str: string) => string;
declare const safeAsync: <T>(promise: Promise<T>) => Promise<[Error | null, T | null]>;
declare const isNumber: (value: any) => boolean;
declare const sleep: (ms: number) => Promise<void>;
declare const capitalizeFirstLetter: (str: string) => string;
declare const throttle: (func: (...args: any) => void, limit: number) => (...args: any[]) => void;
declare const debounce: (func: (...args: any) => void, delay: number) => (...args: any[]) => void;
declare const safeJsonParse: (jsonString: string) => any | null;
declare const generateSlug: (text: string) => string;
declare const synchronizeNameFields: (update: Partial<{
    fullName?: string;
    firstName?: string;
    lastName?: string;
}>) => {
    fullName?: string;
    firstName?: string;
    lastName?: string;
};
declare const generatePassword: (length?: number, options?: GenerateOptions) => string;
declare const generateOtp: (length?: number) => string;
declare const encryptText: (text: string, secretKey: string) => string;
declare const decryptText: (encryptedText: string, secretKey: string) => string;
declare const encryptCipherToken: (data: object) => string;
declare const decryptCipherToken: (token: string) => any;
export { normalizeFilename, safeAsync, isNumber, sleep, capitalizeFirstLetter, throttle, debounce, safeJsonParse, generateSlug, encryptText, decryptText, synchronizeNameFields, generatePassword, generateOtp, encryptCipherToken, decryptCipherToken, };
