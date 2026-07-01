// ============================================================
// 026. 两个数组的交集 II
// ============================================================
// LeetCode 350. Intersection of Two Arrays II
// 返回两个数组的交集，结果中每个元素出现次数应与两数组中出现次数一致。

// 方法1：排序 + 双指针
function intersect(nums1: number[], nums2: number[]): number[] {
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
      result.push(nums1[i]);
      i++;
      j++;
    }
  }
  return result;
}

// 方法2：哈希表计数
function intersectHash(nums1: number[], nums2: number[]): number[] {
  const map = new Map<number, number>();
  for (const num of nums1) {
    map.set(num, (map.get(num) || 0) + 1);
  }
  const result: number[] = [];
  for (const num of nums2) {
    if (map.has(num) && map.get(num)! > 0) {
      result.push(num);
      map.set(num, map.get(num)! - 1);
    }
  }
  return result;
}

// 方法3：排序 + 二分查找（适合一个数组很大一个很小）
function intersectBinary(nums1: number[], nums2: number[]): number[] {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  nums2.sort((a, b) => a - b);
  const result: number[] = [];
  for (const num of nums1) {
    let left = 0;
    let right = nums2.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums2[mid] >= num) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    if (left < nums2.length && nums2[left] === num) {
      result.push(num);
      nums2.splice(left, 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 两个数组的交集 II =====");
console.log("双指针 [1,2,2,1],[2,2]:", intersect([1, 2, 2, 1], [2, 2])); // [2,2]
console.log("哈希 [4,9,5],[9,4,9,8,4]:", intersectHash([4, 9, 5], [9, 4, 9, 8, 4]).sort()); // [4,9]

export {};
