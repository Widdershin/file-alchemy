
loadjs.d("./build/modules/hash-wasm.js",function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.sha1 = exports.md5 = exports.initialize = void 0;
const hash = __importStar(require("hash-wasm"));
function initialize() {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.initialize = initialize;
function md5(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayBuffer = yield data.arrayBuffer();
        const signature = yield hash.md5(new Uint8Array(arrayBuffer));
        const blob = new Blob([signature], { type: "text/plain" });
        return blob;
    });
}
exports.md5 = md5;
function sha1(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayBuffer = yield data.arrayBuffer();
        const signature = yield hash.sha1(new Uint8Array(arrayBuffer));
        const blob = new Blob([signature], { type: "text/plain" });
        return blob;
    });
}
exports.sha1 = sha1;
function sha256(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayBuffer = yield data.arrayBuffer();
        const signature = yield hash.sha256(new Uint8Array(arrayBuffer));
        const blob = new Blob([signature], { type: "text/plain" });
        return blob;
    });
}
exports.sha256 = sha256;

},{"hash-wasm":189});

loadjs.d("189",function(require,module,exports){
(function (global){(function (){
/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hashwasm = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /* eslint-disable import/prefer-default-export */
    /* eslint-disable no-bitwise */
    var _a;
    function getGlobal() {
        if (typeof globalThis !== 'undefined')
            return globalThis;
        // eslint-disable-next-line no-restricted-globals
        if (typeof self !== 'undefined')
            return self;
        if (typeof window !== 'undefined')
            return window;
        return global;
    }
    const globalObject = getGlobal();
    const nodeBuffer = (_a = globalObject.Buffer) !== null && _a !== void 0 ? _a : null;
    const textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
    function intArrayToString(arr, len) {
        return String.fromCharCode(...arr.subarray(0, len));
    }
    function hexCharCodesToInt(a, b) {
        return (((a & 0xF) + ((a >> 6) | ((a >> 3) & 0x8))) << 4) | ((b & 0xF) + ((b >> 6) | ((b >> 3) & 0x8)));
    }
    function writeHexToUInt8(buf, str) {
        const size = str.length >> 1;
        for (let i = 0; i < size; i++) {
            const index = i << 1;
            buf[i] = hexCharCodesToInt(str.charCodeAt(index), str.charCodeAt(index + 1));
        }
    }
    const alpha = 'a'.charCodeAt(0) - 10;
    const digit = '0'.charCodeAt(0);
    function getDigestHex(tmpBuffer, input, hashLength) {
        let p = 0;
        /* eslint-disable no-plusplus */
        for (let i = 0; i < hashLength; i++) {
            let nibble = input[i] >>> 4;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
            nibble = input[i] & 0xF;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
        }
        /* eslint-enable no-plusplus */
        return String.fromCharCode.apply(null, tmpBuffer);
    }
    const getUInt8Buffer = nodeBuffer !== null
        ? (data) => {
            if (typeof data === 'string') {
                const buf = nodeBuffer.from(data, 'utf8');
                return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
            }
            if (nodeBuffer.isBuffer(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.length);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        }
        : (data) => {
            if (typeof data === 'string') {
                return textEncoder.encode(data);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        };
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64Lookup = new Uint8Array(256);
    for (let i = 0; i < base64Chars.length; i++) {
        base64Lookup[base64Chars.charCodeAt(i)] = i;
    }
    function encodeBase64(data, pad = true) {
        const len = data.length;
        const extraBytes = len % 3;
        const parts = [];
        const len2 = len - extraBytes;
        for (let i = 0; i < len2; i += 3) {
            const tmp = ((data[i] << 16) & 0xFF0000)
                + ((data[i + 1] << 8) & 0xFF00)
                + (data[i + 2] & 0xFF);
            const triplet = base64Chars.charAt((tmp >> 18) & 0x3F)
                + base64Chars.charAt((tmp >> 12) & 0x3F)
                + base64Chars.charAt((tmp >> 6) & 0x3F)
                + base64Chars.charAt(tmp & 0x3F);
            parts.push(triplet);
        }
        if (extraBytes === 1) {
            const tmp = data[len - 1];
            const a = base64Chars.charAt(tmp >> 2);
            const b = base64Chars.charAt((tmp << 4) & 0x3F);
            parts.push(`${a}${b}`);
            if (pad) {
                parts.push('==');
            }
        }
        else if (extraBytes === 2) {
            const tmp = (data[len - 2] << 8) + data[len - 1];
            const a = base64Chars.charAt(tmp >> 10);
            const b = base64Chars.charAt((tmp >> 4) & 0x3F);
            const c = base64Chars.charAt((tmp << 2) & 0x3F);
            parts.push(`${a}${b}${c}`);
            if (pad) {
                parts.push('=');
            }
        }
        return parts.join('');
    }
    function getDecodeBase64Length(data) {
        let bufferLength = Math.floor(data.length * 0.75);
        const len = data.length;
        if (data[len - 1] === '=') {
            bufferLength -= 1;
            if (data[len - 2] === '=') {
                bufferLength -= 1;
            }
        }
        return bufferLength;
    }
    function decodeBase64(data) {
        const bufferLength = getDecodeBase64Length(data);
        const len = data.length;
        const bytes = new Uint8Array(bufferLength);
        let p = 0;
        for (let i = 0; i < len; i += 4) {
            const encoded1 = base64Lookup[data.charCodeAt(i)];
            const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
            const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
            const encoded4 = base64Lookup[data.charCodeAt(i + 3)];
            bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
            p += 1;
            bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            p += 1;
            bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            p += 1;
        }
        return bytes;
    }

    class Mutex {
        constructor() {
            this.mutex = Promise.resolve();
        }
        lock() {
            let begin = () => { };
            this.mutex = this.mutex.then(() => new Promise(begin));
            return new Promise((res) => {
                begin = res;
            });
        }
        dispatch(fn) {
            return __awaiter(this, void 0, void 0, function* () {
                const unlock = yield this.lock();
                try {
                    return yield Promise.resolve(fn());
                }
                finally {
                    unlock();
                }
            });
        }
    }

    const MAX_HEAP = 16 * 1024;
    const wasmMutex = new Mutex();
    const wasmModuleCache = new Map();
    function WASMInterface(binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            let wasmInstance = null;
            let memoryView = null;
            let initialized = false;
            if (typeof WebAssembly === 'undefined') {
                throw new Error('WebAssembly is not supported in this environment!');
            }
            const writeMemory = (data, offset = 0) => {
                memoryView.set(data, offset);
            };
            const getMemory = () => memoryView;
            const getExports = () => wasmInstance.exports;
            const setMemorySize = (totalSize) => {
                wasmInstance.exports.Hash_SetMemorySize(totalSize);
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, totalSize);
            };
            const loadWASMPromise = wasmMutex.dispatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!wasmModuleCache.has(binary.name)) {
                    const asm = decodeBase64(binary.data);
                    const promise = WebAssembly.compile(asm);
                    wasmModuleCache.set(binary.name, promise);
                }
                const module = yield wasmModuleCache.get(binary.name);
                wasmInstance = yield WebAssembly.instantiate(module, {
                // env: {
                //   emscripten_memcpy_big: (dest, src, num) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     memView.set(memView.subarray(src, src + num), dest);
                //   },
                //   print_memory: (offset, len) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     console.log('print_int32', memView.subarray(offset, offset + len));
                //   },
                // },
                });
                // wasmInstance.exports._start();
            }));
            const setupInterface = () => __awaiter(this, void 0, void 0, function* () {
                if (!wasmInstance) {
                    yield loadWASMPromise;
                }
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
            });
            const init = (bits = null) => {
                initialized = true;
                wasmInstance.exports.Hash_Init(bits);
            };
            const updateUInt8Array = (data) => {
                let read = 0;
                while (read < data.length) {
                    const chunk = data.subarray(read, read + MAX_HEAP);
                    read += chunk.length;
                    memoryView.set(chunk);
                    wasmInstance.exports.Hash_Update(chunk.length);
                }
            };
            const update = (data) => {
                if (!initialized) {
                    throw new Error('update() called before init()');
                }
                const Uint8Buffer = getUInt8Buffer(data);
                updateUInt8Array(Uint8Buffer);
            };
            const digestChars = new Uint8Array(hashLength * 2);
            const digest = (outputType, padding = null) => {
                if (!initialized) {
                    throw new Error('digest() called before init()');
                }
                initialized = false;
                wasmInstance.exports.Hash_Final(padding);
                if (outputType === 'binary') {
                    // the data is copied to allow GC of the original memory object
                    return memoryView.slice(0, hashLength);
                }
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            const isDataShort = (data) => {
                if (typeof data === 'string') {
                    // worst case is 4 bytes / char
                    return data.length < MAX_HEAP / 4;
                }
                return data.byteLength < MAX_HEAP;
            };
            let canSimplify = isDataShort;
            switch (binary.name) {
                case 'argon2':
                case 'scrypt':
                    canSimplify = () => true;
                    break;
                case 'blake2b':
                case 'blake2s':
                    // if there is a key at blake2 then cannot simplify
                    canSimplify = (data, initParam) => initParam <= 512 && isDataShort(data);
                    break;
                case 'blake3':
                    // if there is a key at blake3 then cannot simplify
                    canSimplify = (data, initParam) => initParam === 0 && isDataShort(data);
                    break;
                case 'xxhash64': // cannot simplify
                    canSimplify = () => false;
                    break;
            }
            // shorthand for (init + update + digest) for better performance
            const calculate = (data, initParam = null, digestParam = null) => {
                if (!canSimplify(data, initParam)) {
                    init(initParam);
                    update(data);
                    return digest('hex', digestParam);
                }
                const buffer = getUInt8Buffer(data);
                memoryView.set(buffer);
                wasmInstance.exports.Hash_Calculate(buffer.length, initParam, digestParam);
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            yield setupInterface();
            return {
                getMemory,
                writeMemory,
                getExports,
                setMemorySize,
                init,
                update,
                digest,
                calculate,
                hashLength,
            };
        });
    }

    var name$h = "blake2b";
    var data$h = "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";
    var wasmJson$h = {
    	name: name$h,
    	data: data$h
    };

    function lockedCreate(mutex, binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const unlock = yield mutex.lock();
            const wasm = yield WASMInterface(binary, hashLength);
            unlock();
            return wasm;
        });
    }

    const mutex$h = new Mutex();
    let wasmCache$h = null;
    function validateBits$4(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 512 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 512');
        }
        return null;
    }
    function getInitParam$1(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2b hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2b(data, bits = 512, key = null) {
        if (validateBits$4(bits)) {
            return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$h === null || wasmCache$h.hashLength !== hashLength) {
            return lockedCreate(mutex$h, wasmJson$h, hashLength)
                .then((wasm) => {
                wasmCache$h = wasm;
                if (initParam > 512) {
                    wasmCache$h.writeMemory(keyBuffer);
                }
                return wasmCache$h.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache$h.writeMemory(keyBuffer);
            }
            const hash = wasmCache$h.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2b hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     */
    function createBLAKE2b(bits = 512, key = null) {
        if (validateBits$4(bits)) {
            return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$h, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$g = "argon2";
    var data$g = "AGFzbQEAAAABKQVgAX8Bf2AAAX9gEH9/f39/f39/f39/f39/f38AYAR/f39/AGACf38AAwYFAAECAwQEBQFwAQEBBQYBAQKAgAIGCAF/AUGQqAQLB0EEBm1lbW9yeQIAEkhhc2hfU2V0TWVtb3J5U2l6ZQAADkhhc2hfR2V0QnVmZmVyAAEOSGFzaF9DYWxjdWxhdGUABAqCNAVbAQF/QQAhAQJAIABBACgCgAhrIgBFDQACQCAAQRB2IABBgIB8cSAASWoiAEAAQX9HDQBB/wEhAQwBC0EAIQFBAEEAKQOACCAAQRB0rXw3A4AICyABQRh0QRh1C2oBAn8CQEEAKAKICCIADQBBAD8AQRB0IgA2AogIQYCAIEEAKAKACGsiAUUNAAJAIAFBEHYgAUGAgHxxIAFJaiIAQABBf0cNAEEADwtBAEEAKQOACCAAQRB0rXw3A4AIQQAoAogIIQALIAALnA8BA34gACAEKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwAgASAFKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgAiAGKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAyAHKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgACAFKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgASAGKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAiAHKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgAyAEKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwALhxoBAX9BACEEQQAgAikDACABKQMAhTcDkAhBACACKQMIIAEpAwiFNwOYCEEAIAIpAxAgASkDEIU3A6AIQQAgAikDGCABKQMYhTcDqAhBACACKQMgIAEpAyCFNwOwCEEAIAIpAyggASkDKIU3A7gIQQAgAikDMCABKQMwhTcDwAhBACACKQM4IAEpAziFNwPICEEAIAIpA0AgASkDQIU3A9AIQQAgAikDSCABKQNIhTcD2AhBACACKQNQIAEpA1CFNwPgCEEAIAIpA1ggASkDWIU3A+gIQQAgAikDYCABKQNghTcD8AhBACACKQNoIAEpA2iFNwP4CEEAIAIpA3AgASkDcIU3A4AJQQAgAikDeCABKQN4hTcDiAlBACACKQOAASABKQOAAYU3A5AJQQAgAikDiAEgASkDiAGFNwOYCUEAIAIpA5ABIAEpA5ABhTcDoAlBACACKQOYASABKQOYAYU3A6gJQQAgAikDoAEgASkDoAGFNwOwCUEAIAIpA6gBIAEpA6gBhTcDuAlB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";
    var wasmJson$g = {
    	name: name$g,
    	data: data$g
    };

    function encodeResult(salt, options, res) {
        const parameters = [
            `m=${options.memorySize}`,
            `t=${options.iterations}`,
            `p=${options.parallelism}`,
        ].join(',');
        return `$argon2${options.hashType}$v=19$${parameters}$${encodeBase64(salt, false)}$${encodeBase64(res, false)}`;
    }
    const uint32View = new DataView(new ArrayBuffer(4));
    function int32LE(x) {
        uint32View.setInt32(0, x, true);
        return new Uint8Array(uint32View.buffer);
    }
    function hashFunc(blake512, buf, len) {
        return __awaiter(this, void 0, void 0, function* () {
            if (len <= 64) {
                const blake = yield createBLAKE2b(len * 8);
                blake.update(int32LE(len));
                blake.update(buf);
                return blake.digest('binary');
            }
            const r = Math.ceil(len / 32) - 2;
            const ret = new Uint8Array(len);
            blake512.init();
            blake512.update(int32LE(len));
            blake512.update(buf);
            let vp = blake512.digest('binary');
            ret.set(vp.subarray(0, 32), 0);
            for (let i = 1; i < r; i++) {
                blake512.init();
                blake512.update(vp);
                vp = blake512.digest('binary');
                ret.set(vp.subarray(0, 32), i * 32);
            }
            const partialBytesNeeded = len - 32 * r;
            let blakeSmall;
            if (partialBytesNeeded === 64) {
                blakeSmall = blake512;
                blakeSmall.init();
            }
            else {
                blakeSmall = yield createBLAKE2b(partialBytesNeeded * 8);
            }
            blakeSmall.update(vp);
            vp = blakeSmall.digest('binary');
            ret.set(vp.subarray(0, partialBytesNeeded), r * 32);
            return ret;
        });
    }
    function getHashType(type) {
        switch (type) {
            case 'd':
                return 0;
            case 'i':
                return 1;
            default:
                return 2;
        }
    }
    function argon2Internal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parallelism, iterations, hashLength } = options;
            const password = getUInt8Buffer(options.password);
            const salt = getUInt8Buffer(options.salt);
            const version = 0x13;
            const hashType = getHashType(options.hashType);
            const { memorySize } = options; // in KB
            const [argon2Interface, blake512] = yield Promise.all([
                WASMInterface(wasmJson$g, 1024),
                createBLAKE2b(512),
            ]);
            // last block is for storing the init vector
            argon2Interface.setMemorySize(memorySize * 1024 + 1024);
            const initVector = new Uint8Array(24);
            const initVectorView = new DataView(initVector.buffer);
            initVectorView.setInt32(0, parallelism, true);
            initVectorView.setInt32(4, hashLength, true);
            initVectorView.setInt32(8, memorySize, true);
            initVectorView.setInt32(12, iterations, true);
            initVectorView.setInt32(16, version, true);
            initVectorView.setInt32(20, hashType, true);
            argon2Interface.writeMemory(initVector, memorySize * 1024);
            blake512.init();
            blake512.update(initVector);
            blake512.update(int32LE(password.length));
            blake512.update(password);
            blake512.update(int32LE(salt.length));
            blake512.update(salt);
            blake512.update(int32LE(0)); // key length + key
            blake512.update(int32LE(0)); // associatedData length + associatedData
            const segments = Math.floor(memorySize / (parallelism * 4)); // length of each lane
            const lanes = segments * 4;
            const param = new Uint8Array(72);
            const H0 = blake512.digest('binary');
            param.set(H0);
            for (let lane = 0; lane < parallelism; lane++) {
                param.set(int32LE(0), 64);
                param.set(int32LE(lane), 68);
                let position = lane * lanes;
                let chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
                position += 1;
                param.set(int32LE(1), 64);
                chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
            }
            const C = new Uint8Array(1024);
            writeHexToUInt8(C, argon2Interface.calculate(new Uint8Array([]), memorySize));
            const res = yield hashFunc(blake512, C, hashLength);
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, res, hashLength);
            }
            if (options.outputType === 'encoded') {
                return encodeResult(salt, options, res);
            }
            // return binary format
            return res;
        });
    }
    const validateOptions$3 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.password) {
            throw new Error('Password must be specified');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password must be specified');
        }
        if (!options.salt) {
            throw new Error('Salt must be specified');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length < 8) {
            throw new Error('Salt should be at least 8 bytes long');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 4) {
            throw new Error('Hash length should be at least 4 bytes.');
        }
        if (!Number.isInteger(options.memorySize)) {
            throw new Error('Memory size should be specified.');
        }
        if (options.memorySize < 8 * options.parallelism) {
            throw new Error('Memory size should be at least 8 * parallelism.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the argon2i password-hashing function
     * @returns Computed hash
     */
    function argon2i(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'i' }));
        });
    }
    /**
     * Calculates hash using the argon2id password-hashing function
     * @returns Computed hash
     */
    function argon2id(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'id' }));
        });
    }
    /**
     * Calculates hash using the argon2d password-hashing function
     * @returns Computed hash
     */
    function argon2d(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'd' }));
        });
    }
    const getHashParameters = (password, encoded) => {
        const regex = /^\$argon2(id|i|d)\$v=([0-9]+)\$((?:[mtp]=[0-9]+,){2}[mtp]=[0-9]+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;
        const match = encoded.match(regex);
        if (!match) {
            throw new Error('Invalid hash');
        }
        const [, hashType, version, parameters, salt, hash] = match;
        if (version !== '19') {
            throw new Error(`Unsupported version: ${version}`);
        }
        const parsedParameters = {};
        const paramMap = { m: 'memorySize', p: 'parallelism', t: 'iterations' };
        parameters.split(',').forEach((x) => {
            const [n, v] = x.split('=');
            parsedParameters[paramMap[n]] = parseInt(v, 10);
        });
        return Object.assign(Object.assign({}, parsedParameters), { password, hashType: hashType, salt: decodeBase64(salt), hashLength: getDecodeBase64Length(hash), outputType: 'encoded' });
    };
    const validateVerifyOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
    };
    /**
     * Verifies password using the argon2 password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function argon2Verify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions$1(options);
            const params = getHashParameters(options.password, options.hash);
            validateOptions$3(params);
            const hashStart = options.hash.lastIndexOf('$') + 1;
            const result = yield argon2Internal(params);
            return result.substring(hashStart) === options.hash.substring(hashStart);
        });
    }

    var name$f = "blake2s";
    var data$f = "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AQsPACABEARBgAggABABEAML";
    var wasmJson$f = {
    	name: name$f,
    	data: data$f
    };

    const mutex$g = new Mutex();
    let wasmCache$g = null;
    function validateBits$3(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 256 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 256');
        }
        return null;
    }
    function getInitParam(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2s hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2s(data, bits = 256, key = null) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$g === null || wasmCache$g.hashLength !== hashLength) {
            return lockedCreate(mutex$g, wasmJson$f, hashLength)
                .then((wasm) => {
                wasmCache$g = wasm;
                if (initParam > 512) {
                    wasmCache$g.writeMemory(keyBuffer);
                }
                return wasmCache$g.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache$g.writeMemory(keyBuffer);
            }
            const hash = wasmCache$g.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2s hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     */
    function createBLAKE2s(bits = 256, key = null) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$f, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$e = "blake3";
    var data$e = "AGFzbQEAAAABJQZgAAF/YAF/AGADf39/AGAGf39/f35/AGABfgBgBX9/fn9/AX8DDAsAAQIDBAUBAQEBAgQFAXABAQEFBAEBAgIGCAF/AUGAlwULB1MGBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAcLSGFzaF9VcGRhdGUACApIYXNoX0ZpbmFsAAkOSGFzaF9DYWxjdWxhdGUACgrLWAsFAEGACAubEQkDfwR+An8BfgF/A34CfwJ+BH8jAEHQAmsiASQAAkAgAEUNAAJAAkBBAC0AiYkBQQZ0QQAtAIiJAWoiAg0AQYAIIQMMAQtBoIgBQYAIIABBgAggAmsiAiACIABLGyICEAIgACACayIARQ0BIAFBoAFqQQApA9CIATcDACABQagBakEAKQPYiAE3AwAgAUEAKQOgiAEiBDcDcCABQQApA6iIASIFNwN4IAFBACkDsIgBIgY3A4ABIAFBACkDuIgBIgc3A4gBIAFBACkDyIgBNwOYAUEALQCKiQEhCEEALQCJiQEhCUEAKQPAiAEhCkEALQCIiQEhCyABQbABakEAKQPgiAE3AwAgAUG4AWpBACkD6IgBNwMAIAFBwAFqQQApA/CIATcDACABQcgBakEAKQP4iAE3AwAgAUHQAWpBACkDgIkBNwMAIAEgCzoA2AEgASAKNwOQASABIAggCUVyQQJyIgg6ANkBIAEgBzcD+AEgASAGNwPwASABIAU3A+gBIAEgBDcD4AEgAUGAAmogAUHgAWogAUGYAWogCyAKIAhB/wFxEAMgASkDuAIhCiABKQOYAiEEIAEpA7ACIQUgASkDkAIhBiABKQOgAiEHIAEpA4ACIQwgASkDqAIhDSABKQOIAiEOQQApA8CIARAEQQAtAJCJASIIQQV0IgtBmYkBaiANIA6FNwMAIAtBkYkBaiAHIAyFNwMAIAtBoYkBaiAFIAaFNwMAIAtBqYkBaiAKIASFNwMAQQAgCEEBajoAkIkBQQBCADcD2IgBQQBCADcD+IgBQQBBACkDgIgBNwOgiAFBAEIANwOAiQFBAEIANwPwiAFBAEIANwPoiAFBAEIANwPgiAFBAEIANwPQiAFBAEIANwPIiAFBAEEAKQOYiAE3A7iIAUEAQQApA4iIATcDqIgBQQBBACkDkIgBNwOwiAFBAEEAKQPAiAFCAXw3A8CIAUEAQQA7AYiJASACQYAIaiEDCwJAIABBgQhJDQBBACkDwIgBIQQgAUEoaiEPA0AgBEIKhiEKQgEgAEEBcq15Qj+FhqchAgNAIAIiEEEBdiECIAogEEF/aq2DQgBSDQALIBBBCnatIQ0CQAJAIBBBgAhLDQAgAUEAOwHYASABQgA3A9ABIAFCADcDyAEgAUIANwPAASABQgA3A7gBIAFCADcDsAEgAUIANwOoASABQgA3A6ABIAFCADcDmAEgAUEAKQOAiAE3A3AgAUEAKQOIiAE3A3ggAUEAKQOQiAE3A4ABIAFBAC0AiokBOgDaASABQQApA5iIATcDiAEgASAENwOQASABQfAAaiADIBAQAiABIAEpA3AiBDcDACABIAEpA3giBTcDCCABIAEpA4ABIgY3AxAgASABKQOIASIHNwMYIAEgASkDmAE3AyggASABKQOgATcDMCABIAEpA6gBNwM4IAEtANoBIQIgAS0A2QEhCyABKQOQASEKIAEgAS0A2AEiCDoAaCABIAo3AyAgASABKQOwATcDQCABIAEpA7gBNwNIIAEgASkDwAE3A1AgASABKQPIATcDWCABIAEpA9ABNwNgIAEgAiALRXJBAnIiAjoAaSABIAc3A/gBIAEgBjcD8AEgASAFNwPoASABIAQ3A+ABIAFBgAJqIAFB4AFqIA8gCCAKIAJB/wFxEAMgASkDoAIhBCABKQOAAiEFIAEpA6gCIQYgASkDiAIhByABKQOwAiEMIAEpA5ACIQ4gASkDuAIhESABKQOYAiESIAoQBEEAQQAtAJCJASICQQFqOgCQiQEgAkEFdCICQamJAWogESAShTcDACACQaGJAWogDCAOhTcDACACQZmJAWogBiAHhTcDACACQZGJAWogBCAFhTcDAAwBCwJAAkAgAyAQIARBAC0AiokBIgIgAUHwAGoQBSITQQJLDQAgASkDiAEhCiABKQOAASEEIAEpA3ghBSABKQNwIQYMAQsgAkEEciEUA0AgE0F+akEBdiIVQQFqIQggAUHIAmohAiABQfAAaiELA0AgAiALNgIAIAtBwABqIQsgAkEEaiECIAhBf2oiCA0ACyABIQIgAUHIAmohCyAVQQFqIhYhCANAIAsoAgAhCSABQQApA4CIATcD4AEgAUEAKQOIiAE3A+gBIAFBACkDkIgBNwPwASABQQApA5iIATcD+AEgAUGAAmogAUHgAWogCUHAAEIAIBQQAyABKQOgAiEKIAEpA4ACIQQgASkDqAIhBSABKQOIAiEGIAEpA7ACIQcgASkDkAIhDCACQRhqIAEpA7gCIAEpA5gChTcDACACQRBqIAcgDIU3AwAgAkEIaiAFIAaFNwMAIAIgCiAEhTcDACACQSBqIQIgC0EEaiELIAhBf2oiCA0ACwJAAkAgE0F+cSATSQ0AIBYhEwwBCyABIBZBBXRqIgIgAUHwAGogFkEGdGoiCykDADcDACACIAspAwg3AwggAiALKQMQNwMQIAIgCykDGDcDGCAVQQJqIRMLIAEgASkDACIGNwNwIAEgASkDCCIFNwN4IAEgASkDECIENwOAASABIAEpAxgiCjcDiAEgE0ECSw0ACwsgASkDkAEhByABKQOYASEMIAEpA6ABIQ4gASkDqAEhEUEAKQPAiAEQBEEALQCQiQEiC0EFdCICQaGJAWogBDcDACACQZmJAWogBTcDAEEAIAtBAWo6AJCJASACQZGJAWogBjcDACACQamJAWogCjcDAEEAKQPAiAEgDUIBiHwQBEEAQQAtAJCJASICQQFqOgCQiQEgAkEFdCICQamJAWogETcDACACQaGJAWogDjcDACACQZmJAWogDDcDACACQZGJAWogBzcDAAtBAEEAKQPAiAEgDXwiBDcDwIgBIAMgEGohAyAAIBBrIgBBgAhLDQALIABFDQELQaCIASADIAAQAkEAKQPAiAEQBAsgAUHQAmokAAv7BAEFfyMAQcAAayIDJAACQAJAIAAtAGgiBEUNAAJAIAJBwAAgBGsiBSAFIAJLGyIFRQ0AIAAgBGpBKGohBkEAIQQDQCAGIARqIAEgBGotAAA6AAAgBEEBaiIEIAVJDQALIAAtAGghBAsgACAEIAVqIgQ6AGggASAFaiEBAkAgAiAFayICDQBBACECDAILIAMgACAAQShqQcAAIAApAyAgAC0AaiAAQekAaiIELQAARXIQAyAAIAMpAyAgAykDAIU3AwAgACADKQMoIAMpAwiFNwMIIAAgAykDMCADKQMQhTcDECAAIAMpAzggAykDGIU3AxggAEEAOgBoIABB4ABqQgA3AwAgAEHYAGpCADcDACAAQdAAakIANwMAIABByABqQgA3AwAgAEHAAGpCADcDACAAQThqQgA3AwAg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AXEgCCACQQhyQf8BcRADIAEgASkD2AEiDSABKQO4AYU3A3ggASABKQPgASIOIAEpA8ABhTcDgAEgASAGIAEpA+gBIg+FNwOoASABIAUgDoU3A6ABIAEgBCANhTcDmAEgASADIAEpA9ABIg2FNwOQASABIA8gASkDyAGFNwOIASAAQcAAIABBwABJGyIQQX9qIQkgASANIAEpA7ABhSINNwNwIA2nIREgCiEHIAwhAgJAA0AgAiAROgAAIAlFDQEgCUF/aiEJIAJBAWohAiAHLQAAIREgB0EBaiEHDAALCyAAIBBrIgBFDQIgDCAQaiEMIAhCAXwhCCABKQMIIQQgASkDACEDIAEpAxghBiABKQMQIQUgAS0AaSECIAEtAGghCQwACwsCQAJAAkBBAC0AiYkBIglBBnRBAEEALQCIiQEiDGtGDQAgAUHgAGpBACkDgIkBNwMAIAFB2ABqQQApA/iIATcDACABQdAAakEAKQPwiAE3AwAgAUHIAGpBACkD6IgBNwMAIAFBwABqQQApA+CIATcDACABQThqQQApA9iIATcDACABQTBqQQApA9CIATcDACABQQApA8iIATcDKCABQQApA8CIASIINwMgIAFBACkDuIgBIg03AxggAUEAKQOwiAEiDjcDECABQQApA6iIASIPNwMIIAFBACkDoIgBIgM3AwBBAC0AiokBIQcgAUHuAGogAUG0AWovAQA7AQAgASABKAGwATYBaiABIAw6AGggASAHIAlFckECciIJOgBpDAELIAFB4ABqIAJBfmoiAkEFdCIJQcmJAWopAwA3AwAgAUHYAGogCUHBiQFqKQMANwMAIAFB0ABqIAlBuYkBaikDADcDACABQcgAaiAJQbGJAWopAwA3AwBBwAAhDCABQcAAaiAJQamJAWopAwA3AwAgAUE4aiAJQaGJAWopAwA3AwAgAUEwaiAJQZmJAWopAwA3AwBCACEIIAFCADcDICABQQApA5iIASINNwMYIAFBACkDkIgBIg43AxAgAUEAKQOIiAEiDzcDCCABQQApA4CIASIDNwMAIAEgCUGRiQFqKQMANwMoQQAtAIqJASEJIAFB7gBqIAFBsAFqQQRqLwEAOwEAIAEgASgBsAE2AWogASAJQQRyIgk6AGkgAUHAADoAaCACRQ0BCyACQX9qIgdBBXQiEUGRiQFqKQMAIQQgEUGZiQFqKQMAIQUgEUGhiQFqKQMAIQYgEUGpiQFqKQMAIRIgASANNwOIASABIA43A4ABIAEgDzcDeCABIAM3A3AgAUGwAWogAUHwAGogAUEoaiIQIAwgCCAJQf8BcRADIAFBwAA6AGggASASNwNAIAEgBjcDOCABIAU3AzAgASAENwMoIAFCADcDICABQQApA5iIASIINwMYIAFBACkDkIgBIg03AxAgAUEAKQOIiAEiDjcDCCABQQApA4CIASIPNwMAIAFBAC0AiokBQQRyIgk6AGkgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggAUHuAGogAUGwAWpBBGoiDC8BADsBACABIAEoAbABNgFqIAdFDQAgAUHqAGohESACQQV0QemIAWohAgNAIAJBaGopAwAhAyACQXBqKQMAIQQgAkF4aikDACEFIAIpAwAhBiABIAg3A4gBIAEgDTcDgAEgASAONwN4IAEgDzcDcCABQbABaiABQfAAaiAQQcAAQgAgCUH/AXEQAyABQcAAOgBoIAEgBjcDQCABIAU3AzggASAENwMwIAEgAzcDKCABQgA3AyAgAUEAKQOYiAEiCDcDGCABQQApA5CIASINNwMQIAFBACkDiIgBIg43AwggAUEAKQOAiAEiDzcDACABQQAtAIqJAUEEciIJOgBpIAEgASkD6AEgASkDyAGFNwNgIAEgASkD4AEgASkDwAGFNwNYIAEgASkD2AEgASkDuAGFNwNQIAEgASkD0AEgASkDsAGFNwNIIBFBBGogDC8BADsBACARIAEoAbABNgEAIAJBYGohAiAHQX9qIgcNAAsLIAFB8ABqQQFyIQogAUEoaiELQgAhCEGACCEMQcAAIQIDQCABQbABaiABIAsgAkH/AXEgCCAJQQhyQf8BcRADIAEgASkD2AEiDSABKQO4AYU3A3ggASABKQPgASIOIAEpA8ABhTcDgAEgASABKQPoASIPIAEpA8gBhTcDiAEgASABKQMAIAEpA9ABIgOFNwOQASABIA0gASkDCIU3A5gBIAEgDiABKQMQhTcDoAEgASADIAEpA7ABhSINNwNwIAEgDyABKQMYhTcDqAEgAEHAACAAQcAASRsiEEF/aiECIA2nIREgCiEHIAwhCQJAA0AgCSAROgAAIAJFDQEgAkF/aiECIAlBAWohCSAHLQAAIREgB0EBaiEHDAALCyAAIBBrIgBFDQEgDCAQaiEMIAhCAXwhCCABLQBpIQkgAS0AaCECDAALCyABQfABaiQAC6MCAQR+AkACQCAAQSBGDQBCq7OP/JGjs/DbACEBQv+kuYjFkdqCm38hAkLy5rvjo6f9p6V/IQNC58yn0NbQ67O7fyEEQQAhAAwBC0EAKQOYCCEBQQApA5AIIQJBACkDiAghA0EAKQOACCEEQRAhAAtBACAAOgCKiQFBAEIANwOAiQFBAEIANwP4iAFBAEIANwPwiAFBAEIANwPoiAFBAEIANwPgiAFBAEIANwPYiAFBAEIANwPQiAFBAEIANwPIiAFBAEIANwPAiAFBACABNwO4iAFBACACNwOwiAFBACADNwOoiAFBACAENwOgiAFBACABNwOYiAFBACACNwOQiAFBACADNwOIiAFBACAENwOAiAFBAEEAOgCQiQFBAEEAOwGIiQELBgAgABABCwYAIAAQBgurAgEEfgJAAkAgAUEgRg0AQquzj/yRo7Pw2wAhA0L/pLmIxZHagpt/IQRC8ua746On/aelfyEFQufMp9DW0Ouzu38hBkEAIQEMAQtBACkDmAghA0EAKQOQCCEEQQApA4gIIQVBACkDgAghBkEQIQELQQAgAToAiokBQQBCADcDgIkBQQBCADcD+IgBQQBCADcD8IgBQQBCADcD6IgBQQBCADcD4IgBQQBCADcD2IgBQQBCADcD0IgBQQBCADcDyIgBQQBCADcDwIgBQQAgAzcDuIgBQQAgBDcDsIgBQQAgBTcDqIgBQQAgBjcDoIgBQQAgAzcDmIgBQQAgBDcDkIgBQQAgBTcDiIgBQQAgBjcDgIgBQQBBADoAkIkBQQBBADsBiIkBIAAQASACEAYL";
    var wasmJson$e = {
    	name: name$e,
    	data: data$e
    };

    const mutex$f = new Mutex();
    let wasmCache$f = null;
    function validateBits$2(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ...');
        }
        return null;
    }
    /**
     * Calculates BLAKE3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Length should be 32 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake3(data, bits = 256, key = null) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0; // key is empty by default
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length !== 32) {
                return Promise.reject(new Error('Key length must be exactly 32 bytes'));
            }
            initParam = 32;
        }
        const hashLength = bits / 8;
        const digestParam = hashLength;
        if (wasmCache$f === null || wasmCache$f.hashLength !== hashLength) {
            return lockedCreate(mutex$f, wasmJson$e, hashLength)
                .then((wasm) => {
                wasmCache$f = wasm;
                if (initParam === 32) {
                    wasmCache$f.writeMemory(keyBuffer);
                }
                return wasmCache$f.calculate(data, initParam, digestParam);
            });
        }
        try {
            if (initParam === 32) {
                wasmCache$f.writeMemory(keyBuffer);
            }
            const hash = wasmCache$f.calculate(data, initParam, digestParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE3 hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Length should be 32 bytes.
     */
    function createBLAKE3(bits = 256, key = null) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0; // key is empty by default
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length !== 32) {
                return Promise.reject(new Error('Key length must be exactly 32 bytes'));
            }
            initParam = 32;
        }
        const outputSize = bits / 8;
        const digestParam = outputSize;
        return WASMInterface(wasmJson$e, outputSize).then((wasm) => {
            if (initParam === 32) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam === 32
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, digestParam),
                blockSize: 64,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$d = "crc32";
    var data$d = "AGFzbQEAAAABDANgAAF/YAAAYAF/AAMHBgABAQIBAgQFAXABAQEFBAEBAgIGCAF/AUGQyAULB1MGBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAILSGFzaF9VcGRhdGUAAwpIYXNoX0ZpbmFsAAQOSGFzaF9DYWxjdWxhdGUABQrcBwYFAEGACAvjAwEEf0GAiAEhAEEAIQEDQCAAQQBBAEEAQQAgAUEBdiICQQFxa0GghuLtfnFBACABQQFxa0GghuLtfnEgAnNBAXYiAnNBAXYiA0EBcWtBoIbi7X5xQQAgAkEBcWtBoIbi7X5xIANzQQF2IgJzQQF2IgNBAXFrQaCG4u1+cUEAIAJBAXFrQaCG4u1+cSADc0EBdiICc0EBdiIDQQFxa0GghuLtfnFBACACQQFxa0GghuLtfnEgA3NBAXZzNgIAIABBBGohACABQQFqIgFBgAJHDQALQQAhAQNAIAFBhJABaiABQYSIAWooAgAiAEH/AXFBAnRBgIgBaigCACAAQQh2cyIANgIAIAFBhJgBaiAAQf8BcUECdEGAiAFqKAIAIABBCHZzIgA2AgAgAUGEoAFqIABB/wFxQQJ0QYCIAWooAgAgAEEIdnMiADYCACABQYSoAWogAEH/AXFBAnRBgIgBaigCACAAQQh2cyIANgIAIAFBhLABaiAAQf8BcUECdEGAiAFqKAIAIABBCHZzIgA2AgAgAUGEuAFqIABB/wFxQQJ0QYCIAWooAgAgAEEIdnMiADYCACABQYTAAWogAEH/AXFBAnRBgIgBaigCACAAQQh2czYCACABQQRqIgFB/AdHDQALCyIAAkBBAC0AgMgBDQAQAUEAQQE6AIDIAQtBAEEANgKEyAELwQIBBn9BACgChMgBQX9zIQFBgAghAgJAIABBCEkNACAAQXhqIgNBeHEiBEEIaiEFQYAIIQIDQCACQQRqKAIAIgZBDnZB/AdxQYCQAWooAgAgBkEWdkH8B3FBgIgBaigCAHMgBkEGdkH8B3FBgJgBaigCAHMgBkH/AXFBAnRBgKABaigCAHMgAigCACABcyIBQRZ2QfwHcUGAqAFqKAIAcyABQQ52QfwHcUGAsAFqKAIAcyABQQZ2QfwHcUGAuAFqKAIAcyABQf8BcUECdEGAwAFqKAIAcyEBIAJBCGohAiAAQXhqIgBBB0sNAAsgAyAEayEAIAVBgAhqIQILAkAgAEUNAANAIAFB/wFxIAItAABzQQJ0QYCIAWooAgAgAUEIdnMhASACQQFqIQIgAEF/aiIADQALC0EAIAFBf3M2AoTIAQszAQF/QQBBACgChMgBIgBBGHQgAEEIdEGAgPwHcXIgAEEIdkGA/gNxIABBGHZycjYCgAgLVQACQEEALQCAyAENABABQQBBAToAgMgBC0EAQQA2AoTIASAAEANBAEEAKAKEyAEiAEEYdCAAQQh0QYCA/AdxciAAQQh2QYD+A3EgAEEYdnJyNgKACAs=";
    var wasmJson$d = {
    	name: name$d,
    	data: data$d
    };

    const mutex$e = new Mutex();
    let wasmCache$e = null;
    /**
     * Calculates CRC-32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function crc32(data) {
        if (wasmCache$e === null) {
            return lockedCreate(mutex$e, wasmJson$d, 4)
                .then((wasm) => {
                wasmCache$e = wasm;
                return wasmCache$e.calculate(data);
            });
        }
        try {
            const hash = wasmCache$e.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new CRC-32 hash instance
     */
    function createCRC32() {
        return WASMInterface(wasmJson$d, 4).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 4,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$c = "md4";
    var data$c = "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";
    var wasmJson$c = {
    	name: name$c,
    	data: data$c
    };

    const mutex$d = new Mutex();
    let wasmCache$d = null;
    /**
     * Calculates MD4 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md4(data) {
        if (wasmCache$d === null) {
            return lockedCreate(mutex$d, wasmJson$c, 16)
                .then((wasm) => {
                wasmCache$d = wasm;
                return wasmCache$d.calculate(data);
            });
        }
        try {
            const hash = wasmCache$d.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD4 hash instance
     */
    function createMD4() {
        return WASMInterface(wasmJson$c, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$b = "md5";
    var data$b = "AGFzbQEAAAABEgRgAAF/YAAAYAF/AGACf38BfwMHBgABAgMBAgQFAXABAQEFBAEBAgIGCAF/AUGgiQULB1MGBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAELSGFzaF9VcGRhdGUAAgpIYXNoX0ZpbmFsAAQOSGFzaF9DYWxjdWxhdGUABQqsFgYFAEGACAstAEEAQv6568XpjpWZEDcCkIgBQQBCgcaUupbx6uZvNwKIiAFBAEIANwKAiAEL6AIBA39BAEEAKAKAiAEiASAAakH/////AXEiAjYCgIgBQQAoAoSIASEDAkAgAiABTw0AQQAgA0EBaiIDNgKEiAELQQAgAyAAQR12ajYChIgBAkACQAJAAkACQAJAIAFBP3EiAw0AQYAIIQIMAQtBwAAgA2siAiAASw0BIANBGGohA0EAIQEDQCADIAFqQYCIAWogAUGACGotAAA6AAAgAyABQQFqIgFqQdgARw0AC0GYiAFBwAAQAxogACACayEAIAJBgAhqIQILIABBwABPDQEgACEDDAILIABFDQJBACEBIANBmIgBakEALQCACDoAACAAQQFGDQIgA0GZiAFqIQMgAEF/aiECA0AgAyABaiABQYEIai0AADoAACACIAFBAWoiAUcNAAwDCwsgAEE/cSEDIAIgAEFAcRADIQILIANFDQBBACEBA0AgAUGYiAFqIAIgAWotAAA6AAAgAyABQQFqIgFHDQALCwu0EAEZf0EAKAKUiAEhAkEAKAKQiAEhA0EAKAKMiAEhBEEAKAKIiAEhBQNAIABBCGooAgAiBiAAQRhqKAIAIgcgAEEoaigCACIIIABBOGooAgAiCSAAQTxqKAIAIgogAEEMaigCACILIABBHGooAgAiDCAAQSxqKAIAIg0gDCALIAogDSAJIAggByADIAZqIAIgAEEEaigCACIOaiAFIAQgAiADc3EgAnNqIAAoAgAiD2pB+Miqu31qQQd3IARqIhAgBCADc3EgA3NqQdbunsZ+akEMdyAQaiIRIBAgBHNxIARzakHb4YGhAmpBEXcgEWoiEmogAEEUaigCACITIBFqIABBEGooAgAiFCAQaiAEIAtqIBIgESAQc3EgEHNqQe6d9418akEWdyASaiIQIBIgEXNxIBFzakGvn/Crf2pBB3cgEGoiESAQIBJzcSASc2pBqoyfvARqQQx3IBFqIhIgESAQc3EgEHNqQZOMwcF6akERdyASaiIVaiAAQSRqKAIAIhYgEmogAEEgaigCACIXIBFqIAwgEGogFSASIBFzcSARc2pBgaqaampBFncgFWoiECAVIBJzcSASc2pB2LGCzAZqQQd3IBBqIhEgECAVc3EgFXNqQa/vk9p4akEMdyARaiISIBEgEHNxIBBzakGxt31qQRF3IBJqIhVqIABBNGooAgAiGCASaiAAQTBqKAIAIhkgEWogDSAQaiAVIBIgEXNxIBFzakG+r/PKeGpBFncgFWoiECAVIBJzcSASc2pBoqLA3AZqQQd3IBBqIhEgECAVc3EgFXNqQZPj4WxqQQx3IBFqIhUgESAQc3EgEHNqQY6H5bN6akERdyAVaiISaiAHIBVqIA4gEWogCiAQaiASIBUgEXNxIBFzakGhkNDNBGpBFncgEmoiECAScyAVcSASc2pB4sr4sH9qQQV3IBBqIhEgEHMgEnEgEHNqQcDmgoJ8akEJdyARaiISIBFzIBBxIBFzakHRtPmyAmpBDncgEmoiFWogCCASaiATIBFqIA8gEGogFSAScyARcSASc2pBqo/bzX5qQRR3IBVqIhAgFXMgEnEgFXNqQd2gvLF9akEFdyAQaiIRIBBzIBVxIBBzakHTqJASakEJdyARaiISIBFzIBBxIBFzakGBzYfFfWpBDncgEmoiFWogCSASaiAWIBFqIBQgEGogFSAScyARcSASc2pByPfPvn5qQRR3IBVqIhAgFXMgEnEgFXNqQeabh48CakEFdyAQaiIRIBBzIBVxIBBzakHWj9yZfGpBCXcgEWoiEiARcyAQcSARc2pBh5vUpn9qQQ53IBJqIhVqIAYgEmogGCARaiAXIBBqIBUgEnMgEXEgEnNqQe2p6KoEakEUdyAVaiIQIBVzIBJxIBVzakGF0o/PempBBXcgEGoiESAQcyAVcSAQc2pB+Me+Z2pBCXcgEWoiEiARcyAQcSARc2pB2YW8uwZqQQ53IBJqIhVqIBcgEmogEyARaiAZIBBqIBUgEnMgEXEgEnNqQYqZqel4akEUdyAVaiIQIBVzIhUgEnNqQcLyaGpBBHcgEGoiESAVc2pBge3Hu3hqQQt3IBFqIhIgEXMiGiAQc2pBosL17AZqQRB3IBJqIhVqIBQgEmogDiARaiAJIBBqIBUgGnNqQYzwlG9qQRd3IBVqIhAgFXMiFSASc2pBxNT7pXpqQQR3IBBqIhEgFXNqQamf+94EakELdyARaiISIBFzIgkgEHNqQeCW7bV/akEQdyASaiIVaiAPIBJqIBggEWogCCAQaiAVIAlzakHw+P71e2pBF3cgFWoiECAVcyIVIBJzakHG/e3EAmpBBHcgEGoiESAVc2pB+s+E1X5qQQt3IBFqIhIgEXMiCCAQc2pBheG8p31qQRB3IBJqIhVqIBkgEmogFiARaiAHIBBqIBUgCHNqQYW6oCRqQRd3IBVqIhEgFXMiECASc2pBuaDTzn1qQQR3IBFqIhIgEHNqQeWz7rZ+akELdyASaiIVIBJzIgcgEXNqQfj5if0BakEQdyAVaiIQaiAMIBVqIA8gEmogBiARaiAQIAdzakHlrLGlfGpBF3cgEGoiESAVQX9zciAQc2pBxMSkoX9qQQZ3IBFqIhIgEEF/c3IgEXNqQZf/q5kEakEKdyASaiIQIBFBf3NyIBJzakGnx9DcempBD3cgEGoiFWogCyAQaiAZIBJqIBMgEWogFSASQX9zciAQc2pBucDOZGpBFXcgFWoiESAQQX9zciAVc2pBw7PtqgZqQQZ3IBFqIhAgFUF/c3IgEXNqQZKZs/h4akEKdyAQaiISIBFBf3NyIBBzakH96L9/akEPdyASaiIVaiAKIBJqIBcgEGogDiARaiAVIBBBf3NyIBJzakHRu5GseGpBFXcgFWoiECASQX9zciAVc2pBz/yh/QZqQQZ3IBBqIhEgFUF/c3IgEHNqQeDNs3FqQQp3IBFqIhIgEEF/c3IgEXNqQZSGhZh6akEPdyASaiIVaiANIBJqIBQgEWogGCAQaiAVIBFBf3NyIBJzakGho6DwBGpBFXcgFWoiECASQX9zciAVc2pBgv3Nun9qQQZ3IBBqIhEgFUF/c3IgEHNqQbXk6+l7akEKdyARaiISIBBBf3NyIBFzakG7pd/WAmpBD3cgEmoiFSAEaiAWIBBqIBUgEUF/c3IgEnNqQZGnm9x+akEVd2ohBCAVIANqIQMgEiACaiECIBEgBWohBSAAQcAAaiEAIAFBQGoiAQ0AC0EAIAI2ApSIAUEAIAM2ApCIAUEAIAQ2AoyIAUEAIAU2AoiIASAAC6ECAQN/QQAoAoCIASIAQT9xIgFBmIgBakGAAToAAAJAAkACQCABQT9zIgJBB0sNAAJAIAJFDQAgAUGZiAFqIQADQCAAQQA6AAAgAEEBaiEAIAJBf2oiAg0ACwtBwAAhAkGYiAFBwAAQAxpBACEADAELIAJBCEYNASABQQFqIQALIABBj4gBaiEBA0AgASACakEAOgAAIAJBd2ohACACQX9qIQIgAEEASg0AC0EAKAKAiAEhAAtBACAAQRV2OgDTiAFBACAAQQ12OgDSiAFBACAAQQV2OgDRiAFBACAAQQN0IgI6ANCIAUEAIAI2AoCIAUEAQQAoAoSIATYC1IgBQZiIAUHAABADGkEAQQApAoiIATcDgAhBAEEAKQKQiAE3A4gICzMAQQBC/rnrxemOlZkQNwKQiAFBAEKBxpS6lvHq5m83AoiIAUEAQgA3AoCIASAAEAIQBAs=";
    var wasmJson$b = {
    	name: name$b,
    	data: data$b
    };

    const mutex$c = new Mutex();
    let wasmCache$c = null;
    /**
     * Calculates MD5 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md5(data) {
        if (wasmCache$c === null) {
            return lockedCreate(mutex$c, wasmJson$b, 16)
                .then((wasm) => {
                wasmCache$c = wasm;
                return wasmCache$c.calculate(data);
            });
        }
        try {
            const hash = wasmCache$c.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD5 hash instance
     */
    function createMD5() {
        return WASMInterface(wasmJson$b, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$a = "sha1";
    var data$a = "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";
    var wasmJson$a = {
    	name: name$a,
    	data: data$a
    };

    const mutex$b = new Mutex();
    let wasmCache$b = null;
    /**
     * Calculates SHA-1 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha1(data) {
        if (wasmCache$b === null) {
            return lockedCreate(mutex$b, wasmJson$a, 20)
                .then((wasm) => {
                wasmCache$b = wasm;
                return wasmCache$b.calculate(data);
            });
        }
        try {
            const hash = wasmCache$b.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-1 hash instance
     */
    function createSHA1() {
        return WASMInterface(wasmJson$a, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    var name$9 = "sha3";
    var data$9 = "AGFzbQEAAAABFARgAAF/YAF/AGACf38AYAN/f38AAwcGAAEBAgEDBAUBcAEBAQUEAQECAgYIAX8BQdCMBQsHUwYGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwABA5IYXNoX0NhbGN1bGF0ZQAFCrgYBgUAQcAJC9cDAEEAQgA3A8CMAUEAQgA3A7iMAUEAQgA3A7CMAUEAQgA3A6iMAUEAQgA3A6CMAUEAQgA3A5iMAUEAQgA3A5CMAUEAQgA3A4iMAUEAQgA3A4CMAUEAQgA3A/iLAUEAQgA3A/CLAUEAQgA3A+iLAUEAQgA3A+CLAUEAQgA3A9iLAUEAQgA3A9CLAUEAQgA3A8iLAUEAQgA3A8CLAUEAQgA3A7iLAUEAQgA3A7CLAUEAQgA3A6iLAUEAQgA3A6CLAUEAQgA3A5iLAUEAQgA3A5CLAUEAQgA3A4iLAUEAQgA3A4CLAUEAQgA3A/iKAUEAQgA3A/CKAUEAQgA3A+iKAUEAQgA3A+CKAUEAQgA3A9iKAUEAQgA3A9CKAUEAQgA3A8iKAUEAQgA3A8CKAUEAQgA3A7iKAUEAQgA3A7CKAUEAQgA3A6iKAUEAQgA3A6CKAUEAQgA3A5iKAUEAQgA3A5CKAUEAQgA3A4iKAUEAQgA3A4CKAUEAQgA3A/iJAUEAQgA3A/CJAUEAQgA3A+iJAUEAQgA3A+CJAUEAQgA3A9iJAUEAQgA3A9CJAUEAQgA3A8iJAUEAQgA3A8CJAUEAQcAMIABBAXRrQQN2NgLMjAFBAEEANgLIjAEL9wEBBn8CQEEAKALIjAEiAUEASA0AQQAgASAAakEAKALMjAEiAnA2AsiMAQJAAkAgAQ0AQcAJIQEMAQsCQCAAIAIgAWsiAyADIABLIgQbIgVFDQAgAUGIiwFqIQZBACEBA0AgBiABaiABQcAJai0AADoAACABQQFqIgEgBUkNAAsLIAQNAUGIiwEgAhADIAAgA2shACADQcAJaiEBCwJAIAAgAkkNAANAIAEgAhADIAEgAmohASAAIAJrIgAgAk8NAAsLIABFDQBBACECQQAhBQNAIAJBiIsBaiABIAJqLQAAOgAAIAAgBUEBaiIFQf8BcSICSw0ACwsLzAsBKH5BAEEAKQPAiQEgACkDAIUiAjcDwIkBQQBBACkDyIkBIAApAwiFIgM3A8iJAUEAQQApA9CJASAAKQMQhSIENwPQiQFBAEEAKQPYiQEgACkDGIUiBTcD2IkBQQBBACkD4IkBIAApAyCFIgY3A+CJAUEAQQApA+iJASAAKQMohSIHNwPoiQFBAEEAKQPwiQEgACkDMIUiCDcD8IkBQQBBACkD+IkBIAApAziFIgk3A/iJAUEAQQApA4CKASAAKQNAhSIKNwOAigECQAJAIAFByABLDQBBACkDkIoBIQtBACkDoIoBIQxBACkDiIoBIQ1BACkDmIoBIQ4MAQtBAEEAKQOIigEgACkDSIUiDTcDiIoBQQBBACkDkIoBIAApA1CFIgs3A5CKAUEAQQApA5iKASAAKQNYhSIONwOYigFBAEEAKQOgigEgACkDYIUiDDcDoIoBIAFB6QBJDQBBAEEAKQOoigEgACkDaIU3A6iKAUEAQQApA7CKASAAKQNwhTcDsIoBQQBBACkDuIoBIAApA3iFNwO4igFBAEEAKQPAigEgACkDgAGFNwPAigEgAUGJAUkNAEEAQQApA8iKASAAKQOIAYU3A8iKAQtBACkD+IoBIQ9BACkD0IoBIRBBACkDqIoBIRFBACkD4IoBIRJBACkDuIoBIRNBACkD8IoBIRRBACkDyIoBIRVBACkDgIsBIRZBACkD2IoBIRdBACkDsIoBIRhBACkD6IoBIRlBACkDwIoBIRpBwH4hAANAIBMgEoUgByALhSAChYUiGyAVIBSFIAkgDIUgBIWFIhxCAYmFIh0gGYUhHiAaIBmFIA6FIAiFIAOFIh8gECAPhSAKIBGFIAWFhSIZQgGJhSIgIASFISEgFyAWhSANIBiFIAaFhSIiIB9CAYmFIh8gE4VCKYkiIyAZIBtCAYmFIgQgGIVCJ4kiG0J/hYMgHCAiQgGJhSITIAqFQjeJIhyFIRkgBiAEhSEkIB8gB4UhJSATIA+FQjiJIiIgICAVhUIPiSImQn+FgyAdIA6FQgqJIhiFIRUgICAJhUIGiSInIAQgF4VCCIkiFyATIBGFQhmJIihCf4WDhSEOIAMgHYUhESAgIBSFQj2JIgkgBCANhUIUiSIPIBMgBYVCHIkiA0J/hYOFIQ0gAyAJQn+FgyAdIBqFQi2JIimFIQogHyALhUIDiSILIA9Cf4WDIAOFIQcgHSAIhUIsiSIdIB8gAoUiAkJ/hYMgBCAWhUIOiSIEhSEGIAIgBEJ/hYMgEyAQhUIViSIThSEFICAgDIVCK4kiICAEIBNCf4WDhSEEIBMgIEJ/hYMgHYUhAyAeQgKJIhYgI0J/hYMgG4UhFCAYICVCJIkiHkJ/hYMgJEIbiSIkhSETIBFCAYkiDCAfIBKFQhKJIh9Cf4WDIBeFIREgKSALQn+FgyAPhSEIICMgIUI+iSIhIBZCf4WDhSEPIB4gJiAYQn+Fg4UhGiAfICcgDEJ/hYOFIRggCyAJIClCf4WDhSEJICAgHUJ/hYMgAEHACWopAwCFIAKFIQIgJiAkICJCf4WDhSIdIRAgISAbIBxCf4WDhSIgIRIgKCAnQn+FgyAMhSIjIQsgHyAXQn+FgyAohSIfIQwgHCAhQn+FgyAWhSIbIRYgHiAkQn+FgyAihSIcIRcgAEEIaiIADQALQQAgGTcD6IoBQQAgGjcDwIoBQQAgDjcDmIoBQQAgCDcD8IkBQQAgAzcDyIkBQQAgGzcDgIsBQQAgHDcD2IoBQQAgGDcDsIoBQQAgDTcDiIoBQQAgBjcD4IkBQQAgFDcD8IoBQQAgFTcDyIoBQQAgHzcDoIoBQQAgCTcD+IkBQQAgBDcD0IkBQQAgIDcD4IoBQQAgEzcDuIoBQQAgIzcDkIoBQQAgBzcD6IkBQQAgAjcDwIkBQQAgDzcD+IoBQQAgHTcD0IoBQQAgETcDqIoBQQAgCjcDgIoBQQAgBTcD2IkBC9oBAQV/QeQAQQAoAsyMASIBQQF2ayECAkBBACgCyIwBIgNBAEgNACABIQQCQCABIANGDQAgA0GIiwFqIQVBACEDA0AgBSADakEAOgAAIANBAWoiAyABQQAoAsiMASIEa0kNAAsLIARBiIsBaiIDIAMtAAAgAHI6AAAgAUGHiwFqIgMgAy0AAEGAAXI6AABBiIsBIAEQA0EAQYCAgIB4NgLIjAELAkAgAkECdiIBRQ0AQQAhAwNAIANBwAlqIANBwIkBaigCADYCACADQQRqIQMgAUF/aiIBDQALCwuzBQEDf0EAQgA3A8CMAUEAQgA3A7iMAUEAQgA3A7CMAUEAQgA3A6iMAUEAQgA3A6CMAUEAQgA3A5iMAUEAQgA3A5CMAUEAQgA3A4iMAUEAQgA3A4CMAUEAQgA3A/iLAUEAQgA3A/CLAUEAQgA3A+iLAUEAQgA3A+CLAUEAQgA3A9iLAUEAQgA3A9CLAUEAQgA3A8iLAUEAQgA3A8CLAUEAQgA3A7iLAUEAQgA3A7CLAUEAQgA3A6iLAUEAQgA3A6CLAUEAQgA3A5iLAUEAQgA3A5CLAUEAQgA3A4iLAUEAQgA3A4CLAUEAQgA3A/iKAUEAQgA3A/CKAUEAQgA3A+iKAUEAQgA3A+CKAUEAQgA3A9iKAUEAQgA3A9CKAUEAQgA3A8iKAUEAQgA3A8CKAUEAQgA3A7iKAUEAQgA3A7CKAUEAQgA3A6iKAUEAQgA3A6CKAUEAQgA3A5iKAUEAQgA3A5CKAUEAQgA3A4iKAUEAQgA3A4CKAUEAQgA3A/iJAUEAQgA3A/CJAUEAQgA3A+iJAUEAQgA3A+CJAUEAQgA3A9iJAUEAQgA3A9CJAUEAQgA3A8iJAUEAQgA3A8CJAUEAQcAMIAFBAXRrQQN2NgLMjAFBAEEANgLIjAEgABACQeQAQQAoAsyMASIBQQF2ayEDAkBBACgCyIwBIgBBAEgNACABIQQCQCABIABGDQAgAEGIiwFqIQVBACEAA0AgBSAAakEAOgAAIABBAWoiACABQQAoAsiMASIEa0kNAAsLIARBiIsBaiIAIAAtAAAgAnI6AAAgAUGHiwFqIgAgAC0AAEGAAXI6AABBiIsBIAEQA0EAQYCAgIB4NgLIjAELAkAgA0ECdiIBRQ0AQQAhAANAIABBwAlqIABBwIkBaigCADYCACAAQQRqIQAgAUF/aiIBDQALCwsLyAEBAEGACAvAAQEAAAAAAAAAgoAAAAAAAACKgAAAAAAAgACAAIAAAACAi4AAAAAAAAABAACAAAAAAIGAAIAAAACACYAAAAAAAICKAAAAAAAAAIgAAAAAAAAACYAAgAAAAAAKAACAAAAAAIuAAIAAAAAAiwAAAAAAAICJgAAAAAAAgAOAAAAAAACAAoAAAAAAAICAAAAAAAAAgAqAAAAAAAAACgAAgAAAAICBgACAAAAAgICAAAAAAACAAQAAgAAAAAAIgACAAAAAgA==";
    var wasmJson$9 = {
    	name: name$9,
    	data: data$9
    };

    const mutex$a = new Mutex();
    let wasmCache$a = null;
    function validateBits$1(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates SHA-3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function sha3(data, bits = 512) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$a === null || wasmCache$a.hashLength !== hashLength) {
            return lockedCreate(mutex$a, wasmJson$9, hashLength)
                .then((wasm) => {
                wasmCache$a = wasm;
                return wasmCache$a.calculate(data, bits, 0x06);
            });
        }
        try {
            const hash = wasmCache$a.calculate(data, bits, 0x06);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-3 hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createSHA3(bits = 512) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$9, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x06),
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    const mutex$9 = new Mutex();
    let wasmCache$9 = null;
    function validateBits(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates Keccak hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function keccak(data, bits = 512) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$9 === null || wasmCache$9.hashLength !== hashLength) {
            return lockedCreate(mutex$9, wasmJson$9, hashLength)
                .then((wasm) => {
                wasmCache$9 = wasm;
                return wasmCache$9.calculate(data, bits, 0x01);
            });
        }
        try {
            const hash = wasmCache$9.calculate(data, bits, 0x01);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Keccak hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createKeccak(bits = 512) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$9, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x01),
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$8 = "sha256";
    var data$8 = "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cSAKc2ogE0EadyATQRV3cyATQQd3c2pB59KkoQFqIhUgAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAZaiIDaiIUaiAjIBNqICYgEmogFCATIBJzcSAScyAKaiAiaiAUQRp3IBRBFXdzIBRBB3dzakGFldy9AmoiGSADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBtqIgRqIgogFCATc3EgE3NqIApBGncgCkEVd3MgCkEHd3NqQbjC7PACaiIbIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGmoiAmoiEiAKIBRzcSAUc2ogEkEadyASQRV3cyASQQd3c2pB/Nux6QRqIhogAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAYaiIDaiITIBIgCnNxIApzaiATQRp3IBNBFXdzIBNBB3dzakGTmuCZBWoiGCADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBVqIgRqIhRqICUgE2ogKCASaiAKICRqIBQgEyASc3EgEnNqIBRBGncgFEEVd3MgFEEHd3NqQdTmqagGaiIVIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGWoiAmoiCiAUIBNzcSATc2ogCkEadyAKQRV3cyAKQQd3c2pBu5WoswdqIhkgAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAbaiIDaiISIAogFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakGukouOeGoiGyADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBpqIgRqIhMgEiAKc3EgCnNqIBNBGncgE0EVd3MgE0EHd3NqQYXZyJN5aiIaIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGGoiAmoiFGogLiATaiAqIBJqIC0gCmogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pBodH/lXpqIhggAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAVaiIDaiIKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakHLzOnAemoiFSADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBlqIgRqIhIgCiAU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";
    var wasmJson$8 = {
    	name: name$8,
    	data: data$8
    };

    const mutex$8 = new Mutex();
    let wasmCache$8 = null;
    /**
     * Calculates SHA-2 (SHA-224) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha224(data) {
        if (wasmCache$8 === null) {
            return lockedCreate(mutex$8, wasmJson$8, 28)
                .then((wasm) => {
                wasmCache$8 = wasm;
                return wasmCache$8.calculate(data, 224);
            });
        }
        try {
            const hash = wasmCache$8.calculate(data, 224);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-224) hash instance
     */
    function createSHA224() {
        return WASMInterface(wasmJson$8, 28).then((wasm) => {
            wasm.init(224);
            const obj = {
                init: () => { wasm.init(224); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 28,
            };
            return obj;
        });
    }

    const mutex$7 = new Mutex();
    let wasmCache$7 = null;
    /**
     * Calculates SHA-2 (SHA-256) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha256(data) {
        if (wasmCache$7 === null) {
            return lockedCreate(mutex$7, wasmJson$8, 32)
                .then((wasm) => {
                wasmCache$7 = wasm;
                return wasmCache$7.calculate(data, 256);
            });
        }
        try {
            const hash = wasmCache$7.calculate(data, 256);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-256) hash instance
     */
    function createSHA256() {
        return WASMInterface(wasmJson$8, 32).then((wasm) => {
            wasm.init(256);
            const obj = {
                init: () => { wasm.init(256); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    var name$7 = "sha512";
    var data$7 = "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";
    var wasmJson$7 = {
    	name: name$7,
    	data: data$7
    };

    const mutex$6 = new Mutex();
    let wasmCache$6 = null;
    /**
     * Calculates SHA-2 (SHA-384) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha384(data) {
        if (wasmCache$6 === null) {
            return lockedCreate(mutex$6, wasmJson$7, 48)
                .then((wasm) => {
                wasmCache$6 = wasm;
                return wasmCache$6.calculate(data, 384);
            });
        }
        try {
            const hash = wasmCache$6.calculate(data, 384);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-384) hash instance
     */
    function createSHA384() {
        return WASMInterface(wasmJson$7, 48).then((wasm) => {
            wasm.init(384);
            const obj = {
                init: () => { wasm.init(384); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: 48,
            };
            return obj;
        });
    }

    const mutex$5 = new Mutex();
    let wasmCache$5 = null;
    /**
     * Calculates SHA-2 (SHA-512) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha512(data) {
        if (wasmCache$5 === null) {
            return lockedCreate(mutex$5, wasmJson$7, 64)
                .then((wasm) => {
                wasmCache$5 = wasm;
                return wasmCache$5.calculate(data, 512);
            });
        }
        try {
            const hash = wasmCache$5.calculate(data, 512);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-512) hash instance
     */
    function createSHA512() {
        return WASMInterface(wasmJson$7, 64).then((wasm) => {
            wasm.init(512);
            const obj = {
                init: () => { wasm.init(512); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name$6 = "xxhash32";
    var data$6 = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwYFAAEBAgMEBQFwAQEBBQQBAQICBggBfwFB0IgFCwdTBgZtZW1vcnkCAA5IYXNoX0dldEJ1ZmZlcgAACUhhc2hfSW5pdAABC0hhc2hfVXBkYXRlAAIKSGFzaF9GaW5hbAADDkhhc2hfQ2FsY3VsYXRlAAQK/QgFBQBBgAgLTQBBACAANgK4iAFBAEIANwOIiAFBACAAQfeUr694ajYCsIgBQQAgAEGoiI2hAmo2AqCIAUEAIABBz4yijgZqNgLAiAFBAEEANgKAiAELhQUBB38CQCAARQ0AQQAhAUEAQQApA4iIASAArXw3A4iIAQJAQQAoAoCIASICIABqQQ9LDQADQCACIAFqQZCIAWogAUGACGotAAA6AAAgACABQQFqIgFHDQALQQAgAiABajYCgIgBDwsgAEHwB2ohAwJAAkAgAg0AQQAoAsCIASEEQQAoAriIASEFQQAoArCIASEGQQAoAqCIASEHQYAIIQEMAQtBgAghAQJAIAJBD0sNAEGACCEBA0AgAkGQiAFqIAEtAAA6AAAgAUEBaiEBIAJBD0khBCACQQFqIgUhAiAEDQALQQAgBTYCgIgBC0EAQQAoApCIAUH3lK+veGxBACgCoIgBakENd0Gx893xeWwiBzYCoIgBQQBBACgClIgBQfeUr694bEEAKAKwiAFqQQ13QbHz3fF5bCIGNgKwiAFBAEEAKAKYiAFB95Svr3hsQQAoAriIAWpBDXdBsfPd8XlsIgU2AriIAUEAQQAoApyIAUH3lK+veGxBACgCwIgBakENd0Gx893xeWwiBDYCwIgBCyAAQYAIaiEAAkAgASADSw0AA0AgASgCAEH3lK+veGwgB2pBDXdBsfPd8XlsIQcgAUEMaigCAEH3lK+veGwgBGpBDXdBsfPd8XlsIQQgAUEIaigCAEH3lK+veGwgBWpBDXdBsfPd8XlsIQUgAUEEaigCAEH3lK+veGwgBmpBDXdBsfPd8XlsIQYgAUEQaiIBIANNDQALC0EAIQJBACAGNgKwiAFBACAHNgKgiAFBACAFNgK4iAFBACAENgLAiAFBACAAIAFrIgA2AoCIASAARQ0AA0AgAkGQiAFqIAEgAmotAAA6AAAgACACQQFqIgJHDQALCwvLAgIBfgZ/QQApA4iIASIApyEBAkACQCAAQhBUDQBBACgCsIgBQQd3QQAoAqCIAUEBd2pBACgCuIgBQQx3akEAKALAiAFBEndqIQIMAQtBACgCuIgBQbHP2bIBaiECCyACIAFqIQJBkIgBIQFBACgCgIgBIgNBkIgBaiEEAkAgA0EESA0AQZCIASEFA0AgBSgCAEG93MqVfGwgAmpBEXdBr9bTvgJsIQIgBUEIaiEGIAVBBGoiASEFIAYgBE0NAAsLAkAgASAERg0AIANBkIgBaiEFA0AgAS0AAEGxz9myAWwgAmpBC3dBsfPd8XlsIQIgBSABQQFqIgFHDQALC0EAIAJBD3YgAnNB95Svr3hsIgFBDXYgAXNBvdzKlXxsIgFBEHYiAjoAgQhBACABQRh2OgCACEEAIAIgAXMiAToAgwhBACABQQh2OgCCCAtTAEEAIAE2AriIAUEAQgA3A4iIAUEAIAFB95Svr3hqNgKwiAFBACABQaiIjaECajYCoIgBQQAgAUHPjKKOBmo2AsCIAUEAQQA2AoCIASAAEAIQAws=";
    var wasmJson$6 = {
    	name: name$6,
    	data: data$6
    };

    const mutex$4 = new Mutex();
    let wasmCache$4 = null;
    function validateSeed$1(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be a valid 32-bit long unsigned integer.');
        }
        return null;
    }
    /**
     * Calculates xxHash32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash32(data, seed = 0) {
        if (validateSeed$1(seed)) {
            return Promise.reject(validateSeed$1(seed));
        }
        if (wasmCache$4 === null) {
            return lockedCreate(mutex$4, wasmJson$6, 4)
                .then((wasm) => {
                wasmCache$4 = wasm;
                return wasmCache$4.calculate(data, seed);
            });
        }
        try {
            const hash = wasmCache$4.calculate(data, seed);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash32 hash instance
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash32(seed = 0) {
        if (validateSeed$1(seed)) {
            return Promise.reject(validateSeed$1(seed));
        }
        return WASMInterface(wasmJson$6, 4).then((wasm) => {
            wasm.init(seed);
            const obj = {
                init: () => { wasm.init(seed); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 16,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$5 = "xxhash64";
    var data$5 = "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";
    var wasmJson$5 = {
    	name: name$5,
    	data: data$5
    };

    const mutex$3 = new Mutex();
    let wasmCache$3 = null;
    const seedBuffer = new ArrayBuffer(8);
    function validateSeed(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be given as two valid 32-bit long unsigned integer (lo + high).');
        }
        return null;
    }
    function writeSeed(arr, low, high) {
        // write in little-endian format
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
    }
    /**
     * Calculates xxHash64 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash64(data, seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
            return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
            return Promise.reject(validateSeed(seedHigh));
        }
        if (wasmCache$3 === null) {
            return lockedCreate(mutex$3, wasmJson$5, 8)
                .then((wasm) => {
                wasmCache$3 = wasm;
                writeSeed(seedBuffer, seedLow, seedHigh);
                wasmCache$3.writeMemory(new Uint8Array(seedBuffer));
                return wasmCache$3.calculate(data);
            });
        }
        try {
            writeSeed(seedBuffer, seedLow, seedHigh);
            wasmCache$3.writeMemory(new Uint8Array(seedBuffer));
            const hash = wasmCache$3.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash64 hash instance
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash64(seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
            return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
            return Promise.reject(validateSeed(seedHigh));
        }
        return WASMInterface(wasmJson$5, 8).then((wasm) => {
            const instanceBuffer = new ArrayBuffer(8);
            writeSeed(instanceBuffer, seedLow, seedHigh);
            wasm.writeMemory(new Uint8Array(instanceBuffer));
            wasm.init();
            const obj = {
                init: () => {
                    wasm.writeMemory(new Uint8Array(instanceBuffer));
                    wasm.init();
                    return obj;
                },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 32,
                digestSize: 8,
            };
            return obj;
        });
    }

    var name$4 = "ripemd160";
    var data$4 = "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";
    var wasmJson$4 = {
    	name: name$4,
    	data: data$4
    };

    const mutex$2 = new Mutex();
    let wasmCache$2 = null;
    /**
     * Calculates RIPEMD-160 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function ripemd160(data) {
        if (wasmCache$2 === null) {
            return lockedCreate(mutex$2, wasmJson$4, 20)
                .then((wasm) => {
                wasmCache$2 = wasm;
                return wasmCache$2.calculate(data);
            });
        }
        try {
            const hash = wasmCache$2.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new RIPEMD-160 hash instance
     */
    function createRIPEMD160() {
        return WASMInterface(wasmJson$4, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    function calculateKeyBuffer(hasher, key) {
        const { blockSize } = hasher;
        const buf = getUInt8Buffer(key);
        if (buf.length > blockSize) {
            hasher.update(buf);
            const uintArr = hasher.digest('binary');
            hasher.init();
            return uintArr;
        }
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    }
    function calculateHmac(hasher, key) {
        hasher.init();
        const { blockSize } = hasher;
        const keyBuf = calculateKeyBuffer(hasher, key);
        const keyBuffer = new Uint8Array(blockSize);
        keyBuffer.set(keyBuf);
        const opad = new Uint8Array(blockSize);
        for (let i = 0; i < blockSize; i++) {
            const v = keyBuffer[i];
            opad[i] = v ^ 0x5C;
            keyBuffer[i] = v ^ 0x36;
        }
        hasher.update(keyBuffer);
        const obj = {
            init: () => {
                hasher.init();
                hasher.update(keyBuffer);
                return obj;
            },
            update: (data) => {
                hasher.update(data);
                return obj;
            },
            digest: ((outputType) => {
                const uintArr = hasher.digest('binary');
                hasher.init();
                hasher.update(opad);
                hasher.update(uintArr);
                return hasher.digest(outputType);
            }),
            blockSize: hasher.blockSize,
            digestSize: hasher.digestSize,
        };
        return obj;
    }
    /**
     * Calculates HMAC hash
     * @param hash Hash algorithm to use. It has to be the return value of a function like createSHA1()
     * @param key Key (string, Buffer or TypedArray)
     */
    function createHMAC(hash, key) {
        if (!hash || !hash.then) {
            throw new Error('Invalid hash function is provided! Usage: createHMAC(createMD5(), "key").');
        }
        return hash.then((hasher) => calculateHmac(hasher, key));
    }

    function calculatePBKDF2(digest, salt, iterations, hashLength, outputType) {
        return __awaiter(this, void 0, void 0, function* () {
            const DK = new Uint8Array(hashLength);
            const block1 = new Uint8Array(salt.length + 4);
            const block1View = new DataView(block1.buffer);
            const saltBuffer = getUInt8Buffer(salt);
            const saltUIntBuffer = new Uint8Array(saltBuffer.buffer, saltBuffer.byteOffset, saltBuffer.length);
            block1.set(saltUIntBuffer);
            let destPos = 0;
            const hLen = digest.digestSize;
            const l = Math.ceil(hashLength / hLen);
            let T = null;
            let U = null;
            for (let i = 1; i <= l; i++) {
                block1View.setUint32(salt.length, i);
                digest.init();
                digest.update(block1);
                T = digest.digest('binary');
                U = T.slice();
                for (let j = 1; j < iterations; j++) {
                    digest.init();
                    digest.update(U);
                    U = digest.digest('binary');
                    for (let k = 0; k < hLen; k++) {
                        T[k] ^= U[k];
                    }
                }
                DK.set(T.subarray(0, hashLength - destPos), destPos);
                destPos += hLen;
            }
            if (outputType === 'binary') {
                return DK;
            }
            const digestChars = new Uint8Array(hashLength * 2);
            return getDigestHex(digestChars, DK, hashLength);
        });
    }
    const validateOptions$2 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.hashFunction || !options.hashFunction.then) {
            throw new Error('Invalid hash function is provided! Usage: pbkdf2("password", "salt", 1000, 32, createSHA1()).');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Generates a new PBKDF2 hash for the supplied password
     */
    function pbkdf2(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$2(options);
            const hmac = yield createHMAC(options.hashFunction, options.password);
            return calculatePBKDF2(hmac, options.salt, options.iterations, options.hashLength, options.outputType);
        });
    }

    var name$3 = "scrypt";
    var data$3 = "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hTcDKCACIAsgBEG4f2opAwCFNwMwIAIgDCAEQUBqKQMAhTcDOCACEAQgASACKQMANwMAIAFBCGogAikDCDcDACABQRBqIAIpAxA3AwAgAUEYaiACKQMYNwMAIAFBIGogAikDIDcDACABQShqIAIpAyg3AwAgAUEwaiACKQMwNwMAIAFBOGogAikDODcDACACIAIpAwAgBEFIaikDAIU3AwAgAiACKQMIIARBUGopAwCFNwMIIAIgAikDECAEQVhqKQMAhTcDECACIAIpAxggBEFgaikDAIU3AxggAiACKQMgIARBaGopAwCFNwMgIAIgAikDKCAEQXBqKQMAhTcDKCACIAIpAzAgBEF4aikDAIU3AzAgAiACKQM4IAQpAwCFNwM4IAIQBCABIA5qIgMgAikDADcDACADQQhqIAIpAwg3AwAgA0EQaiACKQMQNwMAIANBGGogAikDGDcDACADQSBqIAIpAyA3AwAgA0EoaiACKQMoNwMAIANBMGogAikDMDcDACADQThqIAIpAzg3AwAgACANTw0BIARBgAFqIQQgAUHAAGohASAAQQJqIQAgAikDOCEMIAIpAzAhCyACKQMoIQogAikDICEJIAIpAxghCCACKQMQIQcgAikDCCEGIAIpAwAhBQwACwsLug0IAX4BfwF+AX8BfgF/AX4SfyAAIAAoAgQgACkDKCIBQiCIpyICIAApAzgiA0IgiKciBGpBB3cgACkDCCIFQiCIp3MiBiAEakEJdyAAKQMYIgdCIIincyIIIAZqQQ13IAJzIgkgB6ciCiABpyILakEHdyADp3MiAiALakEJdyAFp3MiDCACakENdyAKcyINIAxqQRJ3IAtzIg4gACkDACIBQiCIpyIPIAApAxAiA0IgiKciEGpBB3cgACkDICIFQiCIp3MiC2pBB3dzIgogCSAIakESdyAEcyIRIAJqQQd3IAApAzAiB6ciCSABpyISakEHdyADp3MiBCASakEJdyAFp3MiEyAEakENdyAJcyIUcyIJIBFqQQl3IAsgEGpBCXcgB0IgiKdzIhVzIhYgCWpBDXcgAnMiFyAWakESdyARcyIRakEHdyAGIBQgE2pBEncgEnMiEmpBB3cgFSALakENdyAPcyIUcyICIBJqQQl3IAxzIg8gAmpBDXcgBnMiGHMiBiARakEJdyAIIA0gFCAVakESdyAQcyIQIARqQQd3cyIMIBBqQQl3cyIIcyIVIAZqQQ13IApzIhQgDCAKIA5qQQl3IBNzIhMgCmpBDXcgC3MiGSATakESdyAOcyIKakEHdyAXcyILIApqQQl3IA9zIg4gC2pBDXcgDHMiFyAOakESdyAKcyINIAIgCCAMakENdyAEcyIMIAhqQRJ3IBBzIghqQQd3IBlzIgpqQQd3cyIEIBQgFWpBEncgEXMiECALakEHdyAJIBggD2pBEncgEnMiEWpBB3cgDHMiDCARakEJdyATcyISIAxqQQ13IAlzIg9zIgkgEGpBCXcgCiAIakEJdyAWcyITcyIWIAlqQQ13IAtzIhQgFmpBEncgEHMiEGpBB3cgBiAPIBJqQRJ3IBFzIhFqQQd3IBMgCmpBDXcgAnMiC3MiAiARakEJdyAOcyIOIAJqQQ13IAZzIhhzIgYgEGpBCXcgFSAXIAsgE2pBEncgCHMiCCAMakEHd3MiCyAIakEJd3MiE3MiFSAGakENdyAEcyIXIAsgBCANakEJdyAScyISIARqQQ13IApzIhkgEmpBEncgDXMiBGpBB3cgFHMiCiAEakEJdyAOcyIPIApqQQ13IAtzIhQgD2pBEncgBHMiDSACIBMgC2pBDXcgDHMiDCATakESdyAIcyIIakEHdyAZcyILakEHd3MiBCAXIBVqQRJ3IBBzIhAgCmpBB3cgCSAYIA5qQRJ3IBFzIg5qQQd3IAxzIgwgDmpBCXcgEnMiESAMakENdyAJcyIXcyIJIBBqQQl3IAsgCGpBCXcgFnMiEnMiEyAJakENdyAKcyIYIBNqQRJ3IBBzIhBqQQd3IAYgFyARakESdyAOcyIKakEHdyASIAtqQQ13IAJzIhdzIgIgCmpBCXcgD3MiDiACakENdyAGcyIWcyIGIAkgFiAOakESdyAKcyIWakEHdyAVIBQgFyASakESdyAIcyIIIAxqQQd3cyIKIAhqQQl3cyISIApqQQ13IAxzIg9zIgwgFmpBCXcgBCANakEJdyARcyIRcyIVIAxqQQ13IAlzIhQgFWpBEncgFnMiCWpBB3cgAiAPIBJqQRJ3IAhzIghqQQd3IBEgBGpBDXcgC3MiD3MiCyAIakEJdyATcyITIAtqQQ13IAJzIhdzIhZqNgIEIAAgACgCCCAWIAlqQQl3IAogDyARakESdyANcyIRakEHdyAYcyICIBFqQQl3IA5zIg5zIg9qNgIIIAAgACgCDCAPIBZqQQ13IAZzIg1qNgIMIAAgACgCECAGIBBqQQl3IBJzIhIgDiACakENdyAKcyIYIBcgE2pBEncgCHMiCiAMakEHd3MiCCAKakEJd3MiFiAIakENdyAMcyIMajYCECAAIAAoAgAgDSAPakESdyAJc2o2AgAgACAAKAIUIAwgFmpBEncgCnNqNgIUIAAgACgCGCAIajYCGCAAIAAoAhwgFmo2AhwgACAAKAIgIBIgBmpBDXcgBHMiCSAYIA5qQRJ3IBFzIgYgC2pBB3dzIgogBmpBCXcgFXMiBGo2AiAgACAAKAIkIAQgCmpBDXcgC3MiC2o2AiQgACAAKAIoIAsgBGpBEncgBnNqNgIoIAAgACgCLCAKajYCLCAAIAAoAjAgCSASakESdyAQcyIGIAJqQQd3IBRzIgtqNgIwIAAgACgCNCALIAZqQQl3IBNzIgpqNgI0IAAgACgCOCAKIAtqQQ13IAJzIgJqNgI4IAAgACgCPCACIApqQRJ3IAZzajYCPAtyAwF/AX4CfwJAIAJFDQBBACgCiAgiAyAAIAGtIgQgAyAAQQd0IgUgAmxqIgMgAyAFIAFsaiIGEAIgAkEBRg0AIAJBf2ohASAFIQIDQEEAKAKICCACaiAAIAQgAyAGEAIgAiAFaiECIAFBf2oiAQ0ACwsL";
    var wasmJson$3 = {
    	name: name$3,
    	data: data$3
    };

    function scryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, blockSize, parallelism, hashLength, } = options;
            const SHA256Hasher = createSHA256();
            const blockData = yield pbkdf2({
                password: options.password,
                salt: options.salt,
                iterations: 1,
                hashLength: 128 * blockSize * parallelism,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            const scryptInterface = yield WASMInterface(wasmJson$3, 0);
            // last block is for storing the temporary vectors
            const VSize = 128 * blockSize * costFactor;
            const XYSize = 256 * blockSize;
            scryptInterface.setMemorySize(blockData.length + VSize + XYSize);
            scryptInterface.writeMemory(blockData, 0);
            // mix blocks
            scryptInterface.getExports().scrypt(blockSize, costFactor, parallelism);
            const expensiveSalt = scryptInterface
                .getMemory()
                .subarray(0, 128 * blockSize * parallelism);
            const outputData = yield pbkdf2({
                password: options.password,
                salt: expensiveSalt,
                iterations: 1,
                hashLength,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, outputData, hashLength);
            }
            // return binary format
            return outputData;
        });
    }
    // eslint-disable-next-line no-bitwise
    const isPowerOfTwo = (v) => v && !(v & (v - 1));
    const validateOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.blockSize) || options.blockSize < 1) {
            throw new Error('Block size should be a positive number');
        }
        if (!Number.isInteger(options.costFactor)
            || options.costFactor < 2
            || !isPowerOfTwo(options.costFactor)) {
            throw new Error('Cost factor should be a power of 2, greater than 1');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Calculates hash using the scrypt password-based key derivation function
     * @returns Computed hash as a hexadecimal string or as
     *          Uint8Array depending on the outputType option
     */
    function scrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$1(options);
            return scryptInternal(options);
        });
    }

    var name$2 = "bcrypt";
    var data$2 = "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";
    var wasmJson$2 = {
    	name: name$2,
    	data: data$2
    };

    function bcryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, password, salt } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(salt), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 16);
            const shouldEncode = options.outputType === 'encoded' ? 1 : 0;
            bcryptInterface.getExports().bcrypt(passwordBuffer.length, costFactor, shouldEncode);
            const memory = bcryptInterface.getMemory();
            if (options.outputType === 'encoded') {
                return intArrayToString(memory, 60);
            }
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(24 * 2);
                return getDigestHex(digestChars, memory, 24);
            }
            // return binary format
            // the data is copied to allow GC of the original memory buffer
            return memory.slice(0, 24);
        });
    }
    const validateOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.costFactor) || options.costFactor < 4 || options.costFactor > 31) {
            throw new Error('Cost factor should be a number between 4 and 31');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length !== 16) {
            throw new Error('Salt should be 16 bytes long');
        }
        if (options.outputType === undefined) {
            options.outputType = 'encoded';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the bcrypt password-hashing function
     * @returns Computed hash
     */
    function bcrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions(options);
            return bcryptInternal(options);
        });
    }
    const validateHashCharacters = (hash) => {
        if (!/^\$2[axyb]\$[0-3][0-9]\$[./A-Za-z0-9]{53}$/.test(hash)) {
            return false;
        }
        if (hash[4] === '0' && parseInt(hash[5], 10) < 4) {
            return false;
        }
        if (hash[4] === '3' && parseInt(hash[5], 10) > 1) {
            return false;
        }
        return true;
    };
    const validateVerifyOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
        if (options.hash.length !== 60) {
            throw new Error('Hash should be 60 bytes long');
        }
        if (!validateHashCharacters(options.hash)) {
            throw new Error('Invalid hash');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
    };
    /**
     * Verifies password using bcrypt password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function bcryptVerify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions(options);
            const { hash, password } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(hash), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 60);
            return !!bcryptInterface.getExports().bcrypt_verify(passwordBuffer.length);
        });
    }

    var name$1 = "whirlpool";
    var data$1 = "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";
    var wasmJson$1 = {
    	name: name$1,
    	data: data$1
    };

    const mutex$1 = new Mutex();
    let wasmCache$1 = null;
    /**
     * Calculates Whirlpool hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function whirlpool(data) {
        if (wasmCache$1 === null) {
            return lockedCreate(mutex$1, wasmJson$1, 64)
                .then((wasm) => {
                wasmCache$1 = wasm;
                return wasmCache$1.calculate(data);
            });
        }
        try {
            const hash = wasmCache$1.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Whirlpool hash instance
     */
    function createWhirlpool() {
        return WASMInterface(wasmJson$1, 64).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name = "sm3";
    var data = "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";
    var wasmJson = {
    	name: name,
    	data: data
    };

    const mutex = new Mutex();
    let wasmCache = null;
    /**
     * Calculates SM3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sm3(data) {
        if (wasmCache === null) {
            return lockedCreate(mutex, wasmJson, 32)
                .then((wasm) => {
                wasmCache = wasm;
                return wasmCache.calculate(data);
            });
        }
        try {
            const hash = wasmCache.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SM3 hash instance
     */
    function createSM3() {
        return WASMInterface(wasmJson, 32).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    exports.argon2Verify = argon2Verify;
    exports.argon2d = argon2d;
    exports.argon2i = argon2i;
    exports.argon2id = argon2id;
    exports.bcrypt = bcrypt;
    exports.bcryptVerify = bcryptVerify;
    exports.blake2b = blake2b;
    exports.blake2s = blake2s;
    exports.blake3 = blake3;
    exports.crc32 = crc32;
    exports.createBLAKE2b = createBLAKE2b;
    exports.createBLAKE2s = createBLAKE2s;
    exports.createBLAKE3 = createBLAKE3;
    exports.createCRC32 = createCRC32;
    exports.createHMAC = createHMAC;
    exports.createKeccak = createKeccak;
    exports.createMD4 = createMD4;
    exports.createMD5 = createMD5;
    exports.createRIPEMD160 = createRIPEMD160;
    exports.createSHA1 = createSHA1;
    exports.createSHA224 = createSHA224;
    exports.createSHA256 = createSHA256;
    exports.createSHA3 = createSHA3;
    exports.createSHA384 = createSHA384;
    exports.createSHA512 = createSHA512;
    exports.createSM3 = createSM3;
    exports.createWhirlpool = createWhirlpool;
    exports.createXXHash32 = createXXHash32;
    exports.createXXHash64 = createXXHash64;
    exports.keccak = keccak;
    exports.md4 = md4;
    exports.md5 = md5;
    exports.pbkdf2 = pbkdf2;
    exports.ripemd160 = ripemd160;
    exports.scrypt = scrypt;
    exports.sha1 = sha1;
    exports.sha224 = sha224;
    exports.sha256 = sha256;
    exports.sha3 = sha3;
    exports.sha384 = sha384;
    exports.sha512 = sha512;
    exports.sm3 = sm3;
    exports.whirlpool = whirlpool;
    exports.xxhash32 = xxhash32;
    exports.xxhash64 = xxhash64;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{});
