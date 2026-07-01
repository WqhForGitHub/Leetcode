// ============================================================
// 073. 鸡蛋掉落
// ============================================================
// LeetCode 887. Super Egg Drop
// K 个鸡蛋 N 层楼，最少多少次测试能确定临界楼层 F。

// 方法1：动态规划 + 二分查找（O(K N log N)）
function superEggDrop(K: number, N: number): number {
  const dp: number[][] = new Array(K + 1);
  for (let i = 0; i <= K; i++) {
    dp[i] = new Array(N + 1).fill(0);
  }
  for (let j = 1; j <= N; j++) {
    dp[1][j] = j;
  }
  for (let i = 2; i <= K; i++) {
    for (let j = 1; j <= N; j++) {
      // 二分找最优决策点
      let lo = 1;
      let hi = j;
      dp[i][j] = j;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const break1 = dp[i - 1][mid - 1]; // 鸡蛋碎了
        const notBreak = dp[i][j - mid]; // 鸡蛋没碎
        if (break1 < notBreak) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      dp[i][j] = 1 + Math.max(
        dp[i - 1][lo - 1],
        dp[i][j - lo]
      );
    }
  }
  return dp[K][N];
}

// 方法2：逆向思维（O(K N)）
function superEggDropReverse(K: number, N: number): number {
  // dp[k][m] = k 个鸡蛋 m 次测试最多能测多少层
  // dp[k][m] = dp[k-1][m-1] + dp[k][m-1] + 1
  const dp: number[][] = new Array(K + 1);
  for (let i = 0; i <= K; i++) {
    dp[i] = new Array(N + 1).fill(0);
  }
  let m = 0;
  while (dp[K][m] < N) {
    m++;
    for (let k = K; k >= 1; k--) {
      dp[k][m] = dp[k - 1][m - 1] + dp[k][m - 1] + 1;
    }
  }
  return m;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 鸡蛋掉落 =====");
console.log("DP 1,2:", superEggDrop(1, 2)); // 2
console.log("DP 2,6:", superEggDrop(2, 6)); // 3
console.log("DP 3,14:", superEggDrop(3, 14)); // 4
console.log("逆向 2,6:", superEggDropReverse(2, 6)); // 3

export {};
