// ============================================================
// 119. 子数组和排序后的区间和
// ============================================================
// LeetCode 1508. Range Sum of Sorted Subarray Sums
// 所有子数组和排序后，返回第 [left, right] 区间的和。

// 方法1：暴力枚举 + 排序
function rangeSum(nums: number[], n: number, left: number, right: number): number {
  const mod = 1_000_000_007;
  const sums: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      sums.push(sum);
    }
  }
  sums.sort((a, b) => a - b);
  let result = 0;
  for (let i = left - 1; i <= right - 1; i++) {
    result = (result + sums[i]) % mod;
  }
  return result;
}

// 方法2：二分查找 + 前缀和（O(n log sum)）
function rangeSumBinary(nums: number[], n: number, left: number, right: number): number {
  const mod = 1_000_000_007;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  function sumCountLessEqual(target: number): [number, number] {
    // 返回 [<= target 的子数组和个数, 这些和的总和]
    let count = 0;
    let totalSum = 0;
    for (let i = 0; i < n; i++) {
      let lo = i;
      let hi = n - 1;
      let best = i - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (prefix[mid + 1] - prefix[i] <= target) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (best >= i) {
        count += best - i + 1;
        // i 到 best 的子数组和
        const cnt = best - i + 1;
        totalSum += prefix[best + 1] * cnt - prefix[i] * cnt;
      }
    }
    return [count, totalSum];
  }

  function sumFirstK(k: number): number {
    let lo = 1;
    let hi = prefix[n];
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const [count] = sumCountLessEqual(mid);
      if (count < k) lo = mid + 1;
      else hi = mid;
    }
    const [count, totalSum] = sumCountLessEqual(lo);
    return totalSum - lo * (count - k);
  }

  const r = sumFirstK(right);
  const l = sumFirstK(left - 1);
  return (r - l + mod) % mod;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. 子数组和排序后的区间和 =====");
console.log("暴力 [1,2,3,4],4,1,5:", rangeSum([1, 2, 3, 4], 4, 1, 5)); // 13
console.log("暴力 [1,2,3,4],4,3,4:", rangeSum([1, 2, 3, 4], 4, 3, 4)); // 6
console.log("暴力 [1,2,3,4],4,1,10:", rangeSum([1, 2, 3, 4], 4, 1, 10)); // 50

export {};
