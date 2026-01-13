import crypto, { randomInt } from 'node:crypto';

const digits = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';
const ALGO = 'aes-256-cbc';
const SECRET = 'abcdefghijklmnopqrstuvwxyz123456'; // 32 bytes key for AES-256
const IV_LENGTH = 16;
type GenerateOptions = {
  digits?: boolean;
  lowerCaseAlphabets?: boolean;
  upperCaseAlphabets?: boolean;
  specialChars?: boolean;
};
/**
 * Normalizes a filename by replacing spaces with lodash, truncating the name to fit within a 20 character limit,
 * and appending a timestamp to ensure uniqueness.
 *
 * @param {string} str - The original filename.
 * @returns {string} The normalized filename.
 * @throws {Error} If the file extension cannot be determined.
 */
const normalizeFilename = (str: string): string => {
  const originalName = str.replaceAll(/\s/g, '_');
  const extension = originalName.split('.').pop();
  const truncatedName = originalName.slice(0, 20 - (extension.length + 1));
  const timestamp = Date.now();

  if (!extension) {
    throw new Error('Failed to determine file extension');
  }

  return `${timestamp}_${truncatedName}.${extension}`;
};

/**
 * A utility function that safely handles asynchronous operations.
 * It returns a tuple where the first element is an error (if any) and the second element is the result.
 *
 * @template T - The type of the resolved value of the promise.
 * @param {Promise<T>} promise - The promise to be handled.
 * @returns {Promise<[Error | null, T | null]>} A promise that resolves to a tuple containing an error or the result.
 */
const safeAsync = async <T>(promise: Promise<T>): Promise<[Error | null, T | null]> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
};

/**
 * Checks if a value is a number.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is a number, false otherwise.
 */
const isNumber = (value: any): boolean => {
  return typeof value === 'number' && !Number.isNaN(value);
};

/**
 * Delays execution for a specified amount of time.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Throttles a function to limit execution within a given timeframe.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} The throttled function.
 */
const throttle = (func: (...args) => void, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function (...args: any[]) {
    if (lastRan) {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    } else {
      func(...args);
      lastRan = Date.now();
    }
  };
};

/**
 * Debounces a function to prevent excessive execution.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
const debounce = (func: (...args) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

/**
 * Parses a JSON string safely without throwing errors.
 *
 * @param {string} jsonString - The JSON string to parse.
 * @returns {any | null} The parsed JSON object, or null if parsing fails.
 */
const safeJsonParse = (jsonString: string): any | null => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

/**
 * Generates a slug from a string.
 *
 * @param {string} text - The input string.
 * @returns {string} The generated slug.
 */
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-+)|(-+$)/g, '');
};


/**
 * Synchronizes fullName with firstName and lastName fields.
 * If only fullName is provided, it splits into firstName and lastName.
 * If firstName or lastName are provided, it generates fullName.
 *
 * @param {object} update - Object containing name fields to synchronize.
 * @returns {object} The updated object with synchronized name fields.
 */
const synchronizeNameFields = (
  update: Partial<{
    fullName?: string;
    firstName?: string;
    lastName?: string;
  }>,
): { fullName?: string; firstName?: string; lastName?: string } => {
  if (!update?.firstName && !update?.lastName && !update?.fullName) return update;
  if (update.fullName && !update.firstName && !update.lastName) {
    const nameParts = update.fullName?.split(/\s+/);
    update.firstName = nameParts.slice(0, -1).join(' ').trim() || nameParts[0].trim();
    update.lastName = nameParts.length > 1 ? nameParts.at(-1).trim() : '';
  } else {
    const firstName = update.firstName?.trim() || '';
    const lastName = update.lastName?.trim() || '';
    update.fullName = `${firstName} ${lastName}`.trim();
  }
  return update;
};

/**
 * Generates a random password based on the given options.
 *
 * @param {number} [length=10] - The length of the password to generate.
 * @param {GenerateOptions} [options={}] - Options to customize the password generation.
 * @returns {string} The generated password.
 */
const generatePassword = (length: number = 10, options: GenerateOptions = {}): string => {
  const generateOptions: GenerateOptions = {
    digits: options.digits ?? true,
    lowerCaseAlphabets: options.lowerCaseAlphabets ?? true,
    upperCaseAlphabets: options.upperCaseAlphabets ?? true,
    specialChars: options.specialChars ?? true,
  };

  const allowsChars =
    (generateOptions.digits ? digits : '') +
    (generateOptions.lowerCaseAlphabets ? lowerCaseAlphabets : '') +
    (generateOptions.upperCaseAlphabets ? upperCaseAlphabets : '') +
    (generateOptions.specialChars ? specialChars : '');

  let password = '';
  while (password.length < length) {
    const charIndex = randomInt(0, allowsChars.length);
    if (password.length === 0 && generateOptions.digits === true && allowsChars[charIndex] === '0') {
      continue;
    }
    password += allowsChars[charIndex];
  }

  return password;
};

/**
 * Generates a One-Time Password (OTP) of a given length.
 * The OTP consists of randomly generated digits.
 *
 * @param {number} [length=6] - The length of the OTP to generate.
 * @returns {string} The generated OTP string.
 */
const generateOtp = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    const charIndex = randomInt(0, digits.length);
    otp += digits[charIndex];
  }
  return otp;
};

/**
 * Encrypts text using AES-256-CBC encryption.
 *
 * @param {string} text - The text to encrypt.
 * @param {string} secretKey - The encryption key (must be 32 bytes).
 * @returns {string} The encrypted text in base64 format.
 */
const encryptText = (text: string, secretKey: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return `${iv.toString('base64')}:${encrypted}`;
};

/**
 * Decrypts AES-256-CBC encrypted text.
 *
 * @param {string} encryptedText - The encrypted text (iv:data format).
 * @param {string} secretKey - The decryption key.
 * @returns {string} The decrypted text.
 */
const decryptText = (encryptedText: string, secretKey: string): string => {
  const [iv, encrypted] = encryptedText.split(':').map((part) => Buffer.from(part, 'base64'));
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Encrypts an object into a cipher token using AES-256-CBC encryption.
 * The encrypted token is in the format of iv:data.
 * @param {object} data - The object to encrypt.
 * @returns {string} The encrypted cipher token.
 */
const encryptCipherToken = (data: object): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(SECRET), iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return iv.toString('base64') + ':' + encrypted;
};

/**
 * Decrypts an encrypted cipher token back into an object.
 * The encrypted token is in the format of iv:data.
 * @param {string} token - The encrypted cipher token.
 * @returns {any} The decrypted object.
 */
const decryptCipherToken = (token: string): any => {
  const [ivBase64, encrypted] = token.split(':');

  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(SECRET), iv);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};
export {
  normalizeFilename,
  safeAsync,
  isNumber,
  sleep,
  capitalizeFirstLetter,
  throttle,
  debounce,
  safeJsonParse,
  generateSlug,
  encryptText,
  decryptText,
  synchronizeNameFields,
  generatePassword,
  generateOtp,
  encryptCipherToken,
  decryptCipherToken,
};
