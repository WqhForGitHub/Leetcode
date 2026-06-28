// ============================================================
// 154. 数组的均值分割
// ============================================================
// LeetCode 805. Split Array With Same Average
// 判断能否将数组分成两个非空子集，使两者平均值相等。
// 时间复杂度：O(n^2 * sum)；空间复杂度：O(n * sum)

// 思路：等价于存在子集 A，使 sum(A)/|A| = sum(nums)/n
// 转化为 sum(A) * n = sum(nums) * |A|
// 用 DP 枚举不同子集大小可能的和
function splitArraySameAverage(nums: number[]): boolean {
  const n = nums.length;
  if (n < 2) return false;
  const total = nums.reduce((a, b) => a + b, 0);
  const half = Math.floor(n / 2); // 子集大小最大为 n/2（取较小那半）

  // 提前剪枝：若存在 k 满足 total * k 能被 n 整除
  let possible = false;
  for (let k = 1; k <= half; k++) {
    if ((total * k) % n === 0) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;

  // DP：dp[k] 表示大小为 k 的子集可能的和集合
  const dp: Set<number>[] = new Array(half + 1);
  for (let i = 0; i <= half; i++) dp[i] = new Set();
  dp[0].add(0);

  for (const num of nums) {
    // 倒序更新，避免重复使用
    for (let k = half; k >= 1; k--) {
      for (const s of dp[k - 1]) {
        const newSum = s + num;
        // 检查是否满足均值条件：sum(A)*n == total*k
        if (newSum * n === total * k) {
          return true;
        }
        dp[k].add(newSum);
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 数组的均值分割 =====");
console.log(splitArraySameAverage([1, 2, 3, 4, 5, 6, 7, 8])); // 期望: true
console.log(splitArraySameAverage([3, 1])); // 期望: false
console.log(splitArraySameAverage([1, 2, 3])); // 期望: true ({1,3} 均值 2, {2} 均值 2)

export {};
