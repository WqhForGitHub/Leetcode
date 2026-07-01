// ============================================================
// 011. 两数之和 II - 输入有序数组
// ============================================================
// LeetCode 167. Two Sum II - Input Array Is Sorted
// 给定已升序排列的数组，找到两个数使得它们的和等于目标值，返回下标（1-based）。

// 方法1：双指针（推荐）
function twoSumII(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}

// 方法2：二分查找
function twoSumIIBinarySearch(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    let left = i + 1;
    let right = numbers.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (numbers[mid] === complement) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] < complement) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return [-1, -1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 两数之和 II - 输入有序数组 =====");
console.log("双指针 [2,7,11,15],9:", twoSumII([2, 7, 11, 15], 9)); // [1,2]
console.log("双指针 [2,3,4],6:", twoSumII([2, 3, 4], 6)); // [1,3]
console.log("二分 [2,7,11,15],9:", twoSumIIBinarySearch([2, 7, 11, 15], 9)); // [1,2]

export {};
