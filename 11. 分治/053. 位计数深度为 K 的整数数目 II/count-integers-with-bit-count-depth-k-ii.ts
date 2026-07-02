// ============================================================
// 053. 位计数深度为 K 的整数数目 II
// ============================================================
// LeetCode（竞赛题）. Count Integers With Bit Count Depth Equal to K II
// 给定整数 l, r, k，统计 [l, r] 范围内"位计数深度"恰好为 k 的整数数目。
// 位计数深度定义：
//   depth(0) = 0
//   depth(1) = 1
//   depth(x) = 1 + depth(popcount(x)),  x >= 2
// 其中 popcount(x) 为 x 的二进制表示中 1 的个数。
// 示例：depth(7) = 1+depth(3) = 1+(1+depth(2)) = 1+1+(1+depth(1)) = 4
// 约束：l, r 可达 10^15，结果对 10^9+7 取模。
// 时间复杂度：O(B^2 + B·log r), B=60；空间复杂度：O(B^2)

const MOD: number = 1e9 + 7;

// ---- 辅助函数 ----

// 计算 popcount（二进制中 1 的个数）
function popcount(x: number): number {
  let cnt: number = 0;
  while (x > 0) {
    cnt += x & 1;
    x = Math.floor(x / 2);
  }
  return cnt;
}

// 预计算 depth 表
// depth[0]=0, depth[1]=1, depth[p]=1+depth[popcount(p)] (p>=2)
// 对于 x>=2，popcount(x) < x，递归必然终止
function buildDepthTable(maxBits: number): number[] {
  const depth: number[] = new Array<number>(maxBits + 1).fill(0);
  depth[0] = 0;
  if (maxBits >= 1) depth[1] = 1;
  for (let i = 2; i <= maxBits; i++) {
    depth[i] = 1 + depth[popcount(i)];
  }
  return depth;
}

// 预计算组合数表（杨辉三角），用于数位 DP
function buildCombTable(maxN: number): number[][] {
  const C: number[][] = Array.from({ length: maxN + 1 }, (): number[] =>
    new Array<number>(maxN + 1).fill(0),
  );
  for (let i = 0; i <= maxN; i++) {
    C[i][0] = 1;
    for (let j = 1; j <= i; j++) {
      C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
  }
  return C;
}

// 统计 [0, n] 中恰好有 p 个置位的整数数目（数位 DP / 组合计数）
// 从高位到低位扫描 n 的二进制表示，遇 1 时可选置 0（剩余位自由组合）
function countWithBits(n: number, p: number, C: number[][]): number {
  if (n < 0 || p < 0) return 0;
  const binary: string = n.toString(2);
  const m: number = binary.length;
  let result: number = 0;
  let setSoFar: number = 0;
  for (let i = 0; i < m; i++) {
    if (binary[i] === "1") {
      // 当前位设为 0，剩余 m-i-1 位中选 p-setSoFar 个 1
      const remaining: number = m - i - 1;
      const need: number = p - setSoFar;
      if (need >= 0 && need <= remaining) {
        result = (result + C[remaining][need]) % MOD;
      }
      // 当前位设为 1，继续匹配 n 的前缀
      setSoFar++;
    }
  }
  // 检查 n 本身是否恰好有 p 个 1
  if (setSoFar === p) {
    result = (result + 1) % MOD;
  }
  return result;
}

// ---- 方法1：数位 DP + 组合计数（推荐）----
// 思路：对 x>=2，depth(x)=1+depth(popcount(x))，即 depth 只取决于 popcount 值。
// 枚举所有可能的 popcount 值 p（1~60），若 1+depth[p]==k，
// 则用数位 DP 统计 [l,r] 中 popcount 恰好为 p 的整数数目，求和。
// 特殊处理 x=0（depth=0）和 x=1（depth=1）。
function countIntegersWithBitCountDepthKII(l: number, r: number, k: number): number {
  const maxBits: number = 60;
  const depth: number[] = buildDepthTable(maxBits);
  const C: number[][] = buildCombTable(maxBits);

  let result: number = 0;

  // 特殊处理 x = 0：depth(0) = 0
  if (l <= 0 && 0 <= r && k === 0) {
    result = (result + 1) % MOD;
  }

  // 特殊处理 x = 1：depth(1) = 1
  if (l <= 1 && 1 <= r && k === 1) {
    result = (result + 1) % MOD;
  }

  // 处理 x >= 2：depth(x) = 1 + depth(popcount(x))
  // 对每个 popcount 值 p，若 1+depth[p]==k，统计 [start, r] 中 popcount 为 p 的数
  const start: number = Math.max(2, l);
  if (start <= r) {
    for (let p = 1; p <= maxBits; p++) {
      if (1 + depth[p] === k) {
        const cntR: number = countWithBits(r, p, C);
        const cntL: number = countWithBits(start - 1, p, C);
        result = (result + cntR - cntL + MOD) % MOD;
      }
    }
  }

  return result;
}

// ---- 方法2：暴力枚举（适用于小范围）----
// 直接遍历 [l, r] 中每个整数，递归计算 depth
function getDepth(x: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;
  return 1 + getDepth(popcount(x));
}

function countIntegersWithBitCountDepthKIIBrute(l: number, r: number, k: number): number {
  let count: number = 0;
  for (let x = l; x <= r; x++) {
    if (getDepth(x) === k) {
      count++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 位计数深度为 K 的整数数目 II =====");

// 小范围测试，两种方法对比验证
console.log(
  "[0, 15, k=0] 方法1:",
  countIntegersWithBitCountDepthKII(0, 15, 0),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 15, 0),
); // 期望: 1

console.log(
  "[0, 15, k=1] 方法1:",
  countIntegersWithBitCountDepthKII(0, 15, 1),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 15, 1),
); // 期望: 1

console.log(
  "[0, 15, k=2] 方法1:",
  countIntegersWithBitCountDepthKII(0, 15, 2),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 15, 2),
); // 期望: 3

console.log(
  "[0, 15, k=3] 方法1:",
  countIntegersWithBitCountDepthKII(0, 15, 3),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 15, 3),
); // 期望: 7

console.log(
  "[0, 15, k=4] 方法1:",
  countIntegersWithBitCountDepthKII(0, 15, 4),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 15, 4),
); // 期望: 4

console.log(
  "[3, 10, k=3] 方法1:",
  countIntegersWithBitCountDepthKII(3, 10, 3),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(3, 10, 3),
); // 期望: 5

console.log(
  "[0, 200, k=5] 方法1:",
  countIntegersWithBitCountDepthKII(0, 200, 5),
  " 方法2:",
  countIntegersWithBitCountDepthKIIBrute(0, 200, 5),
); // 期望: 2

// 大范围测试（仅方法1，方法2无法在合理时间内完成）
console.log("[1, 10^15, k=5] 方法1:", countIntegersWithBitCountDepthKII(1, 1e15, 5));

export {};
