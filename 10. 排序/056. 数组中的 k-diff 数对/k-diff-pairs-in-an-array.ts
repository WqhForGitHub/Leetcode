// ============================================================
// 056. 数组中的 k-diff 数对
// ============================================================
// LeetCode 532. K-diff Pairs in an Array
// 统计数组中差值恰好为 k 的不同数对个数（数对以值区分，不计下标）。

// 方法1：哈希表计数（推荐，O(n) 时间，O(n) 空间）
// 统计每个数出现次数。k>0 时，对每个数 num 检查 num+k 是否存在；
// k==0 时，统计出现次数 >= 2 的数。
function findPairs(nums: number[], k: number): number {
  if (k < 0) return 0; // 差值绝对值不可能为负
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  let result = 0;
  for (const [num, c] of count) {
    if (k === 0) {
      if (c >= 2) result++;
    } else {
      // 只检查 num+k，避免重复计数（num-k 会在其自身轮次被检查）
      if (count.has(num + k)) result++;
    }
  }
  return result;
}

// 方法2：排序 + 双指针（O(n log n) 时间，O(1) 额外空间）
// 排序后用左右指针扫描，找到差值为 k 的去重数对。
function findPairsTwoPointers(nums: number[], k: number): number {
  if (k < 0) return 0;
  nums.sort((a, b) => a - b);
  let result = 0;
  let left = 0;
  let right = 1;
  const n = nums.length;

  while (left < n && right < n) {
    if (left === right) {
      right++;
    } else {
      const diff = nums[right] - nums[left];
      if (diff < k) {
        right++;
      } else if (diff > k) {
        left++;
      } else {
        // 找到一对
        result++;
        // 跳过 left 的所有重复值
        const lv = nums[left];
        while (left < n && nums[left] === lv) left++;
        // right 至少要在 left 之后
        if (right <= left) right = left + 1;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 数组中的 k-diff 数对 =====");
console.log("哈希 [3,1,4,1,5], k=2:", findPairs([3, 1, 4, 1, 5], 2)); // 期望 2 (1,3 和 3,5)
console.log("哈希 [1,2,3,4,5], k=1:", findPairs([1, 2, 3, 4, 5], 1)); // 期望 4
console.log("哈希 [1,3,1,5,4], k=0:", findPairs([1, 3, 1, 5, 4], 0)); // 期望 1 (1,1)
console.log("双指针 [3,1,4,1,5], k=2:", findPairsTwoPointers([3, 1, 4, 1, 5], 2)); // 期望 2
console.log("双指针 [1,2,3,4,5], k=1:", findPairsTwoPointers([1, 2, 3, 4, 5], 1)); // 期望 4
console.log("双指针 [1,3,1,5,4], k=0:", findPairsTwoPointers([1, 3, 1, 5, 4], 0)); // 期望 1

export {};
