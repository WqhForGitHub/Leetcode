// ============================================================
// 017. 解码方法
// ============================================================
// LeetCode 91. Decode Ways
// 给定一个只含数字的非空字符串，计算解码方法的总数。
// '1' -> 'A', '2' -> 'B', ..., '26' -> 'Z'
// 时间复杂度 O(n)，空间复杂度 O(n) 或 O(1)

// 方法1：动态规划（推荐）
// dp[i] 表示 s[0..i-1) 的解码方法数
// 状态转移：
//   若 s[i-1] != '0'，则可以单独解码，dp[i] += dp[i-1]
//   若 s[i-2..i) 对应的数字在 10~26 之间，则可以组合解码，dp[i] += dp[i-2]
// 时间复杂度 O(n)，空间复杂度 O(n)
function numDecodings(s: string): number {
  const n: number = s.length;
  if (n === 0 || s[0] === "0") return 0;

  // dp[i] 表示 s[0..i-1) 的解码方法数
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[0] = 1; // 空串有一种解码方式
  dp[1] = 1; // 第一个字符（非0）有一种解码方式

  for (let i: number = 2; i <= n; i++) {
    // 单字符解码：s[i-1] 不为 '0' 时
    if (s[i - 1] !== "0") {
      dp[i] += dp[i - 1];
    }
    // 双字符解码：s[i-2..i) 组成的数字在 10~26 之间
    const twoDigit: number = parseInt(s.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
    // 如果 dp[i] 仍为 0，说明无法解码
  }

  return dp[n];
}

// 方法2：动态规划 - 空间优化为 O(1)
// 因为 dp[i] 只依赖 dp[i-1] 和 dp[i-2]，用两个变量代替数组
// 时间复杂度 O(n)，空间复杂度 O(1)
function numDecodings2(s: string): number {
  const n: number = s.length;
  if (n === 0 || s[0] === "0") return 0;

  // prev2 表示 dp[i-2]，prev1 表示 dp[i-1]
  let prev2: number = 1; // dp[0]
  let prev1: number = 1; // dp[1]（s[0] 非0）

  for (let i: number = 2; i <= n; i++) {
    let curr: number = 0;
    // 单字符解码
    if (s[i - 1] !== "0") {
      curr += prev1;
    }
    // 双字符解码
    const twoDigit: number = parseInt(s.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      curr += prev2;
    }

    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 解码方法 =====");
console.log(numDecodings("12")); // 期望结果: 2
console.log(numDecodings("226")); // 期望结果: 3
console.log(numDecodings("06")); // 期望结果: 0
console.log(numDecodings("0")); // 期望结果: 0
console.log(numDecodings2("226")); // 期望结果: 3

export {};
