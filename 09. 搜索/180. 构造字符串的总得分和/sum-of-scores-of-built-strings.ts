// ============================================================
// 180. 构造字符串的总得分和
// ============================================================
// LeetCode 2223. Sum of Scores of Built Strings
// 对字符串 s 的每个后缀 s[i:]，计算它与 s 的最长公共前缀长度，
// 返回所有长度的和。

// 方法1：Z 算法（Z-function）
function sumScores(s: string): number {
  const n = s.length;
  const z = new Array(n).fill(0);
  // z[0] 默认为 0（或 n，取决于定义），这里设为 n
  z[0] = n;
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) {
      z[i] = Math.min(r - i, z[i - l]);
    }
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++;
    }
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  return z.reduce((a, b) => a + b, 0);
}

// 方法2：二分查找 + 字符串哈希
function sumScoresHash(s: string): number {
  const n = s.length;
  const base = 31;
  const mod = 1000000007;
  // 预处理哈希和幂
  const hash = new Array(n + 1).fill(0);
  const pow = new Array(n + 1).fill(1);
  for (let i = 0; i < n; i++) {
    hash[i + 1] = (hash[i] * base + (s.charCodeAt(i) - 96)) % mod;
    pow[i + 1] = (pow[i] * base) % mod;
  }
  function getHash(l: number, r: number): number {
    return (hash[r] - (hash[l] * pow[r - l]) % mod + mod) % mod;
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    // 二分查找 s 和 s[i:] 的最长公共前缀
    let lo = 0;
    let hi = n - i;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (getHash(0, mid) === getHash(i, i + mid)) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    total += lo;
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 180. 构造字符串的总得分和 =====");
console.log("Z算法 babab:", sumScores("babab")); // 9
console.log("Z算法 azbazbzaz:", sumScores("azbazbzaz")); // 14
console.log("哈希 babab:", sumScoresHash("babab")); // 9
console.log("哈希 azbazbzaz:", sumScoresHash("azbazbzaz")); // 14

export {};
