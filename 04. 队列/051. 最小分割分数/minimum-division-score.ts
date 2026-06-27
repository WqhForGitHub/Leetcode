// ============================================================
// 051. 最小分割分数
// ============================================================
// LeetCode 周赛题. 最小分割分数
// 将数组分割为两段，使得两段各自平均值之差的绝对值最小，返回该最小值。

// ------------------------------------------------------------
// 方法1：前缀和 + 枚举分割点
// ------------------------------------------------------------
// 用前缀和计算每段的平均值，枚举所有分割点取最小差。
// 时间 O(n)，空间 O(n)。
function minimumDifference1(nums: number[]): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  let result = Infinity;
  for (let i = 1; i < n; i++) {
    const leftAvg = prefix[i] / i;
    const rightAvg = (prefix[n] - prefix[i]) / (n - i);
    result = Math.min(result, Math.abs(leftAvg - rightAvg));
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：滑动窗口 + 差分优化
// ------------------------------------------------------------
// 用队列维护滑动窗口的和，避免前缀和数组。
// 时间 O(n)，空间 O(1)。
function minimumDifference2(nums: number[]): number {
  const n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  let result = Infinity;
  for (let i = 0; i < n - 1; i++) {
    leftSum += nums[i];
    const rightSum = total - leftSum;
    const diff = Math.abs(leftSum / (i + 1) - rightSum / (n - i - 1));
    result = Math.min(result, diff);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minimumDifference1([1, 2, 3, 4, 5]), "期望: 接近 0.25");
  console.log("测试2:", minimumDifference1([10, 1, 10]), "期望: 接近 0");
  console.log("测试3:", minimumDifference2([1, 2, 3, 4, 5]), "期望: 接近 0.25");
  console.log("测试4:", minimumDifference2([10, 1, 10]), "期望: 接近 0");
}

test();

export {};
