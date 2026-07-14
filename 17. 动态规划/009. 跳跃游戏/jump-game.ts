// ============================================================
// 009. 跳跃游戏
// ============================================================
// LeetCode 55. Jump Game
// 给定非负整数数组，判断是否能到达最后一个位置
// 时间复杂度 O(n)

// 方法1：贪心（推荐）
// 维护能到达的最远位置，若当前位置超过最远位置则不可达
// 时间复杂度 O(n)，空间复杂度 O(1)
function canJump(nums: number[]): boolean {
  let farthest: number = 0; // 当前能到达的最远位置
  for (let i: number = 0; i < nums.length; i++) {
    // 若当前位置不可达，返回 false
    if (i > farthest) return false;
    // 更新最远可达位置
    farthest = Math.max(farthest, i + nums[i]);
    // 提前到达终点
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}

// 方法2：动态规划（可选第二种解法）
// dp[i] 表示位置 i 是否可达
// 状态转移：dp[i] = 存在 j<i 且 dp[j] 为真 && j+nums[j]>=i
// 时间复杂度 O(n²)，空间复杂度 O(n)
function canJump2(nums: number[]): boolean {
  const n: number = nums.length;
  // dp[i] 表示位置 i 是否可达
  const dp: boolean[] = new Array<boolean>(n).fill(false);
  dp[0] = true;
  for (let i: number = 1; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 从可达的 j 能跳到 i
      if (dp[j] && j + nums[j] >= i) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 跳跃游戏 =====");
console.log(canJump([2, 3, 1, 1, 4])); // 期望结果: true
console.log(canJump([3, 2, 1, 0, 4])); // 期望结果: false
console.log(canJump2([2, 3, 1, 1, 4])); // 期望结果: true
console.log(canJump2([3, 2, 1, 0, 4])); // 期望结果: false

export {};
