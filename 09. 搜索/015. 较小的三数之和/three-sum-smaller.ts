// ============================================================
// 015. 较小的三数之和
// ============================================================
// LeetCode 259. 3Sum Smaller
// 给定数组，统计满足 i<j<k 且 nums[i]+nums[j]+nums[k]<target 的三元组个数。

// 方法1：排序 + 双指针（O(n²)）
function threeSumSmaller(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < target) {
        count += right - left; // right 及之前都满足
        left++;
      } else {
        right--;
      }
    }
  }
  return count;
}

// 方法2：排序 + 二分查找（O(n² log n)）
function threeSumSmallerBinary(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      const need = target - nums[i] - nums[j];
      // 找 nums[j+1..] 中小于 need 的个数
      let left = j + 1;
      let right = nums.length - 1;
      let bound = j; // 第一个 >= need 的位置
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] < need) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      count += left - j - 1;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 较小的三数之和 =====");
console.log("双指针 [-2,0,1,3],2:", threeSumSmaller([-2, 0, 1, 3], 2)); // 2
console.log("双指针 [],5:", threeSumSmaller([], 5)); // 0
console.log("二分 [-2,0,1,3],2:", threeSumSmallerBinary([-2, 0, 1, 3], 2)); // 2

export {};
