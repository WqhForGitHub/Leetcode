// ============================================================
// 036. 有序转化数组
// ============================================================
// LeetCode 360. Sort Transformed Array
// 给定已排序数组 nums 与二次函数 f(x) = a*x² + b*x + c，
// 返回每个元素转化后按升序排列的结果。

// 方法1：双指针按抛物线方向填充（O(n) 时间，O(n) 空间）
// a > 0：开口向上，两端值大，从末尾向前填较大者；
// a <= 0：开口向下（或线性），两端值小，从头向后填较小者。
function sortTransformedArray(nums: number[], a: number, b: number, c: number): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);
  const transform = (x: number): number => a * x * x + b * x + c;
  let left = 0;
  let right = n - 1;
  // a > 0 从后往前填；a <= 0 从前往后填
  let idx = a > 0 ? n - 1 : 0;
  while (left <= right) {
    const leftVal = transform(nums[left]);
    const rightVal = transform(nums[right]);
    if (a > 0) {
      // 开口向上：取两端较大者放到末尾
      if (leftVal >= rightVal) {
        result[idx--] = leftVal;
        left++;
      } else {
        result[idx--] = rightVal;
        right--;
      }
    } else {
      // 开口向下（或线性）：取两端较小者放到开头
      if (leftVal <= rightVal) {
        result[idx++] = leftVal;
        left++;
      } else {
        result[idx++] = rightVal;
        right--;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 有序转化数组 =====");

console.log("[-4,-2,2,4], a=-1,b=3,c=5:", sortTransformedArray([-4, -2, 2, 4], -1, 3, 5)); // 期望 [-23,-5,1,7]
console.log("[-4,-2,2,4], a=1,b=3,c=5:", sortTransformedArray([-4, -2, 2, 4], 1, 3, 5)); // 期望 [3,9,15,33]
console.log("[-2,0], a=1,b=3,c=5:", sortTransformedArray([-2, 0], 1, 3, 5)); // 期望 [3,5]
console.log("[1,2,3,4], a=0,b=1,c=0:", sortTransformedArray([1, 2, 3, 4], 0, 1, 0)); // 期望 [1,2,3,4] (线性递增)
console.log("[1,2,3,4], a=0,b=-1,c=0:", sortTransformedArray([1, 2, 3, 4], 0, -1, 0)); // 期望 [-4,-3,-2,-1] (线性递减)

export {};
