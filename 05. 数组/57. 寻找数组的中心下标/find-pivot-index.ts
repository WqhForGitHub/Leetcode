// ============================================================
// 57. 寻找数组的中心下标
// ============================================================
// LeetCode 724. Find Pivot Index
// 给定整数数组 nums，找到中心下标（左侧元素和等于右侧元素和）。
// 如果不存在返回 -1。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：前缀和-总和减去左侧和（推荐）
// 总和 total 固定，遍历时维护左侧和 leftSum，
// 右侧和 = total - leftSum - nums[i]，相等则为中心下标
function pivotIndex(nums: number[]): number {
  const total = nums.reduce((sum, v) => sum + v, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) {
      return i;
    }
    leftSum += nums[i];
  }
  return -1;
}

// 方法2：左右分别求和
// 先把右侧和初始化为总和，遍历时把当前元素从右侧移除，
// 再与左侧和比较，比较后再把当前元素加入左侧
function pivotIndexTwoSum(nums: number[]): number {
  let leftSum = 0;
  let rightSum = nums.reduce((sum, v) => sum + v, 0);
  for (let i = 0; i < nums.length; i++) {
    rightSum -= nums[i]; // 当前元素移出右侧
    if (leftSum === rightSum) {
      return i;
    }
    leftSum += nums[i]; // 当前元素加入左侧
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 57. 寻找数组的中心下标 =====");
console.log("描述:", pivotIndex([1, 7, 3, 6, 5, 6])); // 期望结果: 3
console.log("描述:", pivotIndex([1, 2, 3])); // 期望结果: -1
console.log("描述:", pivotIndex([2, 1, -1])); // 期望结果: 0
console.log("描述:", pivotIndexTwoSum([1, 7, 3, 6, 5, 6])); // 期望结果: 3
console.log("描述:", pivotIndexTwoSum([1, 2, 3])); // 期望结果: -1
console.log("描述:", pivotIndexTwoSum([2, 1, -1])); // 期望结果: 0

export {};
