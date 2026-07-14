// ============================================================
// 195. 分割回文串
// ============================================================
// LeetCode 131. Palindrome Partitioning
// 给定字符串 s，返回所有使每个子串都是回文串的分割方案。
// 思路：DFS 回溯 + 中心扩展预处理回文表 / 状压 DP 枚举分割点。
// 时间复杂度：最坏 O(2^N · N)

// 方法1：DFS 回溯 + 中心扩展预处理（推荐）
function partitionPalindrome(s: string): string[][] {
  const n = s.length;
  // isPal[i][j] 表示 s[i..j] 是否为回文
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  // 中心扩展
  for (let center = 0; center < 2 * n - 1; center++) {
    let l = center >> 1;
    let r = l + (center & 1);
    while (l >= 0 && r < n && s[l] === s[r]) {
      isPal[l][r] = true;
      l--;
      r++;
    }
  }

  const res: string[][] = [];
  const path: string[] = [];

  function dfs(start: number): void {
    if (start === n) {
      res.push([...path]);
      return;
    }
    for (let end = start; end < n; end++) {
      if (isPal[start][end]) {
        path.push(s.slice(start, end + 1));
        dfs(end + 1);
        path.pop();
      }
    }
  }
  dfs(0);
  return res;
}

// 方法2：状压 DP 枚举（按分割点子集枚举）
// 思路：用 mask 表示在哪些位置切分（位置 i 表示在 i 与 i+1 之间切），
// 枚举所有 mask，验证每段是否为回文，收集合法方案。
function partitionPalindromeDP(s: string): string[][] {
  const n = s.length;
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) isPal[i][i] = true;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        isPal[i][j] = len === 2 ? true : isPal[i + 1][j - 1];
      }
    }
  }

  const res: string[][] = [];
  // 切分点位于 1..n-1（在位置 i 后切分）
  const total = 1 << (n - 1);
  for (let mask = 0; mask < total; mask++) {
    const cuts: number[] = [0];
    for (let i = 0; i < n - 1; i++) {
      if (mask & (1 << i)) cuts.push(i + 1);
    }
    cuts.push(n);
    let ok = true;
    const parts: string[] = [];
    for (let k = 0; k + 1 < cuts.length; k++) {
      const a = cuts[k];
      const b = cuts[k + 1] - 1;
      if (!isPal[a][b]) {
        ok = false;
        break;
      }
      parts.push(s.slice(a, b + 1));
    }
    if (ok) res.push(parts);
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 195. 分割回文串 =====");

console.log(partitionPalindrome("aab"));
// 期望: [["a","a","b"],["aa","b"]]

console.log(partitionPalindrome("a"));
// 期望: [["a"]]

console.log(partitionPalindromeDP("aab"));
// 期望: [["a","a","b"],["aa","b"]]

console.log(partitionPalindromeDP("a"));
// 期望: [["a"]]

console.log(partitionPalindrome("racecar"));
// 期望包含 ["r","a","c","e","c","a","r"] 与 ["r","a","cec","a","r"] 与 ["racecar"]

export {};
