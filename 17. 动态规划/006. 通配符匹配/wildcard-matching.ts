// ============================================================
// 006. 通配符匹配
// ============================================================
// LeetCode 44. Wildcard Matching
// 给定字符串 s 和模式 p，支持 '?' 和 '*' 通配符匹配
// 时间复杂度 O(mn)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 s[0..i) 和 p[0..j) 是否匹配
// 状态转移：
//   p[j-1]=='*'：dp[i][j] = dp[i][j-1]（* 匹配空）|| dp[i-1][j]（* 匹配至少一个字符）
//   p[j-1]=='?' 或字符匹配：dp[i][j] = dp[i-1][j-1]
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function isMatchWildcard(s: string, p: string): boolean {
  const m: number = s.length;
  const n: number = p.length;
  // dp[i][j] 表示 s[0..i) 与 p[0..j) 是否匹配
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  dp[0][0] = true;
  // s 为空时，连续的 '*' 可匹配空串
  for (let j: number = 1; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 1];
    }
  }
  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        // * 匹配空（dp[i][j-1]）或 * 匹配一个字符并继续使用（dp[i-1][j]）
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else if (p[j - 1] === "?" || p[j - 1] === s[i - 1]) {
        // ? 匹配任意单字符 或 字符相同
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}

// 方法2：贪心+双指针（可选第二种解法）
// 用 s 和 p 的指针扫描，遇到 * 记录位置并尝试匹配，失败时回溯
// 时间复杂度 O(mn) 最坏，空间复杂度 O(1)
function isMatchWildcard2(s: string, p: string): boolean {
  let i: number = 0; // s 指针
  let j: number = 0; // p 指针
  let star: number = -1; // 记录最近一个 * 的位置
  let match: number = 0; // 记录 * 开始匹配 s 的位置
  while (i < s.length) {
    if (j < p.length && (p[j] === "?" || p[j] === s[i])) {
      // 字符匹配，两指针同时前进
      i++;
      j++;
    } else if (j < p.length && p[j] === "*") {
      // 记录 * 位置，先尝试匹配空串
      star = j;
      match = i;
      j++;
    } else if (star !== -1) {
      // 回溯，让 * 多匹配一个字符
      j = star + 1;
      match++;
      i = match;
    } else {
      return false;
    }
  }
  // s 匹配完后，p 剩余必须全为 *
  while (j < p.length && p[j] === "*") {
    j++;
  }
  return j === p.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 通配符匹配 =====");
console.log(isMatchWildcard("aa", "a")); // 期望结果: false
console.log(isMatchWildcard("aa", "*")); // 期望结果: true
console.log(isMatchWildcard("cb", "?a")); // 期望结果: false
console.log(isMatchWildcard("adceb", "*a*b")); // 期望结果: true
console.log(isMatchWildcard2("adceb", "*a*b")); // 期望结果: true

export {};
