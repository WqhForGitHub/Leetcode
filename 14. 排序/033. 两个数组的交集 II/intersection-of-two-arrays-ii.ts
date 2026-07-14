// ============================================================
// 033. 两个数组的交集 II
// ============================================================
// LeetCode 350. Intersection of Two Arrays II
// 返回两个数组的交集（包含重复元素，出现次数取两数组中的最小值）。

// 方法1：哈希表计数（推荐，O(n+m) 时间，O(min(n,m)) 空间）
// 用较短的数组构建计数表，再遍历另一个数组按剩余计数取交集。
function intersect(nums1: number[], nums2: number[]): number[] {
  // 保证 nums1 为较短数组，节省哈希空间
  if (nums1.length > nums2.length) {
    return intersect(nums2, nums1);
  }
  const count = new Map<number, number>();
  for (const num of nums1) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }
  const result: number[] = [];
  for (const num of nums2) {
    const c = count.get(num) ?? 0;
    if (c > 0) {
      result.push(num);
      count.set(num, c - 1);
    }
  }
  return result;
}

// 方法2：排序 + 双指针（O(n log n + m log m) 时间，O(1) 额外空间）
// 两个数组分别排序后，双指针同步扫描，相等即加入结果。
function intersectTwoPointers(nums1: number[], nums2: number[]): number[] {
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
      result.push(a[i]);
      i++;
      j++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 两个数组的交集 II =====");

function sortArr33(arr: number[]): number[] {
  return [...arr].sort((x, y) => x - y);
}

console.log("哈希计数 [1,2,2,1] & [2,2]:", sortArr33(intersect([1, 2, 2, 1], [2, 2]))); // 期望 [2,2]
console.log("哈希计数 [4,9,5] & [9,4,9,8,4]:", sortArr33(intersect([4, 9, 5], [9, 4, 9, 8, 4]))); // 期望 [4,9]
console.log("双指针  [1,2,2,1] & [2,2]:", sortArr33(intersectTwoPointers([1, 2, 2, 1], [2, 2]))); // 期望 [2,2]
console.log(
  "双指针  [4,9,5] & [9,4,9,8,4]:",
  sortArr33(intersectTwoPointers([4, 9, 5], [9, 4, 9, 8, 4])),
); // 期望 [4,9]

export {};
