// ============================================================
// 125. 删除最短的子数组使剩余数组有序
// ============================================================
// LeetCode 1574. Shortest Subarray to be Removed to Make Array Sorted
// 删除一个连续子数组使剩余部分非递减，求最短删除长度。

// 方法1：双指针 + 二分查找
function findLengthOfShortestSubarray(arr: number[]): number {
  const n = arr.length;
  // 找左端非递减的前缀
  let left = 0;
  while (left + 1 < n && arr[left] <= arr[left + 1]) left++;
  if (left === n - 1) return 0; // 已经有序
  // 找右端非递减的后缀
  let right = n - 1;
  while (right > 0 && arr[right - 1] <= arr[right]) right--;
  // 完全删除左半或右半
  let result = Math.min(n - left - 1, right);
  // 尝试合并左前缀和右后缀
  let i = 0;
  let j = right;
  while (i <= left && j < n) {
    if (arr[i] <= arr[j]) {
      result = Math.min(result, j - i - 1);
      i++;
    } else {
      j++;
    }
  }
  return result;
}

// 方法2：二分查找
function findLengthOfShortestSubarrayBinary(arr: number[]): number {
  const n = arr.length;
  let left = 0;
  while (left + 1 < n && arr[left] <= arr[left + 1]) left++;
  if (left === n - 1) return 0;
  let right = n - 1;
  while (right > 0 && arr[right - 1] <= arr[right]) right--;
  let result = Math.min(n - left - 1, right);
  // 对左前缀每个元素，在右后缀中二分找第一个 >= 的
  for (let i = 0; i <= left; i++) {
    let lo = right;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] >= arr[i]) hi = mid;
      else lo = mid + 1;
    }
    if (lo < n) {
      result = Math.min(result, lo - i - 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 删除最短的子数组使剩余数组有序 =====");
console.log("双指针 [1,2,3,10,4,2,3,5]:", findLengthOfShortestSubarray([1, 2, 3, 10, 4, 2, 3, 5])); // 3
console.log("双指针 [5,4,3,2,1]:", findLengthOfShortestSubarray([5, 4, 3, 2, 1])); // 4
console.log("双指针 [1,2,3]:", findLengthOfShortestSubarray([1, 2, 3])); // 0
console.log("二分 [1,2,3,10,4,2,3,5]:", findLengthOfShortestSubarrayBinary([1, 2, 3, 10, 4, 2, 3, 5])); // 3

export {};
