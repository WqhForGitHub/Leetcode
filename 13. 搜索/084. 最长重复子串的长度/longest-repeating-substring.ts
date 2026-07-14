// ============================================================
// 084. 最长重复子串的长度
// ============================================================
// LeetCode 1062. Longest Repeating Substring
// 返回字符串中最长重复子串的长度（子串可以重叠）。

// 方法1：二分查找 + 滚动哈希
function longestRepeatingSubstring(s: string): number {
  const n = s.length;
  let lo = 1;
  let hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hasRepeating(s, mid)) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return hi;
}

function hasRepeating(s: string, len: number): boolean {
  const seen = new Set<string>();
  for (let i = 0; i <= s.length - len; i++) {
    const sub = s.substring(i, i + len);
    if (seen.has(sub)) return true;
    seen.add(sub);
  }
  return false;
}

// 方法2：二分查找 + 滚动哈希（优化）
function longestRepeatingSubstringHash(s: string): number {
  const n = s.length;
  const base = 26;
  const mod = BigInt(2 ** 63 - 1);
  let lo = 1;
  let hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hasRepeatingHash(s, mid, base, mod)) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return hi;
}

function hasRepeatingHash(s: string, len: number, base: number, mod: bigint): boolean {
  const seen = new Set<bigint>();
  let hash = 0n;
  let power = 1n;
  for (let i = 0; i < len; i++) {
    hash = (hash * BigInt(base) + BigInt(s.charCodeAt(i) - 97)) % mod;
    power = (power * BigInt(base)) % mod;
  }
  seen.add(hash);
  for (let i = len; i < s.length; i++) {
    hash =
      (hash * BigInt(base) +
        BigInt(s.charCodeAt(i) - 97) -
        BigInt(s.charCodeAt(i - len) - 97) * power) %
      mod;
    if (hash < 0n) hash += mod;
    if (seen.has(hash)) return true;
    seen.add(hash);
  }
  return false;
}

// 方法3：动态规划（O(n²)）
function longestRepeatingSubstringDP(s: string): number {
  const n = s.length;
  const dp: number[][] = new Array(n + 1);
  for (let i = 0; i <= n; i++) dp[i] = new Array(n + 1).fill(0);
  let maxLen = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (s[i - 1] === s[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 最长重复子串的长度 =====");
console.log("二分 'abcd':", longestRepeatingSubstring("abcd")); // 0
console.log("二分 'abbaba':", longestRepeatingSubstring("abbaba")); // 2
console.log("哈希 'aabcaabdaab':", longestRepeatingSubstringHash("aabcaabdaab")); // 3
console.log("DP 'abbaba':", longestRepeatingSubstringDP("abbaba")); // 2

export {};
