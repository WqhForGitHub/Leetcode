// ============================================================
// 190. 子数组和排序后的区间和
// ============================================================
// LeetCode 1508. Range Sum of Sorted Subarray Sums
// 给定正整数数组 nums，列出所有非空连续子数组的和并升序排序，
// 返回第 left 到第 right 个元素（1 下标）之和，对 1e9+7 取模。

const MOD_1508 = 1e9 + 7;

// 方法1：生成所有子数组和 + 排序（O(n^2 log n)）
function rangeSum(nums: number[], n: number, left: number, right: number): number {
  const sums: number[] = [];
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = i; j < n; j++) {
      s += nums[j];
      sums.push(s);
    }
  }
  sums.sort((a, b) => a - b);
  let result = 0;
  for (let i = left - 1; i <= right - 1; i++) {
    result = (result + sums[i]) % MOD_1508;
  }
  return result;
}

// 方法2：二分查找 + 滑窗计数（O(n log S)，S 为子和最大值）
// 利用滑窗同时统计“和 <= target 的子数组数量”与“这些子数组和的总和”。
function rangeSum2(nums: number[], n: number, left: number, right: number): number {
  // 返回 { count: 和<=target 的子数组数, total: 这些子数组和的总和 }
  const countAndSum = (target: number): { count: number; total: number } => {
    let count = 0;
    let total = 0;
    let curSum = 0; // 窗口 nums[l..r] 之和
    let curWindowSum = 0; // 以 r 结尾、起点在 [l,r] 内的所有子数组和之和
    let l = 0;
    for (let r = 0; r < n; r++) {
      curSum += nums[r];
      curWindowSum += nums[r] * (r - l + 1);
      while (curSum > target) {
        curWindowSum -= curSum; // 移除以 l 开头、r 结尾的子数组
        curSum -= nums[l];
        l++;
      }
      count += r - l + 1;
      total += curWindowSum;
    }
    return { count, total };
  };

  // sumFirst(k) = 前 k 小的子数组和之和
  const sumFirst = (k: number): number => {
    if (k === 0) return 0;
    let lo = Math.min(...nums);
    let hi = nums.reduce((a, b) => a + b, 0);
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (countAndSum(mid).count >= k) hi = mid;
      else lo = mid + 1;
    }
    const x = lo;
    const { count, total } = countAndSum(x);
    // total 包含所有和 <= x 的子数组，可能多于 k 个，多出的值都等于 x
    return total - (count - k) * x;
  };

  const ans = sumFirst(right) - sumFirst(left - 1);
  return ((ans % MOD_1508) + MOD_1508) % MOD_1508;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 190. 子数组和排序后的区间和 =====");
console.log("方法1 [1,2,3,4], n=4, left=1, right=5:", rangeSum([1, 2, 3, 4], 4, 1, 5)); // 13
console.log("方法1 [1,2,3,4], n=4, left=3, right=4:", rangeSum([1, 2, 3, 4], 4, 3, 4)); // 6
console.log("方法1 [1,2,3,4], n=4, left=1, right=10:", rangeSum([1, 2, 3, 4], 4, 1, 10)); // 50
console.log("方法2 [1,2,3,4], n=4, left=1, right=5:", rangeSum2([1, 2, 3, 4], 4, 1, 5)); // 13
console.log("方法2 [1,2,3,4], n=4, left=3, right=4:", rangeSum2([1, 2, 3, 4], 4, 3, 4)); // 6
console.log("方法2 [1,2,3,4], n=4, left=1, right=10:", rangeSum2([1, 2, 3, 4], 4, 1, 10)); // 50

export {};
