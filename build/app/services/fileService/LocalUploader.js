var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from 'crypto';
import { writeFile, rm } from 'fs/promises';
export class LocalUploader {
    constructor(url = process.env.LOCAL_STORAGE_PATH) {
        this.url = url;
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Array.isArray(file)) {
                    const files = yield Promise.all(file.map((file) => __awaiter(this, void 0, void 0, function* () {
                        const path = this.generatePath();
                        yield writeFile(path, file.data);
                        return path;
                    })));
                    return files.map((path) => ({ path }));
                }
                else {
                    const path = this.generatePath();
                    yield writeFile(path, file.data);
                    return { path };
                }
            }
            catch (error) {
                throw new Error('');
            }
        });
    }
    update(url, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield writeFile(url, file.data);
                return { path: url };
            }
            catch (error) {
                throw new Error('');
            }
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield rm(url);
                return { path: url };
            }
            catch (error) {
                throw new Error('');
            }
        });
    }
    generatePath() {
        return `${this.url}/${randomUUID()}`;
    }
}
