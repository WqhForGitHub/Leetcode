// ============================================================
// 117. 有序数组的平方
// ============================================================
// LeetCode 977. Squares of a Sorted Array
// 给定非递减排序数组（可能含负数），返回各元素平方后的非递减排序数组。

// 方法1：双指针从两端向中间（推荐，O(n) 时间，O(n) 空间）
// 平方后两端最大、中间最小，从两端选较大者放到结果数组末尾。
function sortedSquares(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n);
  let left = 0;
  let right = n - 1;
  let pos = n - 1;
  while (left <= right) {
    const leftSq = nums[left] * nums[left];
    const rightSq = nums[right] * nums[right];
    if (leftSq > rightSq) {
      result[pos] = leftSq;
      left++;
    } else {
      result[pos] = rightSq;
      right--;
    }
    pos--;
  }
  return result;
}

// 方法2：平方后直接排序（O(n log n) 时间，O(n) 空间）
// 简单直观，但未利用数组已有序的性质。
function sortedSquaresNaive(nums: number[]): number[] {
  return nums.map((x) => x * x).sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 有序数组的平方 =====");
console.log("方法1 [-4,-1,0,3,10]:", sortedSquares([-4, -1, 0, 3, 10])); // 期望 [0,1,9,16,100]
console.log("方法1 [-7,-3,2,3,11]:", sortedSquares([-7, -3, 2, 3, 11])); // 期望 [4,9,9,49,121]
console.log("方法1 [-1]:", sortedSquares([-1])); // 期望 [1]
console.log("方法1 [0,1,2]:", sortedSquares([0, 1, 2])); // 期望 [0,1,4]
console.log("方法1 [-5,-3,-2]:", sortedSquares([-5, -3, -2])); // 期望 [4,9,25]
console.log("方法2 [-4,-1,0,3,10]:", sortedSquaresNaive([-4, -1, 0, 3, 10])); // 期望 [0,1,9,16,100]
console.log("方法2 [-7,-3,2,3,11]:", sortedSquaresNaive([-7, -3, 2, 3, 11])); // 期望 [4,9,9,49,121]

export {};
