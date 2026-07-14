// ============================================================
// 011. 子集
// ============================================================
// LeetCode 78. Subsets
// 给定一个不含重复元素的整数数组，返回其所有可能的子集（幂集）。
// 时间复杂度：O(n * 2^n)，共 2^n 个子集

// 方法1：回溯（推荐）
// 从 start 开始，每个元素可选或不选，回溯枚举所有子集
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n) 递归栈
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number): void => {
    // 每个节点都收集一个子集（包括空集）
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：迭代位运算
// 用 0 到 2^n - 1 的二进制表示，每一位代表对应元素是否选取
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n)
function subsetsBit(nums: number[]): number[][] {
  const result: number[][] = [];
  const n: number = nums.length;
  const total: number = 1 << n; // 2^n 个子集
  for (let mask = 0; mask < total; mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) {
      // 检查第 i 位是否为 1
      if ((mask & (1 << i)) !== 0) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  return result;
}

// 方法3：迭代扩展
// 从空集开始，每加入一个新元素，将已有子集都复制并追加该元素
// 时间复杂度 O(n * 2^n)，空间复杂度 O(n * 2^n)
function subsetsIter(nums: number[]): number[][] {
  let result: number[][] = [[]];
  for (const num of nums) {
    const newSubsets: number[][] = [];
    for (const existing of result) {
      newSubsets.push([...existing, num]);
    }
    result = result.concat(newSubsets);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 子集 =====");
console.log(subsets([1, 2, 3])); // 期望结果: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
console.log(subsets([0])); // 期望结果: [[],[0]]
console.log(subsetsBit([1, 2, 3])); // 期望结果: 8 个子集
console.log(subsetsIter([1, 2, 3])); // 期望结果: 8 个子集

export {};
