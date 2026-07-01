// ============================================================
// 046. 有效三角形的个数
// ============================================================
// LeetCode 611. Valid Triangle Number
// 统计可以组成三角形三条边的三元组个数（a+b>c）。

// 方法1：排序 + 双指针（O(n²)）
function triangleNumber(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let k = nums.length - 1; k >= 2; k--) {
    let i = 0;
    let j = k - 1;
    while (i < j) {
      if (nums[i] + nums[j] > nums[k]) {
        count += j - i;
        j--;
      } else {
        i++;
      }
    }
  }
  return count;
}

// 方法2：排序 + 二分查找（O(n² log n)）
function triangleNumberBinary(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      // 找最大的 k 使得 nums[i] + nums[j] > nums[k]
      const sum = nums[i] + nums[j];
      let lo = j + 1;
      let hi = nums.length - 1;
      let k = j;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] < sum) {
          k = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      count += k - j;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 有效三角形的个数 =====");
console.log("双指针 [2,2,3,4]:", triangleNumber([2, 2, 3, 4])); // 3
console.log("双指针 [4,2,3,4]:", triangleNumber([4, 2, 3, 4])); // 4
console.log("二分 [2,2,3,4]:", triangleNumberBinary([2, 2, 3, 4])); // 3

export {};
