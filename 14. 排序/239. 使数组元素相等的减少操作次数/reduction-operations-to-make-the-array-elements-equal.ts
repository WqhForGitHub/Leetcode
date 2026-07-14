// ============================================================
// 239. 使数组元素相等的减少操作次数
// ============================================================
// LeetCode 1887. Reduction Operations to Make the Array Elements Equal
// 每次操作：找到数组中最大元素，将其减小为「次大」值。
// 问使所有元素相等所需的最少操作次数。

// 方法1：升序排序 + 逐元素累加不同层数（O(n log n)）
// 排序后，每个元素需要被降低的次数等于比它严格小的不同值个数。
function reductionOperations1(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let ops = 0;
  let distinct = 0; // 当前元素之前出现的不同值个数
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) distinct++;
    ops += distinct;
  }
  return ops;
}

// 方法2：排序 + 频次/首位置统计（O(n log n)）
// 对每个非最小不同值 v_j，贡献操作数 = 元素中 >= v_j 的个数。
function reductionOperations2(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const firstIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i === 0 || nums[i] !== nums[i - 1]) firstIdx.push(i);
  }
  // firstIdx[j] 为第 j 个不同值首次出现的下标
  // 除最小值外，每个不同值贡献 (n - firstIdx[j]) 次操作
  let ops = 0;
  for (let j = 1; j < firstIdx.length; j++) {
    ops += n - firstIdx[j];
  }
  return ops;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 239. 使数组元素相等的减少操作次数 =====");
console.log("方法1 [5,3,1]:", reductionOperations1([5, 3, 1])); // 3
console.log("方法2 [5,3,1]:", reductionOperations2([5, 3, 1])); // 3
console.log("方法1 [1,1,1]:", reductionOperations1([1, 1, 1])); // 0
console.log("方法2 [1,1,1]:", reductionOperations2([1, 1, 1])); // 0
console.log("方法1 [1,1,2,2,3]:", reductionOperations1([1, 1, 2, 2, 3])); // 4
console.log("方法2 [1,1,2,2,3]:", reductionOperations2([1, 1, 2, 2, 3])); // 4

export {};
