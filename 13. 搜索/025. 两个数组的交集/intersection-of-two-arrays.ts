// ============================================================
// 025. 两个数组的交集
// ============================================================
// LeetCode 349. Intersection of Two Arrays
// 返回两个数组的交集（结果中每个元素唯一）。

// 方法1：排序 + 双指针
function intersection(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      i++;
    } else if (nums1[i] > nums2[j]) {
      j++;
    } else {
      if (result.length === 0 || result[result.length - 1] !== nums1[i]) {
        result.push(nums1[i]);
      }
      i++;
      j++;
    }
  }
  return result;
}

// 方法2：排序 + 二分查找
function intersectionBinary(nums1: number[], nums2: number[]): number[] {
  nums2.sort((a, b) => a - b);
  const set = new Set<number>();
  for (const num of nums1) {
    let left = 0;
    let right = nums2.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums2[mid] === num) {
        set.add(num);
        break;
      } else if (nums2[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return Array.from(set);
}

// 方法3：哈希集合
function intersectionHash(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const result: number[] = [];
  for (const num of nums2) {
    if (set1.has(num)) {
      result.push(num);
      set1.delete(num);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 两个数组的交集 =====");
console.log("双指针 [1,2,2,1],[2,2]:", intersection([1, 2, 2, 1], [2, 2])); // [2]
console.log("二分 [4,9,5],[9,4,9,8,4]:", intersectionBinary([4, 9, 5], [9, 4, 9, 8, 4]).sort()); // [4,9]
console.log("哈希 [1,2,2,1],[2,2]:", intersectionHash([1, 2, 2, 1], [2, 2])); // [2]

export {};
