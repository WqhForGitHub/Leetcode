// ============================================================
// 120. 组合总和 II
// ============================================================
// 面试金典 08.08 进阶 / LeetCode 40. Combination Sum II
// 给定含重复元素的 candidates 和 target，找出所有和为 target 的不同组合。
// 每个元素最多使用一次。

// 时间复杂度：O(2^n) 最坏
// 空间复杂度：O(n) 递归栈

// 方法1：排序 + 回溯 + 去重
// 排序后回溯，同一层中跳过重复元素以避免重复组合。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const sorted: number[] = [...candidates].sort((a, b) => a - b);

  function backtrack(start: number, remain: number): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    for (let i: number = start; i < sorted.length; i++) {
      // 同层去重：与前一元素相同且非本层起点则跳过
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      if (sorted[i] > remain) break; // 剪枝
      path.push(sorted[i]);
      backtrack(i + 1, remain - sorted[i]); // 每个元素用一次
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}

// 方法2：计数 + 回溯
// 先统计每个数的频次，再按不同数值回溯，枚举该数选 0..count 次。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function combinationSum2_2(candidates: number[], target: number): number[][] {
  const countMap: Map<number, number> = new Map();
  for (const c of candidates) countMap.set(c, (countMap.get(c) ?? 0) + 1);
  const uniqueNums: number[] = Array.from(countMap.keys()).sort((a, b) => a - b);

  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(index: number, remain: number): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    if (index === uniqueNums.length) return;
    const num: number = uniqueNums[index];
    const maxCount: number = countMap.get(num)!;
    // 选 cnt 个 num（0..maxCount 且 cnt*num <= remain）
    for (let cnt: number = 0; cnt * num <= remain && cnt <= maxCount; cnt++) {
      for (let k: number = 0; k < cnt; k++) path.push(num);
      backtrack(index + 1, remain - cnt * num);
      for (let k: number = 0; k < cnt; k++) path.pop();
    }
  }

  backtrack(0, target);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 组合总和 II =====");
console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
// 期望: [[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2_2([10, 1, 2, 7, 6, 1, 5], 8));
console.log(combinationSum2([2, 5, 2, 1, 2], 5)); // 期望: [[1,2,2],[5]]
console.log(combinationSum2_2([2, 5, 2, 1, 2], 5));

export {};
