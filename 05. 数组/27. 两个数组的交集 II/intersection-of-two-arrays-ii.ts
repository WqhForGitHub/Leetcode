// ============================================================
// 27. 两个数组的交集 II
// ============================================================
// LeetCode 350. Intersection of Two Arrays II
// 给定两个数组，返回它们的交集（包含重复元素）。
// 时间复杂度：O(n+m)，空间复杂度：O(min(n,m))

// 方法1：哈希表计数（推荐）
function intersect(nums1: number[], nums2: number[]): number[] {
  // 为了节省空间，将较短数组放入哈希表
  if (nums1.length > nums2.length) {
    return intersect(nums2, nums1);
  }
  const map = new Map<number, number>();
  for (const num of nums1) {
    map.set(num, (map.get(num) ?? 0) + 1);
  }
  const result: number[] = [];
  for (const num of nums2) {
    const count = map.get(num) ?? 0;
    if (count > 0) {
      result.push(num);
      map.set(num, count - 1);
    }
  }
  return result;
}

// 方法2：排序+双指针
function intersectTwoPointer(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      result.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 27. 两个数组的交集 II =====");
console.log("描述:", intersect([1, 2, 2, 1], [2, 2])); // 期望结果: [2, 2]
console.log("描述:", intersect([4, 9, 5], [9, 4, 9, 8, 4])); // 期望结果: [4, 9] 或 [9, 4]
console.log("描述:", intersectTwoPointer([1, 2, 2, 1], [2, 2])); // 期望结果: [2, 2]
console.log("描述:", intersectTwoPointer([4, 9, 5], [9, 4, 9, 8, 4])); // 期望结果: [4, 9]

export {};
