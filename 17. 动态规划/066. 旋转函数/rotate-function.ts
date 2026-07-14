// ============================================================
// 066. 旋转函数
// ============================================================
// LeetCode 396. Rotate Function
// 给定数组 nums，F(k) = sum(nums[i] * ((i+k) mod n))，求所有 F(k) 的最大值。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划/递推（推荐）
// F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
// F(k) = F(k-1) + sum(nums) - n * nums[n-k]
// 推导：F(k) 相比 F(k-1)，每个元素的系数都加1，但最后一个元素从 n-1 变成 0
//   F(k) - F(k-1) = sum(nums) - n * nums[n-k]
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxRotateFunction(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // 计算 sum 和 F(0)
  let sum: number = 0;
  let f: number = 0;
  for (let i: number = 0; i < n; i++) {
    sum += nums[i];
    f += i * nums[i];
  }

  let maxVal: number = f;

  // 递推计算 F(1) 到 F(n-1)
  for (let k: number = 1; k < n; k++) {
    // F(k) = F(k-1) + sum - n * nums[n-k]
    f = f + sum - n * nums[n - k];
    maxVal = Math.max(maxVal, f);
  }

  return maxVal;
}

// 方法2：暴力法（验证用）
// 直接计算每个 F(k)
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function maxRotateFunction2(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  let maxVal: number = -Infinity;

  for (let k: number = 0; k < n; k++) {
    let f: number = 0;
    for (let i: number = 0; i < n; i++) {
      // F(k) = sum(nums[i] * ((i + k) mod n))
      f += nums[i] * ((i + k) % n);
    }
    maxVal = Math.max(maxVal, f);
  }

  return maxVal;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 旋转函数 =====");
console.log(maxRotateFunction([4, 3, 2, 6])); // 期望结果: 26
console.log(maxRotateFunction([100])); // 期望结果: 0
console.log(maxRotateFunction([1, 2, 3, 4, 5, 6, 7, 8])); // 期望结果: 136
console.log(maxRotateFunction([-8, -5, -3, -1])); // 期望结果: -6

export {};
