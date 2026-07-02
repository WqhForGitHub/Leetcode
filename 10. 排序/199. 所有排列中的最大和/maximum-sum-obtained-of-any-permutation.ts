// ============================================================
// 199. 所有排列中的最大和
// ============================================================
// LeetCode 1589. Maximum Sum Obtained of Any Permutation
// 给定数组 nums 和请求数组 requests[i] = [start, end]，
// 可以任意排列 nums，最大化所有请求区间元素之和的总和。结果对 1e9+7 取模。

// 方法1：差分数组求频次 + 排序贪心（O(n log n + m)）
function maxSumRangeQuery(nums: number[], requests: number[][]): number {
  const n = nums.length;
  const MOD = 1_000_000_007;
  // 差分数组求每个位置被查询的次数
  const diff = new Array<number>(n + 1).fill(0);
  for (const [start, end] of requests) {
    diff[start]++;
    diff[end + 1]--;
  }
  const freq = new Array<number>(n).fill(0);
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += diff[i];
    freq[i] = cur;
  }
  // 频次和数值都降序排序，最大的频次配最大的数
  freq.sort((a, b) => b - a);
  const sortedNums = [...nums].sort((a, b) => b - a);
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans = (ans + (sortedNums[i] % MOD) * (freq[i] % MOD)) % MOD;
  }
  return ans;
}

// 方法2：扫描线求频次 + 排序贪心（O(n log n + m log m)）
function maxSumRangeQuery2(nums: number[], requests: number[][]): number {
  const n = nums.length;
  const MOD = 1_000_000_007;
  // 扫描线：事件 [位置, +1/-1]
  const events: number[][] = [];
  for (const [start, end] of requests) {
    events.push([start, 1]);
    events.push([end + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0]);
  const freq = new Array<number>(n).fill(0);
  let cur = 0;
  let ei = 0;
  for (let i = 0; i < n; i++) {
    while (ei < events.length && events[ei][0] === i) {
      cur += events[ei][1];
      ei++;
    }
    freq[i] = cur;
  }
  freq.sort((a, b) => b - a);
  const sortedNums = [...nums].sort((a, b) => b - a);
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans = (ans + (sortedNums[i] % MOD) * (freq[i] % MOD)) % MOD;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 199. 所有排列中的最大和 =====");
console.log(
  "方法1:",
  maxSumRangeQuery(
    [1, 2, 3, 4, 5],
    [
      [1, 3],
      [0, 1],
    ],
  ),
); // 19
console.log(
  "方法2:",
  maxSumRangeQuery2(
    [1, 2, 3, 4, 5],
    [
      [1, 3],
      [0, 1],
    ],
  ),
); // 19
console.log("方法1:", maxSumRangeQuery([1, 2, 3, 4, 5, 6], [[0, 1]])); // 11
console.log("方法2:", maxSumRangeQuery2([1, 2, 3, 4, 5, 6], [[0, 1]])); // 11

export {};
