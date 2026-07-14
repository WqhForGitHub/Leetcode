// ============================================================
// 165. 将数组分成两个数组并最小化数组和的差
// ============================================================
// LeetCode 2035. Partition Array Into Two Arrays to Minimize Sum Difference
// 将长度为 2n 的数组分成两个长度为 n 的子数组，最小化两者和的差。
// 时间复杂度 O(n * C(n, n/2))，用折半查找 + 二分。

// 方法1：折半枚举 + 二分查找
function minimumDifference(nums: number[]): number {
  const n = nums.length;
  const half = n / 2;
  const left = nums.slice(0, half);
  const right = nums.slice(half);

  // leftSums[k] = 从左半部分选 k 个元素的所有可能和
  const leftSums: number[][] = Array(half + 1)
    .fill(null)
    .map(() => []);
  const rightSums: number[][] = Array(half + 1)
    .fill(null)
    .map(() => []);

  for (let mask = 0; mask < 1 << half; mask++) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < half; i++) {
      if (mask & (1 << i)) {
        sum += left[i];
        count++;
      }
    }
    leftSums[count].push(sum);
  }
  for (let mask = 0; mask < 1 << half; mask++) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < half; i++) {
      if (mask & (1 << i)) {
        sum += right[i];
        count++;
      }
    }
    rightSums[count].push(sum);
  }

  // 排序右半部分便于二分
  for (let k = 0; k <= half; k++) {
    rightSums[k].sort((a, b) => a - b);
  }

  const total = nums.reduce((a, b) => a + b, 0);
  let result = Infinity;

  // 从左半部分选 k 个，右半部分选 half-k 个，总和接近 total/2
  for (let k = 0; k <= half; k++) {
    for (const ls of leftSums[k]) {
      const target = total / 2 - ls;
      const arr = rightSums[half - k];
      // 二分找最接近 target 的值
      let lo = 0;
      let hi = arr.length - 1;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      result = Math.min(result, Math.abs(total - 2 * (ls + arr[lo])));
      if (lo > 0) {
        result = Math.min(result, Math.abs(total - 2 * (ls + arr[lo - 1])));
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 165. 将数组分成两个数组并最小化数组和的差 =====");
console.log("[3,9,7,3]:", minimumDifference([3, 9, 7, 3])); // 2
console.log("[-36,36]:", minimumDifference([-36, 36])); // 72
console.log("[2,-1,0,4,-2,-9]:", minimumDifference([2, -1, 0, 4, -2, -9])); // 0

export {};
