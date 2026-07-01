// ============================================================
// 062. 有效三角形的个数
// ============================================================
// LeetCode 611. Valid Triangle Number
// 给定非负整数数组，统计其中可以组成三角形三条边的三元组个数。
// 三角形条件：任意两边之和大于第三边；排序后 a <= b <= c 只需 a + b > c。

// 方法1：排序 + 双指针（推荐，O(n²) 时间，O(1) 额外空间）
// 固定最长边 c（从右往左），用 left/right 双指针在 [0, c-1] 区间内
// 寻找所有满足 nums[left] + nums[right] > nums[c] 的对数。
function triangleNumber(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;
  // 固定最长边 c
  for (let c = n - 1; c >= 2; c--) {
    let left = 0;
    let right = c - 1;
    while (left < right) {
      if (nums[left] + nums[right] > nums[c]) {
        // left 在 [left, right-1] 范围内都满足，共 right - left 个
        count += right - left;
        right--;
      } else {
        left++;
      }
    }
  }
  return count;
}

// 方法2：暴力三重循环（O(n³) 时间，O(1) 空间）
// 直接枚举所有三元组验证三角形条件，仅用于验证正确性或小数据。
function triangleNumberBruteForce(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = nums[i];
        const b = nums[j];
        const c = nums[k];
        // 排除 0 边并验证三条不等式
        if (a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a) {
          count++;
        }
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 有效三角形的个数 =====");
console.log("双指针 [2,2,3,4]:", triangleNumber([2, 2, 3, 4])); // 期望 3
console.log("双指针 [4,2,3,4]:", triangleNumber([4, 2, 3, 4])); // 期望 4
console.log("双指针 [1,1,1,1]:", triangleNumber([1, 1, 1, 1])); // 期望 4
console.log("双指针 [0,0,0]:", triangleNumber([0, 0, 0])); // 期望 0
console.log("暴力法 [2,2,3,4]:", triangleNumberBruteForce([2, 2, 3, 4])); // 期望 3
console.log("暴力法 [4,2,3,4]:", triangleNumberBruteForce([4, 2, 3, 4])); // 期望 4
console.log("暴力法 [1,1,1,1]:", triangleNumberBruteForce([1, 1, 1, 1])); // 期望 4
console.log("暴力法 [0,0,0]:", triangleNumberBruteForce([0, 0, 0])); // 期望 0

export {};
