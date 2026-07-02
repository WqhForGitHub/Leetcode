// ============================================================
// 054. 查询超过阈值频率最高元素
// ============================================================
// LeetCode 54. Most Frequent Element Above Threshold
// 给定数组 nums 和查询列表 queries。每个查询为 [l, r, threshold]：
// 在 nums[l..r] 中找出出现次数至少为 threshold 的最频繁元素。
// 若有多个元素满足条件，返回值最小的；若没有元素满足，返回 -1。
// 方法1时间复杂度：O(q * n)，空间复杂度：O(1)
// 方法2时间复杂度：O(n log n + q * D * log n)，D 为候选值个数，空间复杂度：O(n)

// 方法1：Boyer-Moore 多数投票 + 计数验证（推荐，threshold > 区间长度/2 时最优）
// 当 threshold > (r - l + 1) / 2 时，满足条件的元素至多一个且必为多数元素，
// Boyer-Moore 能在 O(n) 内找到候选，再计数验证即可。
function mostFrequentAboveThreshold1(nums: number[], queries: number[][]): number[] {
  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const threshold: number = query[2];

    // 第一步：Boyer-Moore 多数投票，寻找区间内的多数候选元素
    let candidate: number = -1;
    let count: number = 0;
    for (let i = l; i <= r; i++) {
      if (count === 0) {
        candidate = nums[i];
        count = 1;
      } else if (nums[i] === candidate) {
        count++;
      } else {
        count--;
      }
    }

    // 第二步：验证候选元素在区间内的实际出现次数
    let freq: number = 0;
    for (let i = l; i <= r; i++) {
      if (nums[i] === candidate) freq++;
    }

    // 多数元素频率达标则返回，否则返回 -1
    results.push(freq >= threshold ? candidate : -1);
  }
  return results;
}

// 方法2：预处理位置列表 + 二分查找（适用于一般 threshold）
// 为每个值记录所有出现下标（天然有序），查询时对候选值二分统计区间内频次。
function mostFrequentAboveThreshold2(nums: number[], queries: number[][]): number[] {
  // 预处理：值 -> 有序下标列表
  const posMap: Map<number, number[]> = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (!posMap.has(nums[i])) posMap.set(nums[i], []);
    posMap.get(nums[i])!.push(i);
  }

  // 二分查找：第一个 >= target 的下标
  const lowerBound = (arr: number[], target: number): number => {
    let lo: number = 0;
    let hi: number = arr.length;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // 二分查找：第一个 > target 的下标
  const upperBound = (arr: number[], target: number): number => {
    let lo: number = 0;
    let hi: number = arr.length;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (arr[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  const results: number[] = [];
  for (const query of queries) {
    const l: number = query[0];
    const r: number = query[1];
    const threshold: number = query[2];

    let bestVal: number = -1;
    let bestFreq: number = 0;

    // 遍历所有候选值，用二分查找统计区间内出现次数
    for (const [val, positions] of posMap) {
      // 快速剪枝：全局出现次数不足 threshold，区间内必然也不足
      if (positions.length < threshold) continue;
      // 二分统计 [l, r] 范围内的出现次数
      const leftIdx: number = lowerBound(positions, l);
      const rightIdx: number = upperBound(positions, r);
      const freq: number = rightIdx - leftIdx;
      if (freq >= threshold) {
        // 取频率最高的；频率相同取值最小的
        if (bestVal === -1 || freq > bestFreq || (freq === bestFreq && val < bestVal)) {
          bestFreq = freq;
          bestVal = val;
        }
      }
    }
    results.push(bestVal);
  }
  return results;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 查询超过阈值频率最高元素 =====");
const nums054: number[] = [1, 2, 3, 2, 2, 5, 4];
// 查询1: [0,4,3] 区间 [1,2,3,2,2]，2 出现 3 次 >= 3，结果 2（多数情况，方法1适用）
console.log("方法1 [0,4,3]:", mostFrequentAboveThreshold1(nums054, [[0, 4, 3]])); // 期望结果: [2]
console.log("方法2 [0,4,3]:", mostFrequentAboveThreshold2(nums054, [[0, 4, 3]])); // 期望结果: [2]
// 查询2: [0,4,4] 区间 [1,2,3,2,2]，2 出现 3 次 < 4，无满足，结果 -1
console.log("方法1 [0,4,4]:", mostFrequentAboveThreshold1(nums054, [[0, 4, 4]])); // 期望结果: [-1]
console.log("方法2 [0,4,4]:", mostFrequentAboveThreshold2(nums054, [[0, 4, 4]])); // 期望结果: [-1]
// 查询3: [0,6,2] 区间全数组，2 出现 3 次 >= 2（一般 threshold，方法2适用）
console.log("方法2 [0,6,2]:", mostFrequentAboveThreshold2(nums054, [[0, 6, 2]])); // 期望结果: [2]
// 多查询综合测试
console.log(
  "方法2 综合:",
  mostFrequentAboveThreshold2(nums054, [
    [0, 4, 3],
    [0, 6, 2],
    [0, 4, 4],
  ]),
); // 期望结果: [2, 2, -1]

export {};
