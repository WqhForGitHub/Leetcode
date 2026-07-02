// ============================================================
// 131. 受标签影响的最大值
// ============================================================
// LeetCode 1090. Largest Values From Labels
// 给定 values 与 labels 数组，最多选 num_wanted 个物品，且同一 label 最多
// 使用 use_limit 次。求所选物品 value 之和的最大值。

// 方法1：按 value 降序贪心 + label 计数（O(n log n)）
// 将物品按价值降序排序，依次尝试选取；若该 label 已达 use_limit 则跳过。
function largestValsFromLabels(
  values: number[],
  labels: number[],
  numWanted: number,
  useLimit: number,
): number {
  const n = values.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  // 按价值降序排序
  idx.sort((a, b) => values[b] - values[a]);

  const labelCount = new Map<number, number>();
  let sum = 0;
  let picked = 0;
  for (const i of idx) {
    if (picked === numWanted) break;
    const lab = labels[i];
    const used = labelCount.get(lab) ?? 0;
    if (used >= useLimit) continue;
    labelCount.set(lab, used + 1);
    sum += values[i];
    picked++;
  }
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 受标签影响的最大值 =====");
console.log(largestValsFromLabels([5, 4, 3, 2, 1], [1, 1, 2, 2, 3], 3, 1)); // 期望: 9
console.log(largestValsFromLabels([5, 4, 3, 2, 1], [1, 3, 3, 3, 2], 3, 2)); // 期望: 12
console.log(largestValsFromLabels([9, 8, 8, 7, 6], [0, 0, 0, 1, 1], 3, 1)); // 期望: 16

export {};
