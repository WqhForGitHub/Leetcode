// ============================================================
// 060. 统计主要元素子数组数目 II
// ============================================================
// LeetCode 3248. Count Subarrays with Majority Element II
// 给定数组 nums，统计其中存在“主要元素”的子数组数目。
// 若某元素在子数组中出现次数严格大于 floor(length/2)，则称该元素为该子数组的主要元素。
// 数据规模较大，需要比暴力更高效的算法。
// 时间复杂度：O(D * n log n), 空间复杂度：O(n)  （D 为不同元素个数）

// 关键观察：任意子数组最多只有一个主要元素
// （若 v、w 同时为主要元素，则 v 次数 + w 次数 > floor(L/2)+floor(L/2) >= L，矛盾）。
// 因此可以按元素 v 分别统计“以 v 为主要元素”的子数组数目后求和，不会重复。

// 方法1：按值变换前缀和 + 归并排序计数（推荐）
// 对每个不同值 v，令 b[i] = +1 (若 nums[i]==v) 否则 -1。
// 子数组 [l, r] 以 v 为主要元素
//   等价于 #v > floor(L/2)
//   等价于 2*#v - L > 0
//   等价于 sum(b[l..r]) > 0
//   等价于 prefix[r+1] > prefix[l]   （prefix[0]=0）
// 于是问题转化为：统计满足 0 <= i < j <= n 且 prefix[i] < prefix[j] 的下标对数，
// 用归并排序在合并阶段统计（与“1 比 0 多的子数组个数”同构）。
// 对所有 v 求和即得答案。时间复杂度 O(D * n log n)，空间复杂度 O(n)
function countMajoritySubarraysII_prefix(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // 统计满足 i<j 且 a[i]<a[j] 的对数（归并排序）
  function countAscendingPairs(a: number[]): number {
    let cnt: number = 0;
    const temp: number[] = new Array<number>(a.length);
    function mergeSort(lo: number, hi: number): void {
      if (lo >= hi) return;
      const mid: number = (lo + hi) >> 1;
      mergeSort(lo, mid);
      mergeSort(mid + 1, hi);
      // 两半均升序，双指针统计跨半对：左 a[i] < 右 a[j]
      let j: number = mid + 1;
      for (let i: number = lo; i <= mid; i++) {
        while (j <= hi && a[j] <= a[i]) j++;
        if (j <= hi) cnt += hi - j + 1;
      }
      // 合并
      let p: number = lo;
      let q: number = mid + 1;
      let k: number = lo;
      while (p <= mid && q <= hi) {
        if (a[p] <= a[q]) temp[k++] = a[p++];
        else temp[k++] = a[q++];
      }
      while (p <= mid) temp[k++] = a[p++];
      while (q <= hi) temp[k++] = a[q++];
      for (let t: number = lo; t <= hi; t++) a[t] = temp[t];
    }
    mergeSort(0, a.length - 1);
    return cnt;
  }

  const distinct: number[] = Array.from(new Set<number>(nums));
  let total: number = 0;
  for (const v of distinct) {
    // 前缀和：prefix[0]=0, prefix[i+1]=prefix[i]+(nums[i]==v?1:-1)
    const prefix: number[] = new Array<number>(n + 1);
    prefix[0] = 0;
    for (let i: number = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + (nums[i] === v ? 1 : -1);
    }
    // 统计 i<j 且 prefix[i]<prefix[j] 的对数
    total += countAscendingPairs(prefix);
  }
  return total;
}

// 方法2：分治 + 按值统计跨越中点的子数组
// 在数组上做分治：count = solve(lo,mid) + solve(mid+1,hi) + crossing。
// 跨越中点的子数组：起点 s 在 [lo, mid]，终点 e 在 [mid+1, hi]。
// 对当前区间内每个不同值 v：
//   左侧 L[s] = (#v - #非v) 在 [s, mid]，s 从 mid 向左；
//   右侧 R[e] = (#v - #非v) 在 [mid+1, e]，e 从 mid+1 向右。
//   v 为 [s, e] 主要元素 等价于 L[s] + R[e] > 0，即 R[e] > -L[s]。
//   将 R 排序后，对每个 L[s] 二分统计满足 R[e] > -L[s] 的个数。
// 由于每个子数组最多一个主要元素，按 v 求和不会重复。
// 时间复杂度 O(D * n log^2 n)，空间复杂度 O(n)
function countMajoritySubarraysII_dc(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  function solve(lo: number, hi: number): number {
    if (lo === hi) return 1; // 单元素子数组必存在主要元素
    const mid: number = (lo + hi) >> 1;
    let count: number = solve(lo, mid) + solve(mid + 1, hi);

    // 收集当前区间内的不同值
    const values: Set<number> = new Set<number>();
    for (let k: number = lo; k <= hi; k++) values.add(nums[k]);

    for (const v of values) {
      // 左侧差值：L[s] = (#v - #非v) 在 [s, mid]，s 从 mid 向左
      const leftDiffs: number[] = [];
      let dl: number = 0;
      for (let s: number = mid; s >= lo; s--) {
        dl += nums[s] === v ? 1 : -1;
        leftDiffs.push(dl);
      }
      // 右侧差值：R[e] = (#v - #非v) 在 [mid+1, e]，e 从 mid+1 向右
      const rightDiffs: number[] = [];
      let dr: number = 0;
      for (let e: number = mid + 1; e <= hi; e++) {
        dr += nums[e] === v ? 1 : -1;
        rightDiffs.push(dr);
      }
      // 对每个 L[s]，统计满足 R[e] > -L[s] 的个数
      rightDiffs.sort((a: number, b: number): number => a - b);
      const m: number = rightDiffs.length;
      for (const ld of leftDiffs) {
        const target: number = -ld;
        // 二分找第一个 > target 的下标
        let loIdx: number = 0;
        let hiIdx: number = m;
        while (loIdx < hiIdx) {
          const mm: number = (loIdx + hiIdx) >> 1;
          if (rightDiffs[mm] <= target) loIdx = mm + 1;
          else hiIdx = mm;
        }
        count += m - loIdx;
      }
    }
    return count;
  }

  return solve(0, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 统计主要元素子数组数目 II =====");
console.log("方法1:", countMajoritySubarraysII_prefix([1, 2, 1])); // 期望结果: 4
console.log("方法2:", countMajoritySubarraysII_dc([1, 2, 1])); // 期望结果: 4
console.log("方法1:", countMajoritySubarraysII_prefix([1, 1, 1])); // 期望结果: 6
console.log("方法2:", countMajoritySubarraysII_dc([1, 1, 1])); // 期望结果: 6
console.log("方法1:", countMajoritySubarraysII_prefix([1, 2, 3, 4])); // 期望结果: 4
console.log("方法2:", countMajoritySubarraysII_dc([1, 2, 3, 4])); // 期望结果: 4
console.log("方法1:", countMajoritySubarraysII_prefix([2, 2, 1, 2, 2])); // 期望结果: 13
console.log("方法2:", countMajoritySubarraysII_dc([2, 2, 1, 2, 2])); // 期望结果: 13
console.log("方法1:", countMajoritySubarraysII_prefix([1, 2, 1, 2, 1])); // 期望结果: 9
console.log("方法2:", countMajoritySubarraysII_dc([1, 2, 1, 2, 1])); // 期望结果: 9

export {};
