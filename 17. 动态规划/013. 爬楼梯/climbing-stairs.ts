// ============================================================
// 013. 爬楼梯
// ============================================================
// LeetCode 70. Climbing Stairs
// 你在爬楼梯，需要 n 阶才能到达楼顶。每次可以爬 1 或 2 步。
// 求有多少种不同的方法可以爬到楼顶。
// 时间复杂度 O(n) 或 O(log n)

// 方法1：动态规划 - 斐波那契数列（推荐）
// dp[i] 表示爬到第 i 阶的方法数
// 状态转移：dp[i] = dp[i-1] + dp[i-2]
// 因为 dp[i] 只依赖前两个值，可以用两个变量优化空间
// 时间复杂度 O(n)，空间复杂度 O(1)
function climbStairs(n: number): number {
  if (n <= 2) return n;

  // prev2 表示 dp[i-2]，prev1 表示 dp[i-1]
  let prev2: number = 1; // dp[1] = 1
  let prev1: number = 2; // dp[2] = 2

  for (let i: number = 3; i <= n; i++) {
    // 当前方法数 = 前一步 + 前两步
    const curr: number = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// 方法2：矩阵快速幂
// 利用 [[1,1],[1,0]]^n 可以快速计算斐波那契数
// [[F(n+1)],[F(n)]] = [[1,1],[1,0]]^n * [[F(1)],[F(0)]]
// 时间复杂度 O(log n)，空间复杂度 O(1)
function climbStairs2(n: number): number {
  if (n <= 2) return n;

  // 矩阵乘法
  function multiply(a: number[][], b: number[][]): number[][] {
    const result: number[][] = [
      [0, 0],
      [0, 0],
    ];
    for (let i: number = 0; i < 2; i++) {
      for (let j: number = 0; j < 2; j++) {
        for (let k: number = 0; k < 2; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  // 矩阵快速幂
  function matrixPow(mat: number[][], p: number): number[][] {
    let result: number[][] = [
      [1, 0],
      [0, 1],
    ]; // 单位矩阵
    while (p > 0) {
      if (p % 2 === 1) {
        result = multiply(result, mat);
      }
      mat = multiply(mat, mat);
      p = Math.floor(p / 2);
    }
    return result;
  }

  // [[1,1],[1,0]]^(n-1) 的左上角元素即为 F(n) = f(n+1)
  const base: number[][] = [
    [1, 1],
    [1, 0],
  ];
  const result: number[][] = matrixPow(base, n);
  // result = [[F(n+1), F(n)], [F(n), F(n-1)]]
  // 爬楼梯的结果是 F(n+1)，即 result[0][0]
  return result[0][0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 爬楼梯 =====");
console.log(climbStairs(2)); // 期望结果: 2
console.log(climbStairs(3)); // 期望结果: 3
console.log(climbStairs(4)); // 期望结果: 5
console.log(climbStairs(5)); // 期望结果: 8
console.log(climbStairs2(5)); // 期望结果: 8

export {};
