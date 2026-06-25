// ============================================================
// 12. 只出现一次的数字
// ============================================================
// LeetCode 136. Single Number
// 给定非空整数数组，除了某个元素只出现一次外，其余每个元素均出现两次。找出那个只出现一次的元素。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：异或（推荐）
// 异或性质：a ^ a = 0，a ^ 0 = a，异或满足交换律和结合律
function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num; // 出现两次的数会相互抵消
  }
  return result;
}

// 方法2：哈希表
function singleNumberHash(nums: number[]): number {
  const set = new Set<number>();
  for (const num of nums) {
    if (set.has(num)) {
      set.delete(num); // 第二次出现则移除
    } else {
      set.add(num); // 第一次出现则加入
    }
  }
  // set 中剩下的就是只出现一次的元素
  return set.values().next().value as number;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 12. 只出现一次的数字 =====");
console.log("描述:", singleNumber([2, 2, 1])); // 期望结果: 1
console.log("描述:", singleNumber([4, 1, 2, 1, 2])); // 期望结果: 4
console.log("描述:", singleNumber([1])); // 期望结果: 1
console.log("描述:", singleNumberHash([2, 2, 1])); // 期望结果: 1
console.log("描述:", singleNumberHash([4, 1, 2, 1, 2])); // 期望结果: 4

export {};
