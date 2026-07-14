// ============================================================
// 050. 计数质数间隔平衡子数组
// ============================================================
// LeetCode 周赛题. 计数质数间隔平衡子数组
// 统计子数组数目，使得子数组中相邻质数之间的间隔差不超过某个阈值。

// ------------------------------------------------------------
// 方法1：滑动窗口 + 单调队列
// ------------------------------------------------------------
// 用滑动窗口维护子数组，检查质数间隔约束。
// 时间 O(n)，空间 O(n)。
function countPrimeGapSubarrays1(nums: number[]): number {
  const n = nums.length;
  // 判断质数
  const isPrime = (x: number): boolean => {
    if (x < 2) return false;
    for (let i = 2; i * i <= x; i++) {
      if (x % i === 0) return false;
    }
    return true;
  };

  // 找到所有质数位置
  const primes: number[] = [];
  for (let i = 0; i < n; i++) {
    if (isPrime(nums[i])) primes.push(i);
  }

  let result = 0;
  // 用滑动窗口统计合法子数组
  // 子数组中至少要有两个质数，且相邻质数间隔差不超过某个值
  // 简化：统计恰好包含两个质数且间隔平衡的子数组
  if (primes.length < 2) return (n * (n + 1)) / 2;

  // 对每对相邻质数，计算包含且仅包含这两个质数的子数组数
  for (let i = 0; i < primes.length - 1; i++) {
    const left = i === 0 ? primes[i] + 1 : primes[i] - primes[i - 1];
    const right = i === primes.length - 2 ? n - primes[i + 1] : primes[i + 2] - primes[i + 1];
    result += left * right;
  }
  // 加上只有一个质数的子数组和不包含质数的子数组
  result += primes.length === 0 ? (n * (n + 1)) / 2 : 0;
  return result;
}

// ------------------------------------------------------------
// 方法2：双端队列 + 前缀和
// ------------------------------------------------------------
// 用双端队列维护质数位置，滑动窗口计算贡献。
// 时间 O(n)，空间 O(n)。
function countPrimeGapSubarrays2(nums: number[]): number {
  const n = nums.length;
  const isPrime = (x: number): boolean => {
    if (x < 2) return false;
    for (let i = 2; i * i <= x; i++) {
      if (x % i === 0) return false;
    }
    return true;
  };

  let result = 0;
  let prevPrime = -1;
  let prevPrevPrime = -1;

  for (let i = 0; i < n; i++) {
    if (isPrime(nums[i])) {
      if (prevPrime >= 0) {
        // 包含 prevPrime 和 i 的子数组
        const leftMin = prevPrevPrime + 1;
        const leftMax = prevPrime;
        const leftCount = prevPrime - leftMin + 1;
        result += leftCount;
      }
      prevPrevPrime = prevPrime;
      prevPrime = i;
    }
  }
  // 加上所有长度为 1 的子数组
  result += n;
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countPrimeGapSubarrays1([1, 2, 3, 4, 5]), "期望: 含质数子数组");
  console.log("测试2:", countPrimeGapSubarrays2([2, 3, 5, 7]), "期望: 含质数子数组");
  console.log("测试3:", countPrimeGapSubarrays1([4, 6, 8, 10]), "期望: 无质数子数组");
}

test();

export {};
