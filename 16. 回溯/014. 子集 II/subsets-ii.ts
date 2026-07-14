// ============================================================
// 014. 子集 II
// ============================================================
// LeetCode 90. Subsets II
// 给定一个可能包含重复元素的整数数组，返回所有可能的子集（不重复）。
// 时间复杂度：O(n * 2^n)

// 方法1：排序 + 回溯 + 去重（推荐）
// 先排序使相同元素相邻，回溯时同层跳过重复元素
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n) 递归栈
function subsetsWithDup(nums: number[]): number[][] {
  const result: number[][] = [];
  // 排序使相同元素相邻
  nums.sort((a: number, b: number) => a - b);
  const path: number[] = [];

  const backtrack = (start: number): void => {
    // 每个节点收集一个子集
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      // 去重：同层中跳过与前一个相同的元素
      if (i > start && nums[i] === nums[i - 1]) {
        continue;
      }
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：迭代去重
// 基于迭代扩展法，遇到重复元素时只在上一次新增的子集上扩展
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n * 2^n)
function subsetsWithDupIter(nums: number[]): number[][] {
  // 排序使相同元素相邻
  nums.sort((a: number, b: number) => a - b);
  let result: number[][] = [[]];
  let prevSize: number = 0; // 上一次新增子集的起始位置
  for (let i = 0; i < nums.length; i++) {
    const newSubsets: number[][] = [];
    // 若当前元素与前一个相同，只在上一次新增的子集上扩展
    const start: number = i > 0 && nums[i] === nums[i - 1] ? prevSize : 0;
    for (let j = start; j < result.length; j++) {
      newSubsets.push([...result[j], nums[i]]);
    }
    prevSize = result.length;
    result = result.concat(newSubsets);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 子集 II =====");
console.log(subsetsWithDup([1, 2, 2])); // 期望结果: [[],[1],[1,2],[1,2,2],[2],[2,2]]
console.log(subsetsWithDup([0])); // 期望结果: [[],[0]]
console.log(subsetsWithDup([4, 4, 4, 1, 4])); // 期望结果: 所有唯一子集
console.log(subsetsWithDupIter([1, 2, 2])); // 期望结果: [[],[1],[1,2],[1,2,2],[2],[2,2]]
console.log(subsetsWithDupIter([0])); // 期望结果: [[],[0]]

export {};
