// ============================================================
// 032. 两个数组的交集
// ============================================================
// LeetCode 349. Intersection of Two Arrays
// 返回两个数组的交集（每个元素只出现一次，结果顺序不限）。

// 方法1：哈希集合（推荐，O(n+m) 时间，O(n+m) 空间）
// 用一个集合存第一个数组，再遍历第二个数组取交集，最后去重。
function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const result = new Set<number>();
  for (const num of nums2) {
    if (set1.has(num)) {
      result.add(num);
    }
  }
  return Array.from(result);
}

// 方法2：排序 + 双指针（O(n log n + m log m) 时间，O(1) 额外空间）
// 两个数组分别排序后，用双指针同步扫描，遇到相等元素加入结果（跳过重复）。
function intersectionTwoPointers(nums1: number[], nums2: number[]): number[] {
  const a = [...nums1].sort((x, y) => x - y);
  const b = [...nums2].sort((x, y) => x - y);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] < b[j]) {
      i++;
    } else if (a[i] > b[j]) {
      j++;
    } else {
      // 相等：仅当与上次加入结果不同时才加入，避免重复
      if (result.length === 0 || result[result.length - 1] !== a[i]) {
        result.push(a[i]);
      }
      i++;
      j++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 两个数组的交集 =====");

function sortArr(arr: number[]): number[] {
  return [...arr].sort((x, y) => x - y);
}

console.log("哈希集合 [1,2,2,1] & [2,2]:", sortArr(intersection([1, 2, 2, 1], [2, 2]))); // 期望 [2]
console.log("哈希集合 [4,9,5] & [9,4,9,8,4]:", sortArr(intersection([4, 9, 5], [9, 4, 9, 8, 4]))); // 期望 [4,9]
console.log("双指针 [1,2,2,1] & [2,2]:", sortArr(intersectionTwoPointers([1, 2, 2, 1], [2, 2]))); // 期望 [2]
console.log(
  "双指针 [4,9,5] & [9,4,9,8,4]:",
  sortArr(intersectionTwoPointers([4, 9, 5], [9, 4, 9, 8, 4])),
); // 期望 [4,9]

export {};
