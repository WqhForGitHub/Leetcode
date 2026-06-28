// ============================================================
// 155. 子域名访问计数
// ============================================================
// LeetCode 811. Subdomain Visit Count
// 给定计数域名对数组 cpdomains（如 "9001 discuss.leetcode.com"），
// 返回所有子域名（含父域名）的访问次数，格式为 "次数 域名"。
// 时间复杂度：O(N*L)；空间复杂度：O(N*L)

function subdomainVisits(cpdomains: string[]): string[] {
  // 哈希表：域名 -> 访问次数
  const count = new Map<string, number>();

  for (const cp of cpdomains) {
    const parts = cp.split(" ");
    const n = parseInt(parts[0]);
    const domain = parts[1];

    // 拆出所有子域名
    const segments = domain.split(".");
    let cur = "";
    for (let i = segments.length - 1; i >= 0; i--) {
      cur = cur === "" ? segments[i] : segments[i] + "." + cur;
      count.set(cur, (count.get(cur) || 0) + n);
    }
  }

  const result: string[] = [];
  for (const [domain, n] of count) {
    result.push(n + " " + domain);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 155. 子域名访问计数 =====");
console.log(
  subdomainVisits(["9001 discuss.leetcode.com"]),
); // 期望: ["9001 discuss.leetcode.com", "9001 leetcode.com", "9001 com"] (顺序可变)
console.log(
  subdomainVisits(["900 google.mail.com", "50 yahoo.com", "1 intel.mail.com", "5 wiki.org"]),
); // 期望: 包含 ["901 mail.com","50 yahoo.com","900 google.mail.com",...]

export {};
