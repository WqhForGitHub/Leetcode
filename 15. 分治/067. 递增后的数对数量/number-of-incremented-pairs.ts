// ============================================================
// 067. 递增后的数对数量
// ============================================================
// LeetCode（竞赛题）. Number of Incremented Pairs
// 给定数组 nums 和整数 d。可以选择将某些元素加 d（每个元素最多一次）。
// 统计满足 i < j 且（通过适当选择是否递增）能使 nums[i] == nums[j] 的数对 (i, j) 数量。
// 两元素可变为相等的条件：|nums[i] - nums[j]| 为 0 或 |d|。
// 时间复杂度：O(n) / O(n log n), 空间复杂度：O(n)

// 方法1：哈希表计数（推荐）
// 对每个值 v：差为 0 的对数 = C(count[v], 2)（两个都不递增或两个都递增）；
// 差为 |d| 的对数 = count[v] * count[v-|d|]（v 与 v-|d| 配对，将 v-|d| 递增得到 v）。
// 当 |d|=0 时差为 0 与差为 |d| 同一条件，仅统计 C(count[v], 2)。
// 时间复杂度 O(n)，空间复杂度 O(n)
function numberOfIncrementedPairs(nums: number[], d: number): number {
  const ad: number = Math.abs(d);
  const count: Map<number, number> = new Map<number, number>();
  for (const x of nums) {
    count.set(x, (count.get(x) ?? 0) + 1);
  }

  let ans: number = 0;
  for (const [v, c] of count) {
    // 差为 0 的对数：两个都不递增或两个都递增
    ans += (c * (c - 1)) / 2;
    // 差为 |d| 的对数：v 与 v-ad 配对
    if (ad !== 0) {
      const c2: number = count.get(v - ad) ?? 0;
      ans += c * c2;
    }
  }
  return ans;
}

// 方法2：排序 + 双指针
// 排序后先统计相同值的对数（差为 0），再用双指针统计差为 |d| 的对数。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function numberOfIncrementedPairsSort(nums: number[], d: number): number {
  const n: number = nums.length;
  if (n < 2) return 0;
  const ad: number = Math.abs(d);
  const sorted: number[] = [...nums].sort((a: number, b: number) => a - b);

  let ans: number = 0;

  // 统计每个不同值及其出现次数，同时累加差为 0 的对数
  const values: number[] = [];
  const counts: number[] = [];
  let i: number = 0;
  while (i < n) {
    let j: number = i;
    while (j < n && sorted[j] === sorted[i]) j++;
    const run: number = j - i;
    values.push(sorted[i]);
    counts.push(run);
    ans += (run * (run - 1)) / 2; // 差为 0 的对数
    i = j;
  }

  if (ad === 0) return ans; // d=0 时只有差为 0 的对

  // 双指针统计差为 ad 的对数：对每个 r 找 values[r]-values[l]==ad
  let l: number = 0;
  for (let r: number = 0; r < values.length; r++) {
    while (l < r && values[r] - values[l] > ad) l++;
    if (l < r && values[r] - values[l] === ad) {
      ans += counts[r] * counts[l];
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 递增后的数对数量 =====");
console.log("方法1:");
console.log(numberOfIncrementedPairs([1, 2, 3, 4], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairs([1, 1, 1], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairs([1, 2, 1], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairs([1, 3, 5], 2)); // 期望结果: 2
console.log(numberOfIncrementedPairs([1, 1, 2, 2], 1)); // 期望结果: 6
console.log(numberOfIncrementedPairs([1, 2, 3], 0)); // 期望结果: 0
console.log(numberOfIncrementedPairs([5, 5, 5], 0)); // 期望结果: 3
console.log("方法2:");
console.log(numberOfIncrementedPairsSort([1, 2, 3, 4], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairsSort([1, 1, 1], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairsSort([1, 2, 1], 1)); // 期望结果: 3
console.log(numberOfIncrementedPairsSort([1, 3, 5], 2)); // 期望结果: 2
console.log(numberOfIncrementedPairsSort([1, 1, 2, 2], 1)); // 期望结果: 6
console.log(numberOfIncrementedPairsSort([1, 2, 3], 0)); // 期望结果: 0
console.log(numberOfIncrementedPairsSort([5, 5, 5], 0)); // 期望结果: 3

export {};
