// ============================================================
// 088. 斐波那契数
// ============================================================
// LeetCode 509. Fibonacci Number
// 给定 n，返回斐波那契数列 F(n)，F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。
// 时间复杂度：O(n) 或 O(log n)

// 方法1：动态规划（迭代）（推荐）
// 用两个变量滚动记录前两个斐波那契数，逐步递推
// 状态转移：F(i) = F(i-1) + F(i-2)
// 时间复杂度 O(n)，空间复杂度 O(1)
function fib(n: number): number {
  if (n <= 1) return n;

  let prev2: number = 0; // F(0)
  let prev1: number = 1; // F(1)

  // 从 F(2) 开始递推到 F(n)
  for (let i: number = 2; i <= n; i++) {
    const current: number = prev1 + prev2; // F(i) = F(i-1) + F(i-2)
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// 方法2：矩阵快速幂
// 利用矩阵幂法：[[1,1],[1,0]]^n 可快速计算 F(n)
// 公式：F(n) = ([[1,1],[1,0]]^(n-1))[0][0]
// 时间复杂度 O(log n)，空间复杂度 O(1)
function fibMatrix(n: number): number {
  if (n <= 1) return n;

  // 2x2 矩阵乘法
  function matrixMult(a: number[][], b: number[][]): number[][] {
    const c: number[][] = [
      [0, 0],
      [0, 0],
    ];
    for (let i: number = 0; i < 2; i++) {
      for (let j: number = 0; j < 2; j++) {
        c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
      }
    }
    return c;
  }

  // 矩阵快速幂：利用二分思想加速幂运算
  function matrixPow(m: number[][], p: number): number[][] {
    let result: number[][] = [
      [1, 0],
      [0, 1],
    ]; // 单位矩阵
    let base: number[][] = m;
    while (p > 0) {
      if (p % 2 === 1) {
        result = matrixMult(result, base);
      }
      base = matrixMult(base, base);
      p = Math.floor(p / 2);
    }
    return result;
  }

  // F(n) = ([[1,1],[1,0]]^(n-1))[0][0]
  const m: number[][] = matrixPow(
    [
      [1, 1],
      [1, 0],
    ],
    n - 1,
  );
  return m[0][0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 斐波那契数 =====");
console.log(fib(2)); // 期望结果: 1
console.log(fib(3)); // 期望结果: 2
console.log(fib(4)); // 期望结果: 3
console.log(fib(10)); // 期望结果: 55
console.log(fib(0)); // 期望结果: 0

export {};
