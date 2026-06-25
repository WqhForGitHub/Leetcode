// ============================================================
// 28. 第三大的数
// ============================================================
// LeetCode 414. Third Maximum Number
// 给定非空整数数组，返回第三大的数；如果不存在则返回最大的数。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：三个变量记录前三大的数（推荐）
function thirdMax(nums: number[]): number {
  // 用 null 表示尚未赋值（用 Number.MIN_SAFE_INTEGER 可能与真实元素冲突）
  let first: number | null = null;
  let second: number | null = null;
  let third: number | null = null;

  for (const num of nums) {
    // 跳过与已有前三值相同的元素（去重）
    if (num === first || num === second || num === third) {
      continue;
    }
    if (first === null || num > first) {
      third = second;
      second = first;
      first = num;
    } else if (second === null || num > second) {
      third = second;
      second = num;
    } else if (third === null || num > third) {
      third = num;
    }
  }

  // 第三大不存在则返回最大值
  return third === null ? (first as number) : third;
}

// 方法2：Set 去重后排序
function thirdMaxSort(nums: number[]): number {
  const distinct = Array.from(new Set(nums));
  distinct.sort((a, b) => b - a); // 降序
  return distinct.length >= 3 ? distinct[2] : distinct[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 28. 第三大的数 =====");
console.log("描述:", thirdMax([3, 2, 1])); // 期望结果: 1
console.log("描述:", thirdMax([1, 2])); // 期望结果: 2
console.log("描述:", thirdMax([2, 2, 3, 1])); // 期望结果: 1
console.log("描述:", thirdMaxSort([3, 2, 1])); // 期望结果: 1
console.log("描述:", thirdMaxSort([1, 2])); // 期望结果: 2
console.log("描述:", thirdMaxSort([2, 2, 3, 1])); // 期望结果: 1

export {};
