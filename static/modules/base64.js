
loadjs.d("./build/modules/base64.js",function(require,module,exports){
"use strict";
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
exports.base64Encode = exports.initialize = void 0;
function initialize() {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.initialize = initialize;
function base64Encode(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        return new Promise((resolve) => {
            reader.onloadend = () => {
                const result = reader.result;
                const blob = new Blob([result.split(",")[1]], {
                    type: data.type + ";base64",
                });
                resolve(blob);
            };
        });
    });
}
exports.base64Encode = base64Encode;

},{});
