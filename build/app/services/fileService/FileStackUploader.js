var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from 'crypto';
export class FileStackUploader {
    constructor() { }
    create(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { policy, signature } = this.generateSecret();
            const response = yield fetch(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILE_API_KEY}&policy=${policy}&signature=${signature}`, {
                method: 'POST',
                headers: {
                    'Content-Type': file.mimetype,
                },
                body: file.data,
            });
            const data = yield response.json();
            return data.url;
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Array.isArray(file)) {
                    const paths = yield Promise.all(file.map((file) => __awaiter(this, void 0, void 0, function* () { return yield this.create(file); })));
                    return paths.map((path) => ({ path }));
                }
                else {
                    const path = yield this.create(file);
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
            const { policy, signature } = this.generateSecret();
            const fileKey = url.split('com/').pop();
            const response = yield fetch(`https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`, {
                method: 'POST',
                headers: {
                    'Content-Type': file.mimetype,
                },
                body: file.data,
            });
            const data = yield response.json();
            return { path: data.url };
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { policy, signature } = this.generateSecret();
            const fileKey = url.split('com/').pop();
            try {
                yield fetch(`https://www.filestackapi.com/api/file/${fileKey}?policy=${policy}&signature=${signature}`, {
                    method: 'DELETE',
                });
                return { path: url };
            }
            catch (error) {
                throw new Error('');
            }
        });
    }
    generateSecret() {
        const policyObj = {
            expiry: Date.now() + 36000,
            call: [
                'pick',
                'read',
                'stat',
                'write',
                'store',
                'convert',
                'remove',
                'exif',
                'writeUrl',
                'runWorkflow',
            ],
        };
        const policyString = JSON.stringify(policyObj);
        const policy = Buffer.from(policyString).toString('base64');
        const signature = crypto
            .createHmac('sha256', process.env.SECRET_FILE)
            .update(policy)
            .digest('hex');
        return { policy, signature };
    }
}
