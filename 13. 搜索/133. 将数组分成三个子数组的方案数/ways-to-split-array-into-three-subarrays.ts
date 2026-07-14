// ============================================================
// 133. 将数组分成三个子数组的方案数
// ============================================================
// LeetCode 1712. Ways to Split Array Into Three Subarrays
// 将非负数组分成三段非空子数组，使 sum1 <= sum2 <= sum3，求方案数。

// 方法1：前缀和 + 二分查找
function waysToSplit(nums: number[]): number {
  const mod = 1_000_000_007;
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  let count = 0;
  for (let i = 0; i < n - 2; i++) {
    // sum1 = prefix[i+1]
    // 找 j 的范围：sum2 >= sum1 且 sum2 <= sum3
    // sum2 = prefix[j+1] - prefix[i+1]
    // sum3 = prefix[n] - prefix[j+1]
    // 条件1: prefix[j+1] - prefix[i+1] >= prefix[i+1] => prefix[j+1] >= 2*prefix[i+1]
    // 条件2: prefix[j+1] - prefix[i+1] <= prefix[n] - prefix[j+1] => 2*prefix[j+1] <= prefix[n] + prefix[i+1]
    const minPrefix = 2 * prefix[i + 1];
    const maxPrefix = prefix[n] + prefix[i + 1];
    // 二分找最小 j 使得 prefix[j+1] >= minPrefix
    let lo = i + 1;
    let hi = n - 2;
    let minJ = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (prefix[mid + 1] >= minPrefix) {
        minJ = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    if (minJ === -1) continue;
    // 二分找最大 j 使得 2*prefix[j+1] <= maxPrefix
    lo = minJ;
    hi = n - 2;
    let maxJ = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (2 * prefix[mid + 1] <= maxPrefix) {
        maxJ = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (maxJ !== -1 && maxJ >= minJ) {
      count = (count + maxJ - minJ + 1) % mod;
    }
  }
  return count;
}

// 方法2：前缀和 + 双指针
function waysToSplitTwoPointer(nums: number[]): number {
  const mod = 1_000_000_007;
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  let count = 0;
  let j = 1;
  let k = 1;
  for (let i = 0; i < n - 2; i++) {
    j = Math.max(j, i + 1);
    while (j < n - 1 && prefix[j + 1] - prefix[i + 1] < prefix[i + 1]) {
      j++;
    }
    if (j >= n - 1) break;
    k = Math.max(k, j);
    while (k < n - 1 && prefix[k + 1] - prefix[i + 1] <= prefix[n] - prefix[k + 1]) {
      k++;
    }
    count = (count + k - j) % mod;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 将数组分成三个子数组的方案数 =====");
console.log("二分 [1,1,1]:", waysToSplit([1, 1, 1])); // 1
console.log("二分 [1,2,2,2,5,0]:", waysToSplit([1, 2, 2, 2, 5, 0])); // 3
console.log("二分 [3,2,1]:", waysToSplit([3, 2, 1])); // 0

export {};
