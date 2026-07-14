// ============================================================
// 063. 最小分割分数
// ============================================================
// 给定数组 nums（长度为 n），在下标 i（0 <= i < n-1）处将数组分成两个非空部分：
//   左部分 nums[0..i]，右部分 nums[i+1..n-1]。
// 分割分数 = |sum(左) - sum(右)|，求所有分割点中的最小分数。
// 时间复杂度：O(n)，空间复杂度：O(1) 或 O(n)

// 方法1：总和 + 单次扫描（推荐）
// 先求总和 total，再从左到右维护 leftSum，
// score = |leftSum - (total - leftSum)| = |2*leftSum - total|，取最小值即可。
function minimumSplitScore1(nums: number[]): number {
  const n: number = nums.length;
  if (n < 2) return 0;
  let total: number = 0;
  for (let i: number = 0; i < n; i++) total += nums[i];

  let leftSum: number = 0;
  let minScore: number = Infinity;
  // 分割点 i：左部分 [0..i]，右部分 [i+1..n-1]，故 i 取到 n-2
  for (let i: number = 0; i < n - 1; i++) {
    leftSum += nums[i];
    const score: number = Math.abs(2 * leftSum - total);
    if (score < minScore) minScore = score;
  }
  return minScore;
}

// 方法2：前缀和 + 分治
// 先构造前缀和数组 prefix（prefix[i] = nums[0..i-1] 之和），
// 分割点 i 的分数 = |prefix[i+1] - (total - prefix[i+1])|。
// 用分治在分割点区间 [0, n-2] 上递归求最小值：每层取中点计算并合并两侧结果。
// 总体仍为 O(n)。
function minimumSplitScore2(nums: number[]): number {
  const n: number = nums.length;
  if (n < 2) return 0;

  const prefix: number[] = new Array<number>(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const total: number = prefix[n];

  // 分治：在分割点区间 [lo, hi]（闭区间，分割点 i 对应左部分 prefix[i+1]）求最小分数
  const solve = (lo: number, hi: number): number => {
    if (lo > hi) return Infinity;
    if (lo === hi) {
      const leftSum: number = prefix[lo + 1];
      return Math.abs(2 * leftSum - total);
    }
    const mid: number = (lo + hi) >> 1;
    const leftMin: number = solve(lo, mid);
    const rightMin: number = solve(mid + 1, hi);
    return Math.min(leftMin, rightMin);
  };

  return solve(0, n - 2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 最小分割分数 =====");
// [1,2,3,4,5] total=15
//   i=0:1,14->13; i=1:3,12->9; i=2:6,9->3; i=3:10,5->5 => 最小 3
console.log("方法1 [1,2,3,4,5]:", minimumSplitScore1([1, 2, 3, 4, 5])); // 期望: 3
console.log("方法2 [1,2,3,4,5]:", minimumSplitScore2([1, 2, 3, 4, 5])); // 期望: 3
// [7,1,5,3,6,4] total=26
//   i=0:7,19->12; i=1:8,18->10; i=2:13,13->0; i=3:16,10->6; i=4:22,4->18 => 最小 0
console.log("方法1 [7,1,5,3,6,4]:", minimumSplitScore1([7, 1, 5, 3, 6, 4])); // 期望: 0
console.log("方法2 [7,1,5,3,6,4]:", minimumSplitScore2([7, 1, 5, 3, 6, 4])); // 期望: 0
// [10,10] => |10-10|=0
console.log("方法1 [10,10]:", minimumSplitScore1([10, 10])); // 期望: 0
console.log("方法2 [10,10]:", minimumSplitScore2([10, 10])); // 期望: 0
// [1,1,1,10] total=13
//   i=0:1,12->11; i=1:2,11->9; i=2:3,10->7 => 最小 7
console.log("方法1 [1,1,1,10]:", minimumSplitScore1([1, 1, 1, 10])); // 期望: 7
console.log("方法2 [1,1,1,10]:", minimumSplitScore2([1, 1, 1, 10])); // 期望: 7

export {};
