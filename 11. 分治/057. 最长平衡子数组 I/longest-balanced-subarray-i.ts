// ============================================================
// 057. 最长平衡子数组 I
// ============================================================
// LeetCode（竞赛题）. Longest Balanced Subarray I
// 给定一个仅包含 0 和 1 的数组 nums，找出最长的连续子数组，
// 使得该子数组中 0 的个数与 1 的个数相等。
// 约束：数组规模较小。
// 时间复杂度：O(n), 空间复杂度：O(n)

// 方法1：前缀和 + 哈希表（推荐）
// 把 0 视作 -1、1 视作 +1，则“0 与 1 个数相等”等价于“子数组和为 0”。
// 令 prefix[i] 表示 nums[0..i-1] 的变换和（prefix[0]=0）。
// 子数组 nums[l..r] 的和为 prefix[r+1] - prefix[l]，为 0 即 prefix[r+1] == prefix[l]。
// 用哈希表记录每个 prefix 值首次出现的下标，再次遇到相同值时即可更新答案。
// 子数组长度 = i - first[prefix]。
// 时间复杂度 O(n)，空间复杂度 O(n)
function longestBalancedSubarrayI(nums: number[]): number {
  const n: number = nums.length;
  const first: Map<number, number> = new Map<number, number>();
  first.set(0, -1); // 前缀和 0 首次出现在“下标 -1”（空前缀）
  let prefix: number = 0;
  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    prefix += nums[i] === 0 ? -1 : 1;
    const prev: number | undefined = first.get(prefix);
    if (prev !== undefined) {
      const len: number = i - prev;
      if (len > ans) ans = len;
    } else {
      first.set(prefix, i);
    }
  }
  return ans;
}

// 方法2：暴力枚举 O(n^2)
// 枚举每个起点 l，向右累加（0 记 -1，1 记 +1），
// 一旦累加和为 0，说明当前子数组中 0、1 个数相等，更新答案。
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function longestBalancedSubarrayIBrute(nums: number[]): number {
  const n: number = nums.length;
  let ans: number = 0;
  for (let l: number = 0; l < n; l++) {
    let sum: number = 0;
    for (let r: number = l; r < n; r++) {
      sum += nums[r] === 0 ? -1 : 1;
      if (sum === 0) {
        const len: number = r - l + 1;
        if (len > ans) ans = len;
      }
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 最长平衡子数组 I =====");
console.log(longestBalancedSubarrayI([0, 1])); // 期望结果: 2
console.log(longestBalancedSubarrayI([0, 1, 0])); // 期望结果: 2
console.log(longestBalancedSubarrayI([0, 0, 1, 0, 0, 0, 1, 1])); // 期望结果: 6
console.log(longestBalancedSubarrayI([1, 1, 1])); // 期望结果: 0
console.log(longestBalancedSubarrayI([0, 0, 0, 0])); // 期望结果: 0
console.log(longestBalancedSubarrayI([1, 1, 0, 0, 1, 0, 1, 0])); // 期望结果: 8
console.log("--- 方法2测试 ---");
console.log(longestBalancedSubarrayIBrute([0, 1])); // 期望结果: 2
console.log(longestBalancedSubarrayIBrute([0, 1, 0])); // 期望结果: 2
console.log(longestBalancedSubarrayIBrute([0, 0, 1, 0, 0, 0, 1, 1])); // 期望结果: 6
console.log(longestBalancedSubarrayIBrute([1, 1, 1])); // 期望结果: 0
console.log(longestBalancedSubarrayIBrute([0, 0, 0, 0])); // 期望结果: 0
console.log(longestBalancedSubarrayIBrute([1, 1, 0, 0, 1, 0, 1, 0])); // 期望结果: 8

export {};
