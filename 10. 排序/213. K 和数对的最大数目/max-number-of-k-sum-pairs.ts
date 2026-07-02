// ============================================================
// 213. K 和数对的最大数目
// ============================================================
// LeetCode 1679. Max Number of K-Sum Pairs
// 每次从数组中选出两个和为 k 的数并移除，求最多能进行多少次操作。

// 方法1：排序 + 双指针（O(n log n)）
function maxOperations(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;
  let ops = 0;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === k) {
      ops++;
      left++;
      right--;
    } else if (sum < k) {
      left++;
    } else {
      right--;
    }
  }
  return ops;
}

// 方法2：哈希表计数（O(n)）
// 对每个数，若 k-num 已有计数则配对，否则把该数加入计数。
function maxOperations2(nums: number[], k: number): number {
  const count = new Map<number, number>();
  let ops = 0;
  for (const num of nums) {
    const complement = k - num;
    const c = count.get(complement);
    if (c !== undefined && c > 0) {
      ops++;
      if (c === 1) count.delete(complement);
      else count.set(complement, c - 1);
    } else {
      count.set(num, (count.get(num) ?? 0) + 1);
    }
  }
  return ops;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 213. K 和数对的最大数目 =====");
console.log("方法1 [1,2,3,4],5:", maxOperations([1, 2, 3, 4], 5)); // 2
console.log("方法1 [3,1,3,4,3],6:", maxOperations([3, 1, 3, 4, 3], 6)); // 1
console.log("方法2 [1,2,3,4],5:", maxOperations2([1, 2, 3, 4], 5)); // 2
console.log("方法2 [3,1,3,4,3],6:", maxOperations2([3, 1, 3, 4, 3], 6)); // 1

export {};
