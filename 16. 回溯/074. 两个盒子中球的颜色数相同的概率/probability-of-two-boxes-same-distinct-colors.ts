// ============================================================
// 074. 两个盒子中球的颜色数相同的概率
// ============================================================
// LeetCode 1467. Probability of a Two Boxes Having The Same Number of Distinct Balls
// 给定 balls 数组（每种颜色球的数量），将所有球分成两半放入两个盒子，
// 每个球视为不同。求两个盒子中"不同颜色数量相同"的概率。
// 时间复杂度：O(各颜色数的乘积 * 颜色数)，最坏 O(7^8 * 8)。

// 预计算组合数（Pascal 三角），balls 总数 <= 48
const MAX_N: number = 50;
const pascal: number[][] = (() => {
  const c: number[][] = Array.from({ length: MAX_N + 1 }, () => new Array(MAX_N + 1).fill(0));
  for (let i: number = 0; i <= MAX_N; i++) {
    c[i][0] = 1;
    for (let j: number = 1; j <= i; j++) {
      c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
    }
  }
  return c;
})();

function comb(n: number, k: number): number {
  if (k < 0 || k > n || n < 0) return 0;
  return pascal[n][k];
}

// 方法1：回溯(逐颜色分配) (推荐)
// 对每种颜色，决定 k_i 个球放入盒子1（其余放入盒子2）。
// 累计 box1 的球数、两个盒子各自的 distinct 颜色数和方案数。
// 最终满足：box1 球数 = total/2 且两个盒子 distinct 颜色数相等。
// 总方案数直接用 C(total, half) 计算。
// 时间复杂度：O(prod(balls[i]+1) * m)，空间复杂度：O(m) 递归栈
function getProbability1(balls: number[]): number {
  const m: number = balls.length;
  const total: number = balls.reduce((a: number, b: number) => a + b, 0);
  const half: number = total / 2;

  // 总方案数：从 total 个不同球中选 half 个放入盒子1
  const totalWays: number = comb(total, half);

  let favorable: number = 0;

  // idx 当前颜色下标；box1Count 盒子1 球数；d1/d2 两盒子 distinct 颜色数；ways 当前方案数
  const backtrack = (
    idx: number,
    box1Count: number,
    d1: number,
    d2: number,
    ways: number,
  ): void => {
    if (idx === m) {
      if (box1Count === half && d1 === d2) {
        favorable += ways;
      }
      return;
    }
    // 剪枝：盒子1 球数已超
    if (box1Count > half) return;

    const cnt: number = balls[idx];
    for (let k: number = 0; k <= cnt; k++) {
      const newBox1: number = box1Count + k;
      if (newBox1 > half) break; // k 单调递增，后续必超
      const nd1: number = d1 + (k > 0 ? 1 : 0); // k>0 则该颜色在盒子1
      const nd2: number = d2 + (k < cnt ? 1 : 0); // k<cnt 则该颜色在盒子2
      backtrack(idx + 1, newBox1, nd1, nd2, ways * comb(cnt, k));
    }
  };

  backtrack(0, 0, 0, 0, 1);
  return favorable / totalWays;
}

// 方法2：多项式系数+回溯
// 思路与方法1 类似，但总方案数也通过回溯累加得到（即所有 (k_1,...,k_m) 满足 sum=half
// 的方案数之和，等价于 C(total, half)）。这样总方案数与有利方案数用同一过程计算。
// 时间复杂度：O(prod(balls[i]+1) * m)，空间复杂度：O(m) 递归栈
function getProbability2(balls: number[]): number {
  const m: number = balls.length;
  const total: number = balls.reduce((a: number, b: number) => a + b, 0);
  const half: number = total / 2;

  let totalWays: number = 0;
  let favorable: number = 0;

  const backtrack = (
    idx: number,
    box1Count: number,
    d1: number,
    d2: number,
    ways: number,
  ): void => {
    if (idx === m) {
      if (box1Count === half) {
        totalWays += ways;
        if (d1 === d2) favorable += ways;
      }
      return;
    }
    if (box1Count > half) return;

    const cnt: number = balls[idx];
    for (let k: number = 0; k <= cnt; k++) {
      const newBox1: number = box1Count + k;
      if (newBox1 > half) break;
      const nd1: number = d1 + (k > 0 ? 1 : 0);
      const nd2: number = d2 + (k < cnt ? 1 : 0);
      backtrack(idx + 1, newBox1, nd1, nd2, ways * comb(cnt, k));
    }
  };

  backtrack(0, 0, 0, 0, 1);
  return favorable / totalWays;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 两个盒子中球的颜色数相同的概率 =====");
console.log(getProbability1([1, 1])); // 期望结果: 1.0
console.log(getProbability1([2, 1, 1])); // 期望结果: 0.6666666666666666
console.log(getProbability1([3, 2, 1])); // 期望结果: 0.3
console.log(getProbability1([6, 6, 6, 6, 6, 6])); // 期望结果: 0.90327...
console.log(getProbability2([1, 1])); // 期望结果: 1.0
console.log(getProbability2([2, 1, 1])); // 期望结果: 0.6666666666666666
console.log(getProbability2([3, 2, 1])); // 期望结果: 0.3

export {};
