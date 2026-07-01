// ============================================================
// 103. 按奇偶排序数组
// ============================================================
// LeetCode 905. Sort Array By Parity
// 将数组重排使得所有偶数在前、奇数在后，顺序任意。

// 方法1：双指针原地交换（推荐，时间 O(n)，空间 O(1)）
// left 找到第一个奇数，right 找到第一个偶数，交换。
function sortArrayByParity(nums: number[]): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    while (left < right && nums[left] % 2 === 0) {
      left++; // 左侧已是偶数，跳过
    }
    while (left < right && nums[right] % 2 === 1) {
      right--; // 右侧已是奇数，跳过
    }
    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }
  return nums;
}

// 方法2：额外空间两趟遍历（时间 O(n)，空间 O(n)）
// 先收集所有偶数，再收集所有奇数，简单直观。
function sortArrayByParityTwoPass(nums: number[]): number[] {
  const result: number[] = [];
  for (const x of nums) {
    if (x % 2 === 0) result.push(x);
  }
  for (const x of nums) {
    if (x % 2 === 1) result.push(x);
  }
  return result;
}

// 方法3：双指针写回新数组（时间 O(n)，空间 O(n)）
// 一次遍历，偶数放头部、奇数放尾部，保持相对顺序。
function sortArrayByParityFill(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(0);
  let head = 0;
  let tail = n - 1;
  for (const x of nums) {
    if (x % 2 === 0) {
      result[head++] = x;
    } else {
      result[tail--] = x;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 按奇偶排序数组 =====");
console.log("方法1:", sortArrayByParity([3, 1, 2, 4])); // 期望: 偶数在前，如 [2,4,1,3] 或 [4,2,3,1] 等
console.log("方法1:", sortArrayByParity([0])); // 期望: [0]
console.log("方法2:", sortArrayByParityTwoPass([3, 1, 2, 4])); // 期望: [2,4,3,1]
console.log("方法3:", sortArrayByParityFill([3, 1, 2, 4])); // 期望: [2,4,1,3]

export {};
