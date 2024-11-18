import fs from 'fs';

const certPath = '/etc/letsencrypt/live/ccj.infocom.yzu.edu.tw/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/ccj.infocom.yzu.edu.tw/privkey.pem';

export const getHttpsOptions = () => {
    try {
        if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
            throw new Error(`SSL certificate or key file not found at ${certPath} or ${keyPath}`);
        }
        return {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error loading SSL certificates:', error.message);
        } else {
            console.error('An unknown error occurred while loading SSL certificates.');
        }
        return null; // Returning null indicates that the credentials cannot be read and should be downgraded to HTTP
    }
};
