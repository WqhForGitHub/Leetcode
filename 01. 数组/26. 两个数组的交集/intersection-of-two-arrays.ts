// ============================================================
// 26. 两个数组的交集
// ============================================================
// LeetCode 349. Intersection of Two Arrays
// 给定两个数组，返回它们的交集（不重复元素）。
// 时间复杂度：O(n+m)，空间复杂度：O(n+m)

// 方法1：双Set（推荐）
function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set<number>(nums1);
  const resultSet = new Set<number>();
  for (const num of nums2) {
    if (set1.has(num)) {
      resultSet.add(num);
    }
  }
  return Array.from(resultSet);
}

// 方法2：排序+双指针
function intersectionTwoPointer(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      // 去重：仅当结果为空或与最后一个不同时加入
      if (result.length === 0 || result[result.length - 1] !== nums1[i]) {
        result.push(nums1[i]);
      }
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
console.log("===== 26. 两个数组的交集 =====");
console.log("描述:", intersection([1, 2, 2, 1], [2, 2])); // 期望结果: [2]
console.log("描述:", intersection([4, 9, 5], [9, 4, 9, 8, 4])); // 期望结果: [9, 4] 或 [4, 9]
console.log("描述:", intersectionTwoPointer([1, 2, 2, 1], [2, 2])); // 期望结果: [2]
console.log("描述:", intersectionTwoPointer([4, 9, 5], [9, 4, 9, 8, 4])); // 期望结果: [4, 9]

export {};
