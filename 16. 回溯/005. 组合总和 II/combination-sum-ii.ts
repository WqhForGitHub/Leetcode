// ============================================================
// 005. 组合总和 II
// ============================================================
// LeetCode 40. Combination Sum II
// 给定可能含重复元素的候选数组 candidates 和目标数 target，
// 找出所有使数字之和为 target 的唯一组合。每个数字在每个组合中最多用一次。
// 时间复杂度：O(2^n)，最坏情况

// 方法1：排序 + 回溯 + 去重（推荐）
// 先排序，回溯时跳过同层相同元素以去重
// 时间复杂度 O(2^n)，空间复杂度 O(n) 递归栈
function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  // 排序使相同元素相邻，便于去重和剪枝
  candidates.sort((a: number, b: number) => a - b);

  const backtrack = (start: number, remain: number, path: number[]): void => {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      // 剪枝：当前数已大于剩余值
      if (candidates[i] > remain) {
        break;
      }
      // 去重：同一层中跳过与前一个相同的元素
      // i > start 确保只跳过同层重复，不跳过纵向（深度方向）重复
      if (i > start && candidates[i] === candidates[i - 1]) {
        continue;
      }
      path.push(candidates[i]);
      // 每个数只能用一次，下一轮从 i+1 开始
      backtrack(i + 1, remain - candidates[i], path);
      path.pop();
    }
  };

  backtrack(0, target, []);
  return result;
}

// 方法2：计数 + 回溯
// 先统计每个数字的出现次数，回溯时按数字种类枚举使用 0~count 次
// 时间复杂度 O(2^n)，空间复杂度 O(n)
function combinationSum2Count(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  // 统计每个数字出现的次数
  const countMap: Map<number, number> = new Map();
  for (const num of candidates) {
    countMap.set(num, (countMap.get(num) ?? 0) + 1);
  }
  // 转为数组 [数字, 次数]
  const counts: [number, number][] = [];
  countMap.forEach((cnt: number, num: number) => {
    counts.push([num, cnt]);
  });
  // 按数字排序
  counts.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);

  const backtrack = (idx: number, remain: number, path: number[]): void => {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    if (idx === counts.length) {
      return;
    }
    const [num, cnt]: [number, number] = counts[idx];
    // 剪枝：当前数已大于剩余值，后面更大直接返回
    if (num > remain) {
      return;
    }
    // 枚举使用该数字 k 次，k 从 0 到 cnt，且 k*num <= remain
    const maxUse: number = Math.min(cnt, Math.floor(remain / num));
    for (let k = 0; k <= maxUse; k++) {
      // 添加 k 个 num
      for (let j = 0; j < k; j++) {
        path.push(num);
      }
      backtrack(idx + 1, remain - k * num, path);
      // 回溯移除
      for (let j = 0; j < k; j++) {
        path.pop();
      }
    }
  };

  backtrack(0, target, []);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 组合总和 II =====");
console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8)); // 期望结果: [[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2([2, 5, 2, 1, 2], 5)); // 期望结果: [[1,2,2],[5]]
console.log(combinationSum2Count([10, 1, 2, 7, 6, 1, 5], 8)); // 期望结果: [[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2Count([2, 5, 2, 1, 2], 5)); // 期望结果: [[1,2,2],[5]]

export {};
