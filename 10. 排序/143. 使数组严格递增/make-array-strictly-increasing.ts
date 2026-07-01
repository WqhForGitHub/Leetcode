// ============================================================
// 143. 使数组严格递增
// ============================================================
// LeetCode 1187. Make Array Strictly Increasing
// 给定两个整数数组 arr1 和 arr2，每次操作可用 arr2 中任意元素替换 arr1 中的某个
// 元素（arr2 中元素可重复使用）。返回使 arr1 严格递增所需的最少操作数；若不可行返回 -1。

// 方法1：排序 arr2 + 动态规划（推荐，时间 O(n * m * log m)）
// 状态：dp 为 Map<lastVal, minOps>，表示处理完当前前缀后，末尾值为 lastVal 时
// 所需的最少操作数。对 arr1 中每个元素 x：
//   - 保留 x：若 x > lastVal，则转移到 (x, ops)
//   - 替换 x：在 arr2 中二分找最小的大于 lastVal 的 y，转移到 (y, ops + 1)
// 由于每步 newDp 的键取自 {x} ∪ arr2，状态数 O(m)，整体 O(n * m * log m)。
function makeArrayStrictlyIncreasing(arr1: number[], arr2: number[]): number {
  // 去重并排序 arr2
  const sortedArr2: number[] = Array.from(new Set(arr2)).sort((a, b) => a - b);
  const m = sortedArr2.length;

  // 二分：返回 sortedArr2 中严格大于 val 的最小元素下标；不存在返回 m
  const upperBound = (val: number): number => {
    let lo = 0;
    let hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sortedArr2[mid] <= val) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  };

  // dp: 末尾值 -> 最少操作数。初始用 -Infinity 表示“前缀为空”。
  let dp = new Map<number, number>();
  dp.set(-Infinity, 0);

  for (const x of arr1) {
    const newDp = new Map<number, number>();
    for (const [lastVal, ops] of dp) {
      // 选项1：保留 x
      if (x > lastVal) {
        const cur = newDp.get(x);
        if (cur === undefined || ops < cur) {
          newDp.set(x, ops);
        }
      }
      // 选项2：用 arr2 中大于 lastVal 的最小元素替换 x
      const idx = upperBound(lastVal);
      if (idx < m) {
        const y = sortedArr2[idx];
        const nextOps = ops + 1;
        const cur = newDp.get(y);
        if (cur === undefined || nextOps < cur) {
          newDp.set(y, nextOps);
        }
      }
    }
    dp = newDp;
    if (dp.size === 0) return -1; // 无法继续，提前终止
  }

  let ans = Infinity;
  for (const ops of dp.values()) {
    if (ops < ans) ans = ops;
  }
  return ans === Infinity ? -1 : ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 143. 使数组严格递增 =====");
console.log("方法1:", makeArrayStrictlyIncreasing([1, 5, 3, 6, 7], [1, 3, 2, 4])); // 期望: 1
console.log("方法1:", makeArrayStrictlyIncreasing([1, 5, 3, 6, 7], [4, 3, 1])); // 期望: 2
console.log("方法1:", makeArrayStrictlyIncreasing([1, 5, 3, 6, 7], [1, 6, 3, 3])); // 期望: -1
console.log("方法1:", makeArrayStrictlyIncreasing([1, 2, 3, 4, 5], [])); // 期望: 0（arr2 为空但 arr1 已严格递增）

export {};
