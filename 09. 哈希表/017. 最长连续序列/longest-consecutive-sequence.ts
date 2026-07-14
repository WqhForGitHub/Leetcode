// ============================================================
// 017. 最长连续序列
// ============================================================
// LeetCode 128. Longest Consecutive Sequence
// 给定一个未排序的整数数组，找出最长连续元素序列的长度。
// 使用哈希集合，仅从序列起点开始向右扩展，实现 O(n) 时间复杂度。
// 时间复杂度：O(n)，空间复杂度：O(n)

function longestConsecutive(nums: number[]): number {
  const numSet = new Set<number>(nums);
  let longest = 0;

  for (const num of numSet) {
    // 只有当 num 是连续序列起点（num-1 不存在）时才向右扩展
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;

      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }

      longest = Math.max(longest, currentStreak);
    }
  }

  return longest;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 最长连续序列 =====");
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4 (序列为 1,2,3,4)
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([1, 2, 0, 1])); // 3 (序列为 0,1,2)
console.log(longestConsecutive([])); // 0

export {};
