// ============================================================
// 132. 得到山形数组的最少删除次数
// ============================================================
// LeetCode 1673. Find the Most Competitive Subsequence
// 找长度为 k 的字典序最小的子序列。

// 方法1：单调栈
function mostCompetitive(nums: number[], k: number): number[] {
  const n = nums.length;
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > nums[i] &&
      stack.length + (n - i - 1) >= k
    ) {
      stack.pop();
    }
    if (stack.length < k) {
      stack.push(nums[i]);
    }
  }
  return stack;
}

// 方法2：贪心 + 二分查找
function mostCompetitiveBinary(nums: number[], k: number): number[] {
  const n = nums.length;
  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    // 在 [start, n - (k - i)] 范围内找最小值
    let start = result.length > 0 ? findLastGE(nums, result[result.length - 1], i > 0 ? n - k + i : 0) : 0;
    let minIdx = start;
    let minVal = Infinity;
    for (let j = start; j <= n - (k - i); j++) {
      if (nums[j] < minVal) {
        minVal = nums[j];
        minIdx = j;
      }
    }
    result.push(minVal);
  }
  return result;
}

function findLastGE(nums: number[], val: number, start: number): number {
  for (let i = start; i < nums.length; i++) {
    if (nums[i] >= val) return i;
  }
  return nums.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 得到山形数组的最少删除次数 =====");
console.log("单调栈 [3,5,2,6],2:", mostCompetitive([3, 5, 2, 6], 2)); // [2,6]
console.log("单调栈 [2,4,3,3,5,4,9,6],4:", mostCompetitive([2, 4, 3, 3, 5, 4, 9, 6], 4)); // [2,3,3,4]

export {};
