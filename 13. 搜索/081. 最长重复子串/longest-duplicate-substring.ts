// ============================================================
// 081. 最长重复子串
// ============================================================
// LeetCode 1044. Longest Duplicate Substring
// 给定字符串，返回任意一个最长重复子串（出现至少两次）。

// 方法1：二分查找 + 滚动哈希
function longestDupSubstring(s: string): string {
  const n = s.length;
  const base = 26;
  const mod = 2 ** 63 - 1; // 大模数减少冲突

  let lo = 1;
  let hi = n;
  let start = 0;
  let maxLen = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const result = search(s, mid, base, mod);
    if (result !== -1) {
      start = result;
      maxLen = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return maxLen === 0 ? "" : s.substring(start, start + maxLen);
}

function search(s: string, len: number, base: number, mod: bigint): number {
  const n = s.length;
  const seen = new Set<bigint>();
  let hash = 0n;
  let power = 1n;
  for (let i = 0; i < len; i++) {
    hash = (hash * BigInt(base) + BigInt(s.charCodeAt(i) - 97)) % mod;
    power = (power * BigInt(base)) % mod;
  }
  seen.add(hash);
  for (let i = len; i < n; i++) {
    hash =
      (hash * BigInt(base) +
        BigInt(s.charCodeAt(i) - 97) -
        BigInt(s.charCodeAt(i - len) - 97) * power) %
      mod;
    if (hash < 0n) hash += mod;
    if (seen.has(hash)) return i - len + 1;
    seen.add(hash);
  }
  return -1;
}

// 方法2：二分查找 + 字符串比较（暴力，O(n² log n)）
function longestDupSubstringBrute(s: string): string {
  const n = s.length;
  let lo = 1;
  let hi = n;
  let result = "";
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const found = findDup(s, mid);
    if (found) {
      result = found;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

function findDup(s: string, len: number): string {
  const seen = new Set<string>();
  for (let i = 0; i <= s.length - len; i++) {
    const sub = s.substring(i, i + len);
    if (seen.has(sub)) return sub;
    seen.add(sub);
  }
  return "";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 最长重复子串 =====");
console.log("哈希 'banana':", longestDupSubstring("banana")); // "ana"
console.log("哈希 'abcd':", longestDupSubstring("abcd")); // ""

export {};
