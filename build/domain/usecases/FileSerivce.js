var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FileService {
    constructor(uploader) {
        this.uploader = uploader;
        this.upload = this.upload.bind(this);
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploader.upload(file);
        });
    }
    update(url, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploader.update(url, file);
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploader.delete(url);
        });
    }
}
