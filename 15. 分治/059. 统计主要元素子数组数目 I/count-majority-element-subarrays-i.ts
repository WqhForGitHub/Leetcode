// ============================================================
// 059. 统计主要元素子数组数目 I
// ============================================================
// LeetCode 3247. Count Subarrays with Majority Element I
// 给定数组 nums，统计其中存在“主要元素”的子数组数目。
// 若某元素在子数组中出现次数严格大于 floor(length/2)，则称该元素为该子数组的主要元素。
// 数据规模较小。
// 时间复杂度：O(n^2), 空间复杂度：O(n)

// 方法1：枚举起点 + Boyer-Moore 投票（推荐）
// 固定子数组左端点 i，向右扩展右端点 j，维护：
//   - 候选者 candidate 与 Boyer-Moore 计数 bmCount
//   - 真实频次表 realFreq（用于验证候选者是否真的超过半数）
// Boyer-Moore 保证：若子数组存在主要元素，则它一定是当前候选者。
// 因此只需验证 realFreq.get(candidate) > floor(len/2) 即可。
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function countMajoritySubarraysI_bm(nums: number[]): number {
  const n: number = nums.length;
  let result: number = 0;
  for (let i: number = 0; i < n; i++) {
    let candidate: number = 0;
    let bmCount: number = 0;
    const realFreq: Map<number, number> = new Map<number, number>();
    for (let j: number = i; j < n; j++) {
      const x: number = nums[j];
      // 更新真实频次
      realFreq.set(x, (realFreq.get(x) ?? 0) + 1);
      // Boyer-Moore 投票
      if (bmCount === 0) {
        candidate = x;
        bmCount = 1;
      } else if (x === candidate) {
        bmCount++;
      } else {
        bmCount--;
      }
      const len: number = j - i + 1;
      const threshold: number = Math.floor(len / 2);
      if ((realFreq.get(candidate) ?? 0) > threshold) {
        result++;
      }
    }
  }
  return result;
}

// 方法2：分治
// 将区间 [lo, hi] 在 mid 处一分为二，结果 = 左半 + 右半 + 跨越中点的子数组。
// 跨越中点的子数组：起点 s 在 [lo, mid]，终点 e 在 [mid+1, hi]。
// 对每个起点 s，先建立 [s, mid] 的频次表与 Boyer-Moore 状态，
// 再向右扩展 e，逐个判断 [s, e] 是否存在主要元素。
// 由于每个子数组最多只有一个主要元素，统计不会重复。
// 时间复杂度 O(n^2 log n)，空间复杂度 O(log n)（递归栈）
function countMajoritySubarraysI_dc(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  function solve(lo: number, hi: number): number {
    if (lo === hi) return 1; // 单元素子数组必存在主要元素
    const mid: number = (lo + hi) >> 1;
    let count: number = solve(lo, mid) + solve(mid + 1, hi);

    // 枚举跨越中点的子数组
    for (let s: number = mid; s >= lo; s--) {
      // 先构建 [s, mid] 的频次表与 Boyer-Moore 状态
      const freq: Map<number, number> = new Map<number, number>();
      let candidate: number = 0;
      let bmCount: number = 0;
      for (let k: number = s; k <= mid; k++) {
        const x: number = nums[k];
        freq.set(x, (freq.get(x) ?? 0) + 1);
        if (bmCount === 0) {
          candidate = x;
          bmCount = 1;
        } else if (x === candidate) {
          bmCount++;
        } else {
          bmCount--;
        }
      }
      // 复制状态，向右扩展到 [mid+1, hi]
      const freq2: Map<number, number> = new Map<number, number>(freq);
      let cand2: number = candidate;
      let bm2: number = bmCount;
      for (let e: number = mid + 1; e <= hi; e++) {
        const x: number = nums[e];
        freq2.set(x, (freq2.get(x) ?? 0) + 1);
        if (bm2 === 0) {
          cand2 = x;
          bm2 = 1;
        } else if (x === cand2) {
          bm2++;
        } else {
          bm2--;
        }
        const len: number = e - s + 1;
        if ((freq2.get(cand2) ?? 0) > Math.floor(len / 2)) {
          count++;
        }
      }
    }
    return count;
  }

  return solve(0, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 统计主要元素子数组数目 I =====");
console.log("方法1:", countMajoritySubarraysI_bm([1, 2, 1])); // 期望结果: 4
console.log("方法2:", countMajoritySubarraysI_dc([1, 2, 1])); // 期望结果: 4
console.log("方法1:", countMajoritySubarraysI_bm([1, 1, 1])); // 期望结果: 6
console.log("方法2:", countMajoritySubarraysI_dc([1, 1, 1])); // 期望结果: 6
console.log("方法1:", countMajoritySubarraysI_bm([1, 2, 3, 4])); // 期望结果: 4 (仅单元素子数组)
console.log("方法2:", countMajoritySubarraysI_dc([1, 2, 3, 4])); // 期望结果: 4
console.log("方法1:", countMajoritySubarraysI_bm([2, 2, 1, 2, 2])); // 期望结果: 13
console.log("方法2:", countMajoritySubarraysI_dc([2, 2, 1, 2, 2])); // 期望结果: 13

export {};
