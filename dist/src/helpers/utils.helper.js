"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCipherToken = exports.encryptCipherToken = exports.generateOtp = exports.generatePassword = exports.synchronizeNameFields = exports.decryptText = exports.encryptText = exports.generateSlug = exports.safeJsonParse = exports.debounce = exports.throttle = exports.capitalizeFirstLetter = exports.sleep = exports.isNumber = exports.safeAsync = exports.normalizeFilename = void 0;
const node_crypto_1 = __importStar(require("node:crypto"));
const digits = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';
const ALGO = 'aes-256-cbc';
const SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
const IV_LENGTH = 16;
const normalizeFilename = (str) => {
    const originalName = str.replaceAll(/\s/g, '_');
    const extension = originalName.split('.').pop();
    const truncatedName = originalName.slice(0, 20 - (extension.length + 1));
    const timestamp = Date.now();
    if (!extension) {
        throw new Error('Failed to determine file extension');
    }
    return `${timestamp}_${truncatedName}.${extension}`;
};
exports.normalizeFilename = normalizeFilename;
const safeAsync = async (promise) => {
    try {
        const result = await promise;
        return [null, result];
    }
    catch (error) {
        return [error, null];
    }
};
exports.safeAsync = safeAsync;
const isNumber = (value) => {
    return typeof value === 'number' && !Number.isNaN(value);
};
exports.isNumber = isNumber;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
        if (lastRan) {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
        else {
            func(...args);
            lastRan = Date.now();
        }
    };
};
exports.throttle = throttle;
const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};
exports.debounce = debounce;
const safeJsonParse = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return null;
    }
};
exports.safeJsonParse = safeJsonParse;
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/(^-+)|(-+$)/g, '');
};
exports.generateSlug = generateSlug;
const synchronizeNameFields = (update) => {
    if (!update?.firstName && !update?.lastName && !update?.fullName)
        return update;
    if (update.fullName && !update.firstName && !update.lastName) {
        const nameParts = update.fullName?.split(/\s+/);
        update.firstName = nameParts.slice(0, -1).join(' ').trim() || nameParts[0].trim();
        update.lastName = nameParts.length > 1 ? nameParts.at(-1).trim() : '';
    }
    else {
        const firstName = update.firstName?.trim() || '';
        const lastName = update.lastName?.trim() || '';
        update.fullName = `${firstName} ${lastName}`.trim();
    }
    return update;
};
exports.synchronizeNameFields = synchronizeNameFields;
const generatePassword = (length = 10, options = {}) => {
    const generateOptions = {
        digits: options.digits ?? true,
        lowerCaseAlphabets: options.lowerCaseAlphabets ?? true,
        upperCaseAlphabets: options.upperCaseAlphabets ?? true,
        specialChars: options.specialChars ?? true,
    };
    const allowsChars = (generateOptions.digits ? digits : '') +
        (generateOptions.lowerCaseAlphabets ? lowerCaseAlphabets : '') +
        (generateOptions.upperCaseAlphabets ? upperCaseAlphabets : '') +
        (generateOptions.specialChars ? specialChars : '');
    let password = '';
    while (password.length < length) {
        const charIndex = (0, node_crypto_1.randomInt)(0, allowsChars.length);
        if (password.length === 0 && generateOptions.digits === true && allowsChars[charIndex] === '0') {
            continue;
        }
        password += allowsChars[charIndex];
    }
    return password;
};
exports.generatePassword = generatePassword;
const generateOtp = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        const charIndex = (0, node_crypto_1.randomInt)(0, digits.length);
        otp += digits[charIndex];
    }
    return otp;
};
exports.generateOtp = generateOtp;
const encryptText = (text, secretKey) => {
    const iv = node_crypto_1.default.randomBytes(16);
    const cipher = node_crypto_1.default.createCipheriv(ALGO, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
};
exports.encryptText = encryptText;
const decryptText = (encryptedText, secretKey) => {
    const [iv, encrypted] = encryptedText.split(':').map((part) => Buffer.from(part, 'base64'));
    const decipher = node_crypto_1.default.createDecipheriv(ALGO, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptText = decryptText;
const encryptCipherToken = (data) => {
    const iv = node_crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = node_crypto_1.default.createCipheriv(ALGO, Buffer.from(SECRET), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
};
exports.encryptCipherToken = encryptCipherToken;
const decryptCipherToken = (token) => {
    const [ivBase64, encrypted] = token.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = node_crypto_1.default.createDecipheriv(ALGO, Buffer.from(SECRET), iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};
exports.decryptCipherToken = decryptCipherToken;
