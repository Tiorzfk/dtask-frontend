import crypto from 'crypto';

const SECRET = process.env.VUE_APP_TOKEN_SECRET;

export const encryptToken = (payload) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET), iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + '.' + encrypted;
};

export const decryptToken = (token) => {
  const [ivBase64, data] = token.split('.');
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET), iv);
  let decrypted = decipher.update(data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};
