// ============================================================
// 077. 分配重复整数
// ============================================================
// LeetCode 1655. Distribute Repeating Integers
// 给定 nums 数组和 quantity 数组，将 nums 分配给顾客：第 i 个顾客需要 quantity[i] 个
// 相同的整数。每个整数（按值）最多服务一个顾客。判断能否满足所有顾客。
// 时间复杂度：O(k * 3^m)，k 为不同整数值数，m 为顾客数。

// 方法1：状态压缩DP (推荐)
// dp[mask] 表示用已处理过的值能否满足 mask 中的顾客。
// 对每个值（频次 c），枚举它可以新满足的顾客子集 sub（sum[sub] <= c）。
// 时间复杂度：O(k * 3^m)，空间复杂度：O(2^m)
function canDistribute1(nums: number[], quantity: number[]): boolean {
  // 统计每个值的出现次数
  const cntMap: Map<number, number> = new Map();
  for (const x of nums) cntMap.set(x, (cntMap.get(x) ?? 0) + 1);
  const cnts: number[] = [...cntMap.values()];
  const m: number = quantity.length;
  const fullMask: number = (1 << m) - 1;

  // 预计算每个子集的 quantity 之和
  const sum: number[] = new Array(1 << m).fill(0);
  for (let mask: number = 0; mask < 1 << m; mask++) {
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) sum[mask] += quantity[i];
    }
  }

  let dp: boolean[] = new Array(1 << m).fill(false);
  dp[0] = true;

  for (const c of cnts) {
    const newDp: boolean[] = [...dp]; // 不使用当前值
    for (let mask: number = 0; mask < 1 << m; mask++) {
      if (!dp[mask]) continue;
      const remaining: number = fullMask ^ mask;
      // 枚举当前值新满足的顾客子集
      for (let sub: number = remaining; sub > 0; sub = (sub - 1) & remaining) {
        if (sum[sub] <= c) {
          newDp[mask | sub] = true;
        }
      }
    }
    dp = newDp;
    if (dp[fullMask]) return true; // 提前返回
  }

  return dp[fullMask];
}

// 方法2：回溯+记忆化
// 按值从大到小排序，对每个值决定服务哪些顾客（子集），递归处理。
// 用 (值下标, 已满足顾客 mask) 作为记忆化键。
// 时间复杂度：O(k * 3^m)，空间复杂度：O(k * 2^m)
function canDistribute2(nums: number[], quantity: number[]): boolean {
  const cntMap: Map<number, number> = new Map();
  for (const x of nums) cntMap.set(x, (cntMap.get(x) ?? 0) + 1);
  // 按频次从大到小排序（更快剪枝）
  const cnts: number[] = [...cntMap.values()].sort((a: number, b: number) => b - a);
  const m: number = quantity.length;
  const fullMask: number = (1 << m) - 1;

  // 预计算每个子集的 quantity 之和
  const sum: number[] = new Array(1 << m).fill(0);
  for (let mask: number = 0; mask < 1 << m; mask++) {
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) sum[mask] += quantity[i];
    }
  }

  const memo: Map<string, boolean> = new Map();

  const backtrack = (cntIdx: number, mask: number): boolean => {
    if (mask === fullMask) return true; // 所有顾客都已满足
    if (cntIdx === cnts.length) return false;

    const key: string = `${cntIdx},${mask}`;
    if (memo.has(key)) return memo.get(key)!;

    // 不使用当前值
    if (backtrack(cntIdx + 1, mask)) {
      memo.set(key, true);
      return true;
    }

    // 使用当前值服务某个未满足顾客子集
    const c: number = cnts[cntIdx];
    const remaining: number = fullMask ^ mask;
    for (let sub: number = remaining; sub > 0; sub = (sub - 1) & remaining) {
      if (sum[sub] <= c) {
        if (backtrack(cntIdx + 1, mask | sub)) {
          memo.set(key, true);
          return true;
        }
      }
    }

    memo.set(key, false);
    return false;
  };

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 分配重复整数 =====");
console.log(canDistribute1([1, 2, 3, 4], [2])); // 期望结果: false（无值出现 >= 2 次）
console.log(canDistribute1([1, 2, 3, 3], [2])); // 期望结果: true
console.log(canDistribute1([1, 1, 2, 2], [2, 2])); // 期望结果: true
console.log(canDistribute1([1, 1, 2, 3], [2, 2])); // 期望结果: false
console.log(canDistribute1([1, 1, 1, 1, 1], [2, 3])); // 期望结果: true
console.log(canDistribute2([1, 2, 3, 4], [2])); // 期望结果: false
console.log(canDistribute2([1, 2, 3, 3], [2])); // 期望结果: true
console.log(canDistribute2([1, 1, 2, 2], [2, 2])); // 期望结果: true

export {};
