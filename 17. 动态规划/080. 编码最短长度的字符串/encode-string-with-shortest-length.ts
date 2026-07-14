// ============================================================
// 080. 编码最短长度的字符串
// ============================================================
// LeetCode 471. Encode String with Shortest Length
// 给定字符串 s，将其编码为最短形式。可编码为 k[子串] 如 "aaa" -> "3[a]"。
// 时间复杂度：O(n^3)，空间复杂度：O(n^2)

// 方法1：DP（推荐）
// dp[i][j] = s[i..j] 的最短编码字符串
// 检查 s[i..j] 是否可由某个重复子串编码
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)
function encode(s: string): string {
  const n: number = s.length;
  // dp[i][j] 存储 s[i..j] 的最短编码
  const dp: string[][] = [];
  for (let i: number = 0; i < n; i++) {
    dp.push(new Array(n).fill(""));
  }

  // 按区间长度从小到大填充
  for (let len: number = 1; len <= n; len++) {
    for (let i: number = 0; i + len - 1 < n; i++) {
      const j: number = i + len - 1;
      const substr: string = s.substring(i, j + 1);

      // 初始值：不编码
      dp[i][j] = substr;

      // 如果长度为1，不能编码
      if (len === 1) continue;

      // 尝试分割点，取最短
      for (let k: number = i; k < j; k++) {
        if (dp[i][k].length + dp[k + 1][j].length < dp[i][j].length) {
          dp[i][j] = dp[i][k] + dp[k + 1][j];
        }
      }

      // 尝试找重复子串编码
      const pos: number = (substr + substr).indexOf(substr, 1);
      if (pos < len && pos > 0) {
        // substr 是由前 pos 个字符重复组成
        const pattern: string = substr.substring(0, pos);
        const repeatTimes: number = Math.floor(len / pos);
        const encoded: string = repeatTimes + "[" + dp[i][i + pos - 1] + "]";
        if (encoded.length < dp[i][j].length) {
          dp[i][j] = encoded;
        }
      }
    }
  }

  return dp[0][n - 1];
}

// 方法2：记忆化递归
// 递归地尝试所有可能的编码方式
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)
function encodeMemo(s: string): string {
  const n: number = s.length;
  const memo: Map<string, string> = new Map();

  const solve = (i: number, j: number): string => {
    const key: string = i + "," + j;
    if (memo.has(key)) return memo.get(key)!;

    const substr: string = s.substring(i, j + 1);

    // 长度为1，无法编码
    if (substr.length <= 4) {
      memo.set(key, substr);
      return substr;
    }

    let result: string = substr;

    // 尝试找重复模式
    const doubled: string = substr + substr;
    const repPos: number = doubled.indexOf(substr, 1);
    if (repPos > 0 && repPos < substr.length) {
      const pattern: string = solve(i, i + repPos - 1);
      const times: number = Math.floor(substr.length / repPos);
      const encoded: string = times + "[" + pattern + "]";
      if (encoded.length < result.length) {
        result = encoded;
      }
    }

    // 尝试在所有分割点处分割
    for (let k: number = i; k < j; k++) {
      const left: string = solve(i, k);
      const right: string = solve(k + 1, j);
      if (left.length + right.length < result.length) {
        result = left + right;
      }
    }

    memo.set(key, result);
    return result;
  };

  return solve(0, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 编码最短长度的字符串 =====");
console.log(encode("aaa")); // 期望结果: 3[a]
console.log(encode("aaaaa")); // 期望结果: 5[a]
console.log(encode("aabcaabcd")); // 期望结果: 2[aabc]d
console.log(encode("abbbabbbcabbbabbbc")); // 期望结果: 2[2[abbb]c]
console.log("--- 方法2测试 ---");
console.log(encodeMemo("aaa")); // 期望结果: 3[a]
console.log(encodeMemo("aaaaa")); // 期望结果: 5[a]

export {};
