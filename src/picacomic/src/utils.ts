import hmacSHA256 from 'crypto-js/hmac-sha256';
import jwtDecode, { JwtPayload } from "jwt-decode";

const baseUrl = "https://picaapi.picacomic.com"

// pica api support cors, so on safari, we don't need proxy
// but on chrome we need to use proxy to set `user-agent` header
export function buildHeaders(url: string, method: string = "GET"): Headers {
  const time = Math.floor(Date.now() / 1000);
  const nonce = "f4548a0f1cd21e2c91ca8ca0752ec48d"; // random 32 chars
  const signature = encrypt(url, time, method, nonce);
  const headers = new Headers(basicHeaders);
  headers.set('time', time.toString());
  headers.set('nonce', nonce);
  headers.set('signature', signature);
  return headers;
}

/**
 * check if jwt token is expired
 * @param hourMargin margin for token, in hour
 * @returns
 */
export function isTokenExpired(jwtToken: string, hourMargin = 6) {
  // because token only be refreshed once a month, we can cache it for better performance
  return (jwtDecode<JwtPayload>(jwtToken).exp! - hourMargin * 3600) * 1000 < Date.now();
}


const basicHeaders: any = {
  "api-key": "C69BAF41DA5ABD1FFEDC6D2FEA56B",
  "app-channel": "2",
  "app-version": "2.2.1.3.3.4",
  "app-uuid": "defaultUuid",
  "app-platform": "android",
  "app-build-version": "44",
  "User-Agent": "okhttp/3.8.1",
  "accept": "application/vnd.picacomic.com.v1+json",
  "image-quality": "original",
  "Content-Type": "application/json; charset=UTF-8",
};


function encrypt(url: string, time: number, method: string, nonce: string): string {
  const hmacSha256Key = "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn";
  const apiKey = basicHeaders["api-key"];
  const path = url.replace(`${baseUrl}/`, '');
  const raw = `${path}${time}${nonce}${method}${apiKey}`.toLowerCase();
  return hmacSHA256(raw, hmacSha256Key).toString();
}
