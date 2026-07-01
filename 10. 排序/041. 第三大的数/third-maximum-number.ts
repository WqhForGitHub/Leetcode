// ============================================================
// 041. 第三大的数
// ============================================================
// LeetCode 414. Third Maximum Number
// 返回数组中第三大的不同数，若不同数少于 3 个则返回最大值。

// 方法1：三个变量维护前三大（推荐，O(n) 时间，O(1) 空间）
// 用三个变量分别记录第一、第二、第三大的不同数，遍历一次更新。
// 注意：题目数据可能包含 -Infinity 范围的数，因此用 null 表示未设置。
function thirdMax_threeVars(nums: number[]): number {
  let first: number | null = null;
  let second: number | null = null;
  let third: number | null = null;

  for (const num of nums) {
    // 跳过已经出现过的不同数
    if (num === first || num === second || num === third) continue;
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

  return third === null ? (first as number) : third;
}

// 方法2：排序去重（O(n log n) 时间，O(n) 空间）
// 排序后去重，若不同数 >= 3 个返回第三大，否则返回最大。
function thirdMax_sort(nums: number[]): number {
  const distinct = Array.from(new Set(nums));
  distinct.sort((a, b) => b - a);
  return distinct.length >= 3 ? distinct[2] : distinct[0];
}

// 方法3：有序集合模拟（O(n) 时间，O(1) 空间，最多容纳 3 个元素）
// 维护一个大小最多为 3 的有序数组，新元素插入后若超过 3 个则移除最小的。
function thirdMax_sortedSet(nums: number[]): number {
  const sorted: number[] = []; // 降序，最多保留 3 个

  for (const num of nums) {
    // 已存在则跳过
    if (sorted.includes(num)) continue;

    // 找到插入位置
    let i = 0;
    while (i < sorted.length && sorted[i] > num) i++;
    sorted.splice(i, 0, num);

    // 保持最多 3 个，移除最小的（末尾）
    if (sorted.length > 3) sorted.pop();
  }

  return sorted.length >= 3 ? sorted[2] : sorted[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 第三大的数 =====");
console.log("三变量 [3,2,1]:", thirdMax_threeVars([3, 2, 1])); // 期望: 1
console.log("三变量 [1,2]:", thirdMax_threeVars([1, 2])); // 期望: 2
console.log("三变量 [2,2,3,1]:", thirdMax_threeVars([2, 2, 3, 1])); // 期望: 1
console.log("三变量 [1,1,2]:", thirdMax_threeVars([1, 1, 2])); // 期望: 2
console.log("三变量 [5,2,2,1]:", thirdMax_threeVars([5, 2, 2, 1])); // 期望: 1

console.log("排序去重 [3,2,1]:", thirdMax_sort([3, 2, 1])); // 期望: 1
console.log("排序去重 [1,2]:", thirdMax_sort([1, 2])); // 期望: 2
console.log("排序去重 [2,2,3,1]:", thirdMax_sort([2, 2, 3, 1])); // 期望: 1

console.log("有序集合 [3,2,1]:", thirdMax_sortedSet([3, 2, 1])); // 期望: 1
console.log("有序集合 [1,2]:", thirdMax_sortedSet([1, 2])); // 期望: 2
console.log("有序集合 [2,2,3,1]:", thirdMax_sortedSet([2, 2, 3, 1])); // 期望: 1

export {};
