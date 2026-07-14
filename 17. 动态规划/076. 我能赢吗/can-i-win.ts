// ============================================================
// 076. 我能赢吗
// ============================================================
// LeetCode 464. Can I Win
// 1 到 maxChoosableInteger 的数字，两人轮流选，累计和先达到 desiredTotal 者赢。
// 不能重复选数字。判断先手是否必胜。
// 时间复杂度：O(2^m * m)，空间复杂度：O(2^m)

// 方法1：记忆化递归 + 位掩码（推荐）
// 用一个整数的每一位表示数字是否被选过
// 时间复杂度 O(2^m * m)，空间复杂度 O(2^m)
function canIWin(maxChoosableInteger: number, desiredTotal: number): boolean {
  // 特判：如果目标和为0，先手直接赢
  if (desiredTotal <= 0) return true;
  // 所有数字之和都达不到目标，没人能赢
  const sum: number = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
  if (sum < desiredTotal) return false;

  // 记忆化数组：-1 未计算，0 false，1 true
  const memo: Int8Array = new Int8Array(1 << maxChoosableInteger).fill(-1);

  // state 表示已选数字的位掩码，remaining 为剩余需要达到的和
  const dfs = (state: number, remaining: number): boolean => {
    if (memo[state] !== -1) return memo[state] === 1;
    for (let i: number = 1; i <= maxChoosableInteger; i++) {
      const bit: number = 1 << (i - 1);
      // 如果数字 i 还没被选过
      if ((state & bit) === 0) {
        // 选了 i 之后直接达到或超过目标，当前玩家赢
        if (remaining - i <= 0) {
          memo[state] = 1;
          return true;
        }
        // 递归判断对手是否必败
        if (!dfs(state | bit, remaining - i)) {
          memo[state] = 1;
          return true;
        }
      }
    }
    memo[state] = 0;
    return false;
  };

  return dfs(0, desiredTotal);
}

// 方法2：DP 自底向上 + 位掩码
// 从所有数字都选完的状态倒推
// 时间复杂度 O(2^m * m)，空间复杂度 O(2^m)
function canIWinDP(maxChoosableInteger: number, desiredTotal: number): boolean {
  if (desiredTotal <= 0) return true;
  const sum: number = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
  if (sum < desiredTotal) return false;

  const total: number = 1 << maxChoosableInteger;
  // dp[state] = 在 state 状态下当前玩家是否能赢
  const dp: boolean[] = new Array(total).fill(false);

  for (let state: number = total - 1; state >= 0; state--) {
    // 计算已选数字的总和
    let usedSum: number = 0;
    for (let i: number = 1; i <= maxChoosableInteger; i++) {
      if (state & (1 << (i - 1))) usedSum += i;
    }
    const remaining: number = desiredTotal - usedSum;

    for (let i: number = 1; i <= maxChoosableInteger; i++) {
      const bit: number = 1 << (i - 1);
      if ((state & bit) === 0) {
        // 选 i 后直接获胜，或者对手在下一状态必败
        if (remaining - i <= 0 || !dp[state | bit]) {
          dp[state] = true;
          break;
        }
      }
    }
  }

  return dp[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 我能赢吗 =====");
console.log(canIWin(10, 11)); // 期望结果: false
console.log(canIWin(10, 0)); // 期望结果: true
console.log(canIWin(10, 1)); // 期望结果: true
console.log(canIWin(5, 50)); // 期望结果: false
console.log("--- 方法2测试 ---");
console.log(canIWinDP(10, 11)); // 期望结果: false
console.log(canIWinDP(10, 0)); // 期望结果: true
console.log(canIWinDP(10, 1)); // 期望结果: true
console.log(canIWinDP(5, 50)); // 期望结果: false

export {};
