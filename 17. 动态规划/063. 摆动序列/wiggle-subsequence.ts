// ============================================================
// 063. 摆动序列
// ============================================================
// LeetCode 376. Wiggle Subsequence
// 给定整数数组，求最长摆动序列长度（差值正负交替）。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划（推荐）
// up[i] 表示前 i 个数中，以正差结尾的最长摆动序列长度
// down[i] 表示前 i 个数中，以负差结尾的最长摆动序列长度
// 状态转移：
//   nums[i] > nums[i-1]: up[i] = down[i-1] + 1, down[i] = down[i-1]
//   nums[i] < nums[i-1]: down[i] = up[i-1] + 1, up[i] = up[i-1]
//   nums[i] == nums[i-1]: 不变
// 时间复杂度 O(n)，空间复杂度 O(1)（只保留前一个状态）
function wiggleMaxLength(nums: number[]): number {
  const n: number = nums.length;
  if (n < 2) return n;

  // up: 以正差结尾的最长摆动序列长度
  // down: 以负差结尾的最长摆动序列长度
  let up: number = 1;
  let down: number = 1;

  for (let i: number = 1; i < n; i++) {
    if (nums[i] > nums[i - 1]) {
      // 当前为上升，可以接在下降序列后面
      up = down + 1;
    } else if (nums[i] < nums[i - 1]) {
      // 当前为下降，可以接在上升序列后面
      down = up + 1;
    }
    // 相等时不更新
  }

  return Math.max(up, down);
}

// 方法2：贪心
// 统计波峰和波谷的数量，跳过相等的元素
// 时间复杂度 O(n)，空间复杂度 O(1)
function wiggleMaxLength2(nums: number[]): number {
  const n: number = nums.length;
  if (n < 2) return n;

  let prevDiff: number = nums[1] - nums[0];
  let count: number = prevDiff !== 0 ? 2 : 1;

  for (let i: number = 2; i < n; i++) {
    const diff: number = nums[i] - nums[i - 1];
    // 差值符号发生交替（波峰或波谷）
    if ((diff > 0 && prevDiff <= 0) || (diff < 0 && prevDiff >= 0)) {
      count++;
      prevDiff = diff;
    }
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 摆动序列 =====");
console.log(wiggleMaxLength([1, 7, 4, 9, 2, 5])); // 期望结果: 6
console.log(wiggleMaxLength([1, 17, 5, 10, 13, 15, 10, 5, 16, 8])); // 期望结果: 7
console.log(wiggleMaxLength([1, 2, 3, 4, 5, 6, 7, 8, 9])); // 期望结果: 2
console.log(wiggleMaxLength([0, 0])); // 期望结果: 1
console.log(wiggleMaxLength([3, 3, 3, 2, 5])); // 期望结果: 3

export {};
