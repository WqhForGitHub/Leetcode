// ============================================================
// 046. 美数对
// ============================================================
// LeetCode 2748. Number of Beautiful Pairs
// 给定下标从 0 开始的整数数组 nums。统计满足 0 <= i < j < nums.length 的下标对 (i, j)，
// 使得 nums[i] 的第一个数字与 nums[j] 的最后一个数字互质（gcd == 1）。
// 时间复杂度：O(n^2) 或 O(n), 空间复杂度：O(1)

// 求最大公约数
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t: number = b;
    b = a % b;
    a = t;
  }
  return a;
}

// 取一个正整数的第一个数字
function firstDigit(x: number): number {
  let v: number = x;
  while (v >= 10) v = Math.floor(v / 10);
  return v;
}

// 取一个整数的最后一个数字
function lastDigit(x: number): number {
  return Math.abs(x) % 10;
}

// 方法1：暴力枚举（推荐，n 较小时）
// 枚举所有 i<j，判断 firstDigit(nums[i]) 与 lastDigit(nums[j]) 是否互质。
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function countBeautifulPairs(nums: number[]): number {
  const n: number = nums.length;
  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    const fi: number = firstDigit(nums[i]);
    for (let j: number = i + 1; j < n; j++) {
      if (gcd(fi, lastDigit(nums[j])) === 1) ans++;
    }
  }
  return ans;
}

// 方法2：按首数字频次统计（D&C/优化思路）
// 从左到右遍历 j，维护“已出现的首数字”频次 freq[1..9]。
// 对每个 j，last = lastDigit(nums[j])，累加所有与 last 互质的首数字 f 的 freq[f]。
// 然后将 firstDigit(nums[j]) 计入 freq。时间复杂度 O(n * 10)，空间复杂度 O(1)
function countBeautifulPairsOpt(nums: number[]): number {
  const n: number = nums.length;
  const freq: number[] = new Array<number>(10).fill(0); // freq[1..9]
  let ans: number = 0;
  for (let j: number = 0; j < n; j++) {
    const last: number = lastDigit(nums[j]);
    // 枚举首数字 1..9，统计与 last 互质的频次
    for (let f: number = 1; f <= 9; f++) {
      if (freq[f] > 0 && gcd(f, last) === 1) ans += freq[f];
    }
    freq[firstDigit(nums[j])]++;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 美数对 =====");
console.log(countBeautifulPairs([2, 5, 1, 4])); // 期望结果: 5
console.log(countBeautifulPairs([11, 21, 12])); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(countBeautifulPairsOpt([2, 5, 1, 4])); // 期望结果: 5
console.log(countBeautifulPairsOpt([11, 21, 12])); // 期望结果: 2

export {};
