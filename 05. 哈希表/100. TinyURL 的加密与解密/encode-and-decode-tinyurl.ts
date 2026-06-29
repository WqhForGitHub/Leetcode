// ============================================================
// 100. TinyURL 的加密与解密
// ============================================================
// LeetCode 535. Encode and Decode TinyURL
// 设计一个 TinyURL 加密与解密系统，将长 URL 编码为短 URL，
// 并能通过短 URL 解码回原始长 URL。
// 时间复杂度：O(1)，空间复杂度：O(n)

class TinyURL {
  // 哈希表：短码 -> 长URL
  private codeToUrl = new Map<string, string>();
  // 哈希表：长URL -> 短码（避免重复编码）
  private urlToCode = new Map<string, string>();
  private prefix = "http://tinyurl.com/";
  private chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private codeLen = 6;

  // 生成随机短码
  private generateCode(): string {
    let code = "";
    for (let i = 0; i < this.codeLen; i++) {
      code += this.chars[Math.floor(Math.random() * this.chars.length)];
    }
    // 若已存在则重新生成
    return this.codeToUrl.has(code) ? this.generateCode() : code;
  }

  // 加密：长 URL -> 短 URL
  encode(longUrl: string): string {
    // 若已编码过，直接返回已存在的短码
    if (this.urlToCode.has(longUrl)) {
      return this.prefix + this.urlToCode.get(longUrl);
    }
    const code = this.generateCode();
    this.codeToUrl.set(code, longUrl);
    this.urlToCode.set(longUrl, code);
    return this.prefix + code;
  }

  // 解密：短 URL -> 长 URL
  decode(shortUrl: string): string {
    // 提取短码（去掉前缀）
    const code = shortUrl.slice(this.prefix.length);
    return this.codeToUrl.get(code) ?? "";
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. TinyURL 的加密与解密 =====");
// 测试 1: 基本加解密
const tiny = new TinyURL();
const url1 = "https://leetcode.com/problems/design-tinyurl";
const short1 = tiny.encode(url1);
console.log("编码后:", short1);
console.log("解码后:", tiny.decode(short1));
// 期望: 解码后等于 url1
// 测试 2: 同一 URL 多次编码返回相同短码
const short1Again = tiny.encode(url1);
console.log("再次编码相同:", short1 === short1Again);
// 期望: true
// 测试 3: 不同 URL 编码后短码不同，解码正确
const url2 = "https://www.example.com/very/long/path?query=1&foo=bar";
const short2 = tiny.encode(url2);
console.log("解码 url2:", tiny.decode(short2));
// 期望: 解码后等于 url2

export {};
