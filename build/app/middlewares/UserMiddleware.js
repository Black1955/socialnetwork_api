import { UserResponseDTO } from '../DTO/UserResponseDTO.js';
import { FILESTACK } from '../../configs/checkENV.js';
import crypto from 'crypto';
function generateSecret() {
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
        .createHmac('sha256', FILESTACK.FILESTACK_SECRET_FILE)
        .update(policy)
        .digest('hex');
    return { policy, signature };
}
export default function UserMiddleware(req, res, next) {
    try {
        if (res.locals.apiResponse) {
            const apiResponse = res.locals.apiResponse;
            if (apiResponse instanceof UserResponseDTO) {
                const response = apiResponse;
                const user = response.getUser();
                const { policy, signature } = generateSecret();
                if (user.avatar_url.length > 0) {
                    user.avatar_url =
                        user.avatar_url + `?policy=${policy}&signature=${signature}`;
                }
                if (user.back_url.length > 0) {
                    user.back_url =
                        user.back_url + `?policy=${policy}&signature=${signature}`;
                }
                response.setUser(user);
                return res.status(200).json(response.getObject());
            }
            return res.status(200).json(res.locals.apiResponse);
        }
    }
    catch (error) {
        return res.status(500);
    }
}
