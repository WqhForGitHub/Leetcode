// ============================================================
// 012. 多数元素
// ============================================================
// LeetCode 169. Majority Element
// 给定大小为 n 的数组，找出多数元素（出现次数大于 n/2 的元素）。

// 方法1：Boyer-Moore 投票算法（推荐，O(n) 时间，O(1) 空间）
function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }
  return candidate;
}

// 方法2：排序后取中位数（O(n log n) 时间，O(1) 或 O(log n) 空间）
function majorityElementSort(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// 方法3：哈希表统计（O(n) 时间，O(n) 空间）
function majorityElementHash(nums: number[]): number {
  const map = new Map<number, number>();
  const half = Math.floor(nums.length / 2);
  for (const v of nums) {
    const c = (map.get(v) ?? 0) + 1;
    if (c > half) return v;
    map.set(v, c);
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 多数元素 =====");
console.log("投票 [3,2,3]:", majorityElement([3, 2, 3])); // 3
console.log("投票 [2,2,1,1,1,2,2]:", majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
console.log("排序 [3,2,3]:", majorityElementSort([3, 2, 3])); // 3
console.log("哈希 [2,2,1,1,1,2,2]:", majorityElementHash([2, 2, 1, 1, 1, 2, 2])); // 2

export {};
