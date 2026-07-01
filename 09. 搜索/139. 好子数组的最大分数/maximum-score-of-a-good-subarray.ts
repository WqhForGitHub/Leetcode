// ============================================================
// 139. 好子数组的最大分数
// ============================================================
// LeetCode 1793. Maximum Score of a Good Subarray
// 包含下标 k 的子数组，分数 = 长度 × 最小值，求最大分数。

// 方法1：双指针扩展
function maximumScore(nums: number[], k: number): number {
  const n = nums.length;
  let left = k;
  let right = k;
  let minVal = nums[k];
  let maxScore = minVal;
  while (left > 0 || right < n - 1) {
    if (left > 0 && right < n - 1) {
      if (nums[left - 1] > nums[right + 1]) {
        left--;
        minVal = Math.min(minVal, nums[left]);
      } else {
        right++;
        minVal = Math.min(minVal, nums[right]);
      }
    } else if (left > 0) {
      left--;
      minVal = Math.min(minVal, nums[left]);
    } else {
      right++;
      minVal = Math.min(minVal, nums[right]);
    }
    maxScore = Math.max(maxScore, minVal * (right - left + 1));
  }
  return maxScore;
}

// 方法2：单调栈 + 二分查找
function maximumScoreStack(nums: number[], k: number): number {
  const n = nums.length;
  // 找每个位置左右第一个更小的位置
  const leftSmaller = new Array(n).fill(-1);
  const rightSmaller = new Array(n).fill(n);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) leftSmaller[i] = stack[stack.length - 1];
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) rightSmaller[i] = stack[stack.length - 1];
    stack.push(i);
  }
  let maxScore = 0;
  for (let i = 0; i < n; i++) {
    const l = leftSmaller[i] + 1;
    const r = rightSmaller[i] - 1;
    if (l <= k && k <= r) {
      maxScore = Math.max(maxScore, nums[i] * (r - l + 1));
    }
  }
  return maxScore;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 好子数组的最大分数 =====");
console.log("双指针 [1,4,3,7,4,5],3:", maximumScore([1, 4, 3, 7, 4, 5], 3)); // 15
console.log("双指针 [5,5,4,5,4,1,1,1],0:", maximumScore([5, 5, 4, 5, 4, 1, 1, 1], 0)); // 20
console.log("单调栈 [1,4,3,7,4,5],3:", maximumScoreStack([1, 4, 3, 7, 4, 5], 3)); // 15

export {};
