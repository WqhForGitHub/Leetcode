// ============================================================
// 061. 设计一个验证系统
// ============================================================
// LeetCode 1797. Design Authentication Manager
// 设计一个验证管理系统，能够生成令牌、续期未过期令牌、统计未过期令牌数量。
// 使用哈希表存储 tokenId 到过期时间的映射。
// 时间复杂度：generate O(1)，renew O(1)，countUnexpiredTokens O(n)
// 空间复杂度：O(n)，n 为令牌数量

class AuthenticationManager {
  // 令牌存活时间
  private timeToLive: number;
  // 哈希表：tokenId -> 过期时间
  private tokenMap: Map<string, number>;

  constructor(timeToLive: number) {
    this.timeToLive = timeToLive;
    this.tokenMap = new Map();
  }

  // 生成新令牌，记录其过期时间
  generate(tokenId: string, currentTime: number): void {
    this.tokenMap.set(tokenId, currentTime + this.timeToLive);
  }

  // 续期：仅当令牌存在且尚未过期时更新过期时间
  renew(tokenId: string, currentTime: number): void {
    const expire = this.tokenMap.get(tokenId);
    if (expire !== undefined && expire > currentTime) {
      this.tokenMap.set(tokenId, currentTime + this.timeToLive);
    }
  }

  // 统计未过期令牌数量
  countUnexpiredTokens(currentTime: number): number {
    let count = 0;
    for (const expire of this.tokenMap.values()) {
      if (expire > currentTime) {
        count++;
      }
    }
    return count;
  }
}

// ============================================================
// 测试
// ============================================================
function testAuthenticationManager(): void {
  const auth = new AuthenticationManager(5);
  auth.renew("aaa", 1);
  auth.generate("aaa", 2);
  console.log(auth.countUnexpiredTokens(6) === 1); // true，aaa 在时间7过期
  auth.generate("bbb", 7);
  auth.renew("aaa", 8);
  console.log(auth.countUnexpiredTokens(15) === 0); // true，所有令牌均已过期
  console.log("AuthenticationManager 测试完成");
}

testAuthenticationManager();

export {};
