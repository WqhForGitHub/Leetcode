// ============================================================
// 112. K 因数分解
// ============================================================
// 给定 n 和 k，判断 n 是否能表示为恰好 k 个大于 1 的因子的乘积。
// 返回字典序最小的分解方案，如果不可能则返回空数组。
// 时间复杂度：O(n^k), 空间复杂度：O(k)

// 方法1：回溯（从最小因子开始尝试）（推荐）
// 递归地分解 n，每次选择一个因子，直到选满 k 个
// 时间复杂度 O(sqrt(n)^k), 空间复杂度 O(k)
function kFactorization(n: number, k: number): number[] {
  const result: number[] = [];

  function backtrack(
    remaining: number,
    factorsLeft: number,
    minFactor: number,
    path: number[],
  ): boolean {
    // 如果只剩一个因子，必须等于 remaining
    if (factorsLeft === 1) {
      if (remaining >= minFactor) {
        result.push(...path, remaining);
        return true;
      }
      return false;
    }

    // 尝试从 minFactor 开始的每个因子
    for (let f = minFactor; f * f <= remaining; f++) {
      if (remaining % f === 0) {
        if (backtrack(remaining / f, factorsLeft - 1, f, [...path, f])) {
          return true;
        }
      }
    }
    return false;
  }

  if (backtrack(n, k, 2, [])) {
    return result;
  }
  return [];
}

// 方法2：回溯 + 剪枝
// 在方法1基础上增加剪枝：如果 remaining 无法分解为 factorsLeft 个 >= minFactor 的因子
// 时间复杂度 O(sqrt(n)^k), 空间复杂度 O(k)
function kFactorizationPruned(n: number, k: number): number[] {
  const result: number[] = [];

  function backtrack(
    remaining: number,
    factorsLeft: number,
    minFactor: number,
    path: number[],
  ): boolean {
    if (factorsLeft === 0) {
      return remaining === 1;
    }
    // 剪枝：remaining 至少为 minFactor^factorsLeft
    if (remaining < Math.pow(minFactor, factorsLeft)) {
      return false;
    }
    // 剪枝：remaining 最多为 minFactor^(factorsLeft-1) * remaining
    // 但如果 factorsLeft === 1，直接检查
    if (factorsLeft === 1) {
      if (remaining >= minFactor) {
        result.push(...path, remaining);
        return true;
      }
      return false;
    }

    for (let f = minFactor; f * f <= remaining; f++) {
      if (remaining % f === 0) {
        path.push(f);
        if (backtrack(remaining / f, factorsLeft - 1, f, path)) {
          return true;
        }
        path.pop();
      }
    }
    return false;
  }

  if (backtrack(n, k, 2, [])) {
    return result;
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. K 因数分解 =====");
console.log(kFactorization(12, 3)); // 期望结果: [2, 2, 3]
console.log(kFactorization(32, 2)); // 期望结果: [2, 16]
console.log(kFactorization(7, 2)); // 期望结果: []
console.log("--- 方法2测试 ---");
console.log(kFactorizationPruned(12, 3)); // 期望结果: [2, 2, 3]
console.log(kFactorizationPruned(32, 2)); // 期望结果: [2, 16]
console.log(kFactorizationPruned(7, 2)); // 期望结果: []

export {};
