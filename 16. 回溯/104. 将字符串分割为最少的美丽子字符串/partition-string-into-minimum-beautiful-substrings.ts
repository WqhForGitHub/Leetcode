// ============================================================
// 104. 将字符串分割为最少的美丽子字符串
// ============================================================
// LeetCode 2767. Partition String Into Minimum Beautiful Substrings
// 给定二进制字符串 s，将其分割为最少数量的"美丽子字符串"
// 美丽字符串 = 5的幂的二进制表示（1, 101, 11001, ...），无法分割返回 -1
// 时间复杂度：O(n^2), 空间复杂度：O(n)

// 方法1：回溯+记忆化（推荐）
// 从位置 start 开始尝试所有可能的美丽子字符串分割，记忆化避免重复计算
function minimumBeautifulSubstrings(s: string): number {
  // 预计算所有 5 的幂的二进制表示（s 长度 <= 15）
  const powers: Set<string> = new Set([
    "1",
    "101",
    "11001",
    "1111101",
    "1001110001",
    "1100001101101",
    "11110100001001",
  ]);
  const memo: Map<number, number> = new Map();

  function backtrack(start: number): number {
    if (start === s.length) return 0;
    if (memo.has(start)) return memo.get(start)!;
    let result: number = Infinity;
    for (let end: number = start + 1; end <= s.length; end++) {
      const sub: string = s.substring(start, end);
      if (powers.has(sub)) {
        const rest: number = backtrack(end);
        if (rest !== Infinity) {
          result = Math.min(result, 1 + rest);
        }
      }
    }
    memo.set(start, result);
    return result;
  }

  const ans: number = backtrack(0);
  return ans === Infinity ? -1 : ans;
}

// 方法2：动态规划
// dp[i] 表示 s[0..i-1] 的最少美丽分割数，枚举所有分割点
function minimumBeautifulSubstrings2(s: string): number {
  const powers: Set<string> = new Set([
    "1",
    "101",
    "11001",
    "1111101",
    "1001110001",
    "1100001101101",
    "11110100001001",
  ]);
  const n: number = s.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i: number = 1; i <= n; i++) {
    for (let j: number = 0; j < i; j++) {
      const sub: string = s.substring(j, i);
      if (powers.has(sub) && dp[j] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }
  return dp[n] === Infinity ? -1 : dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 将字符串分割为最少的美丽子字符串 =====");
console.log(minimumBeautifulSubstrings("1011")); // 期望结果: 2
console.log(minimumBeautifulSubstrings("111")); // 期望结果: 3
console.log(minimumBeautifulSubstrings("0")); // 期望结果: -1
console.log("--- 方法2测试 ---");
console.log(minimumBeautifulSubstrings2("1011")); // 期望结果: 2
console.log(minimumBeautifulSubstrings2("111")); // 期望结果: 3
console.log(minimumBeautifulSubstrings2("0")); // 期望结果: -1

export {};
