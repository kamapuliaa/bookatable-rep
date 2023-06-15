import crypto from 'crypto';
import { Typedef } from '../types/typename';

const KEY = 'asdkfew;r';

export function encodeDesECBStr(textToEncode: string, keyString: string) {
  const key = Buffer.from(keyString.substring(0, 8), 'utf8');
  var cipher = crypto.createCipheriv('des-ecb', key, '');
  var c = cipher.update(textToEncode, 'ascii', 'base64');
  c += cipher.final('base64');
  return c;
}

export function decodeDesECBStr(textToEncode: string, keyString: string) {
  const key = Buffer.from(keyString.substring(0, 8), 'utf8');
  var cipher = crypto.createDecipheriv('des-ecb', key, '');
  var c = cipher.update(textToEncode, 'base64', 'ascii');
  c += cipher.final('ascii');
  return c;
}

export function encodeDesECB(textToEncode: number, keyString: string) {
  const key = Buffer.from(keyString.substring(0, 8), 'utf8');
  var cipher = crypto.createCipheriv('des-ecb', key, '');
  var c = cipher.update(textToEncode.toString(16).padStart(2, '0'), 'hex', 'base64');
  c += cipher.final('base64');
  return c;
}

export function decodeDesECB(textToEncode: string, keyString: string) {
  const key = Buffer.from(keyString.substring(0, 8), 'utf8');
  var cipher = crypto.createDecipheriv('des-ecb', key, '');
  var c = cipher.update(textToEncode, 'base64', 'hex');
  c += cipher.final('hex');
  return parseInt(c, 16);
}

export function wrapId(id: number, typedef: Typedef): string {
  try {
    return typedef + encodeDesECB(id, typedef + KEY);
  } catch (error) {
    throw new Error('Invalid id, code: 53');
  }
}

export function unwrapId(id: string | number, typedef: Typedef) {
  if (typeof id === 'number') {
    throw new Error('Invalid id, code: 54');
  }
  try {
    if (id.startsWith(typedef)) {
      id = id.substring(typedef.length);
      return decodeDesECB(id, typedef + KEY);
    }
  } catch (err) {}
  throw new Error('Invalid id, code: 55');
}
