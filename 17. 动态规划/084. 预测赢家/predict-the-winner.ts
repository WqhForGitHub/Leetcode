// ============================================================
// 084. 预测赢家
// ============================================================
// LeetCode 486. Predict the Winner
// 给定非负整数数组，两人轮流从两端取数，先手分数 >= 后手则返回 true
// 时间复杂度：O(n^2)

// 方法1：动态规划（推荐）
// dp[i][j] = 当前玩家在 nums[i..j] 上能比对手多拿的分数
// 状态转移：dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])
//   - 选左端 nums[i]，对手在 [i+1..j] 上的最优差为 dp[i+1][j]，所以当前差为 nums[i] - dp[i+1][j]
//   - 选右端 nums[j]，对手在 [i..j-1] 上的最优差为 dp[i][j-1]，所以当前差为 nums[j] - dp[i][j-1]
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function predictTheWinner(nums: number[]): boolean {
  const n: number = nums.length;
  if (n === 1) return true;

  // dp[i][j] = 当前玩家在 nums[i..j] 上能比对手多拿的分数
  const dp: number[][] = new Array(n);
  for (let i: number = 0; i < n; i++) {
    dp[i] = new Array(n).fill(0);
    dp[i][i] = nums[i]; // 只有一个元素时，当前玩家拿走，差值就是该元素
  }

  // 按区间长度从 2 到 n 填表
  for (let len: number = 2; len <= n; len++) {
    for (let i: number = 0; i <= n - len; i++) {
      const j: number = i + len - 1;
      // 选左端：nums[i] - 对手在 [i+1..j] 的最优差
      // 选右端：nums[j] - 对手在 [i..j-1] 的最优差
      dp[i][j] = Math.max(nums[i] - dp[i + 1][j], nums[j] - dp[i][j - 1]);
    }
  }

  // 先手在 [0..n-1] 上的差值 >= 0 则先手获胜
  return dp[0][n - 1] >= 0;
}

// 方法2：递归 + 记忆化
// 递归求解当前玩家在 [i..j] 上能比对手多拿的分数
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function predictTheWinnerMemo(nums: number[]): boolean {
  const n: number = nums.length;
  if (n === 1) return true;

  // memo[i][j] 缓存 [i..j] 区间的最优差值
  const memo: number[][] = new Array(n);
  for (let i: number = 0; i < n; i++) {
    memo[i] = new Array(n).fill(Number.MIN_SAFE_INTEGER);
  }

  function solve(i: number, j: number): number {
    if (i === j) return nums[i];
    if (memo[i][j] !== Number.MIN_SAFE_INTEGER) return memo[i][j];

    // 选左端或右端，取最大差值
    memo[i][j] = Math.max(nums[i] - solve(i + 1, j), nums[j] - solve(i, j - 1));
    return memo[i][j];
  }

  return solve(0, n - 1) >= 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 预测赢家 =====");
console.log(predictTheWinner([1, 5, 2])); // 期望结果: false
console.log(predictTheWinner([1, 5, 233, 7])); // 期望结果: true
console.log(predictTheWinner([1, 1, 1])); // 期望结果: true
console.log(predictTheWinner([1, 2, 3, 4, 5])); // 期望结果: true
console.log(predictTheWinner([0])); // 期望结果: true

console.log(predictTheWinnerMemo([1, 5, 2])); // 期望结果: false
console.log(predictTheWinnerMemo([1, 5, 233, 7])); // 期望结果: true
console.log(predictTheWinnerMemo([1, 1, 1])); // 期望结果: true

export {};
