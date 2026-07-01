// ============================================================
// 173. 找出数组排序后的目标下标
// ============================================================
// LeetCode 2089. Find Target Indices After Sorting Array
// 将数组升序排序后，返回值为 target 的元素下标列表。

// 方法1：计数法（统计比 target 小和等于 target 的个数）
function targetIndices(nums: number[], target: number): number[] {
  let lessThan = 0;
  let equalTo = 0;
  for (const num of nums) {
    if (num < target) lessThan++;
    else if (num === target) equalTo++;
  }
  const result: number[] = [];
  for (let i = 0; i < equalTo; i++) {
    result.push(lessThan + i);
  }
  return result;
}

// 方法2：排序后直接查找
function targetIndicesSort(nums: number[], target: number): number[] {
  nums.sort((a, b) => a - b);
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) result.push(i);
  }
  return result;
}

// 方法3：排序 + 二分查找
function targetIndicesBinary(nums: number[], target: number): number[] {
  nums.sort((a, b) => a - b);
  // 找第一个等于 target 的位置
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const start = lo;
  // 找第一个大于 target 的位置
  lo = 0;
  hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  const end = lo;
  const result: number[] = [];
  for (let i = start; i < end; i++) result.push(i);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 173. 找出数组排序后的目标下标 =====");
console.log("计数 [1,2,5,2,3],2:", targetIndices([1, 2, 5, 2, 3], 2)); // [1,2]
console.log("计数 [1,2,5,2,3],3:", targetIndices([1, 2, 5, 2, 3], 3)); // [3]
console.log("计数 [1,2,5,2,3],5:", targetIndices([1, 2, 5, 2, 3], 5)); // [4]
console.log("排序 [1,2,5,2,3],2:", targetIndicesSort([1, 2, 5, 2, 3], 2)); // [1,2]
console.log("二分 [1,2,5,2,3],2:", targetIndicesBinary([1, 2, 5, 2, 3], 2)); // [1,2]

export {};
