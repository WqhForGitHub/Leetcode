// ============================================================
// 134. 小于 K 的两数之和
// ============================================================
// LeetCode 1099. Two Sum Less Than K
// 给定数组 nums 与整数 K，找出两个不同下标元素之和小于 K 的最大值，不存在返回 -1。

// 方法1：排序 + 双指针（推荐，O(n log n)）
// 排序后用左右指针：和小于 K 则更新答案并右移左指针；否则左移右指针。
function twoSumLessThanK(nums: number[], k: number): number {
  const n = nums.length;
  if (n < 2) return -1;
  const sorted = [...nums].sort((a, b) => a - b);
  let best = -1;
  let left = 0;
  let right = n - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum < k) {
      best = Math.max(best, sum);
      left++;
    } else {
      right--;
    }
  }
  return best;
}

// 方法2：计数排序 + 双指针（O(n + max)）
// 值域 0..1000，统计每个值出现次数，再用双指针在值域上扫描。
function twoSumLessThanK2(nums: number[], k: number): number {
  const n = nums.length;
  if (n < 2) return -1;
  const MAX = 1001;
  const count = new Array<number>(MAX).fill(0);
  for (const x of nums) count[x]++;
  let best = -1;
  let lo = 1;
  let hi = MAX - 1;
  while (lo <= hi) {
    if (count[lo] === 0) {
      lo++;
      continue;
    }
    if (count[hi] === 0) {
      hi--;
      continue;
    }
    if (lo + hi >= k) {
      hi--;
    } else {
      if (lo !== hi) {
        best = Math.max(best, lo + hi);
        lo++;
      } else {
        // 同一值需出现至少两次
        if (count[lo] >= 2) best = Math.max(best, lo + hi);
        lo++;
      }
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 小于 K 的两数之和 =====");
console.log("方法1:", twoSumLessThanK([34, 23, 1, 24, 75, 33, 54, 8], 60)); // 期望: 58
console.log("方法1:", twoSumLessThanK([10, 20, 30], 15)); // 期望: -1
console.log("方法2:", twoSumLessThanK2([34, 23, 1, 24, 75, 33, 54, 8], 60)); // 期望: 58
console.log("方法2:", twoSumLessThanK2([10, 20, 30], 15)); // 期望: -1
console.log("方法2:", twoSumLessThanK2([25, 25, 25], 50)); // 期望: -1
console.log("方法2:", twoSumLessThanK2([25, 25, 25], 51)); // 期望: 50

export {};
