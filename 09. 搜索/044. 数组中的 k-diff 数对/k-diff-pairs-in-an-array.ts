// ============================================================
// 044. 数组中的 k-diff 数对
// ============================================================
// LeetCode 532. K-diff Pairs in an Array
// 统计差恰好为 k 的不同数对个数。

// 方法1：排序 + 双指针
function findPairs(nums: number[], k: number): number {
  if (k < 0) return 0;
  nums.sort((a, b) => a - b);
  let count = 0;
  let left = 0;
  let right = 1;
  while (right < nums.length) {
    if (left === right || nums[right] - nums[left] < k) {
      right++;
    } else if (nums[right] - nums[left] > k) {
      left++;
    } else {
      count++;
      // 跳过重复
      while (left < nums.length && nums[left] === nums[left + 1]) left++;
      left++;
      right++;
    }
  }
  return count;
}

// 方法2：哈希表
function findPairsHash(nums: number[], k: number): number {
  if (k < 0) return 0;
  const map = new Map<number, number>();
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }
  let count = 0;
  for (const [num, freq] of map) {
    if (k === 0) {
      if (freq >= 2) count++;
    } else {
      if (map.has(num + k)) count++;
    }
  }
  return count;
}

// 方法3：排序 + 二分查找
function findPairsBinary(nums: number[], k: number): number {
  if (k < 0) return 0;
  nums.sort((a, b) => a - b);
  const seen = new Set<number>();
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) continue;
    seen.add(nums[i]);
    // 二分找 nums[i] + k
    let left = i + 1;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === nums[i] + k) {
        count++;
        break;
      } else if (nums[mid] < nums[i] + k) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 数组中的 k-diff 数对 =====");
console.log("双指针 [3,1,4,1,5],2:", findPairs([3, 1, 4, 1, 5], 2)); // 2
console.log("哈希 [1,2,3,4,5],1:", findPairsHash([1, 2, 3, 4, 5], 1)); // 4
console.log("二分 [1,3,1,5,4],0:", findPairsBinary([1, 3, 1, 5, 4], 0)); // 1

export {};
