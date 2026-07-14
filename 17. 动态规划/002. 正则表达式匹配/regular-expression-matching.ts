// ============================================================
// 002. 正则表达式匹配
// ============================================================
// LeetCode 10. Regular Expression Matching
// 给定字符串 s 和模式 p，实现支持 '.' 和 '*' 的正则匹配
// 时间复杂度 O(mn)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 s[0..i) 和 p[0..j) 是否匹配
// 状态转移：
//   若 p[j-1]=='*'：dp[i][j] = dp[i][j-2]（忽略 x*）|| (匹配前一个字符 && dp[i-1][j])
//   否则：dp[i][j] = 当前字符匹配 && dp[i-1][j-1]
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function isMatch(s: string, p: string): boolean {
  const m: number = s.length;
  const n: number = p.length;
  // dp[i][j] 表示 s[0..i) 与 p[0..j) 是否匹配
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  dp[0][0] = true;
  // 处理 s 为空时，模式中 a* 可匹配空串
  for (let j: number = 1; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 2];
    }
  }
  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        // 忽略 x* 或当前字符匹配时使用 *
        dp[i][j] = dp[i][j - 2] || ((p[j - 2] === s[i - 1] || p[j - 2] === ".") && dp[i - 1][j]);
      } else {
        // 普通字符或 '.' 匹配
        dp[i][j] = (p[j - 1] === s[i - 1] || p[j - 1] === ".") && dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}

// 方法2：递归+记忆化（可选第二种解法）
// 从前往后匹配，使用记忆化避免重复计算
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function isMatch2(s: string, p: string): boolean {
  const m: number = s.length;
  const n: number = p.length;
  const memo: Map<string, boolean> = new Map<string, boolean>();
  const dfs: (i: number, j: number) => boolean = (i: number, j: number): boolean => {
    if (j === n) return i === m;
    const key: string = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;
    // 判断当前字符是否匹配
    const first: boolean = i < m && (p[j] === s[i] || p[j] === ".");
    let result: boolean;
    if (j + 1 < n && p[j + 1] === "*") {
      // 跳过 x* 或匹配一个字符后继续使用 *
      result = dfs(i, j + 2) || (first && dfs(i + 1, j));
    } else {
      result = first && dfs(i + 1, j + 1);
    }
    memo.set(key, result);
    return result;
  };
  return dfs(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 正则表达式匹配 =====");
console.log(isMatch("aa", "a")); // 期望结果: false
console.log(isMatch("aa", "a*")); // 期望结果: true
console.log(isMatch("ab", ".*")); // 期望结果: true
console.log(isMatch("aab", "c*a*b")); // 期望结果: true
console.log(isMatch2("aa", "a*")); // 期望结果: true

export {};
