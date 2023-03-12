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
exports.lowerPointerArray = exports.lift = exports.lower = exports.load = void 0;
let LLVM;
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error
        const llvm = yield Promise.resolve().then(() => __importStar(require("./llvm-wasm.js")));
        yield llvm.ready;
        LLVM = llvm;
        return llvm;
    });
}
exports.load = load;
function lower(str) {
    str += "0";
    const length = Buffer.byteLength(str);
    const ptr = LLVM._malloc(length);
    Buffer.from(LLVM.HEAPU8.buffer, ptr).write(str, "utf-8");
    return ptr;
}
exports.lower = lower;
function lift(ptr) {
    const index = LLVM.HEAPU8.indexOf(0, ptr);
    return Buffer.from(LLVM.HEAPU8.buffer).toString("utf-8", ptr, index);
}
exports.lift = lift;
function lowerPointerArray(elements) {
    const elementCount = elements.length;
    const ptr = LLVM._malloc(elementCount << 2);
    for (let i = 0; i < elementCount; i++) {
        LLVM.HEAPU32[ptr >>> 2] = elements[i];
    }
    return ptr;
}
exports.lowerPointerArray = lowerPointerArray;
//# sourceMappingURL=index.js.map