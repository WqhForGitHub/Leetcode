// ============================================================
// 116. 错误的集合
// ============================================================
// LeetCode 645. Set Mismatch
// 集合 S 包含 1 到 n 的整数。由于错误，其中一个数被复制成另一个数，
// 导致丢失了一个数。找出重复的数和丢失的数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：哈希表计数
function findErrorNums(nums: number[]): number[] {
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  let dup = -1;
  let missing = -1;
  for (let i = 1; i <= nums.length; i++) {
    const c = count.get(i) || 0;
    if (c === 2) dup = i;
    else if (c === 0) missing = i;
  }
  return [dup, missing];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. 错误的集合 =====");
// 测试 1
console.log(findErrorNums([1, 2, 2, 4])); // 期望: [2, 3]
// 测试 2
console.log(findErrorNums([1, 1])); // 期望: [1, 2]
// 测试 3
console.log(findErrorNums([2, 2])); // 期望: [2, 1]
// 测试 4
console.log(findErrorNums([3, 2, 3, 4, 6, 5])); // 期望: [3, 1]

export {};
