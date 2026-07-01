// ============================================================
// 061. 到达终点数字
// ============================================================
// LeetCode 754. Reach a Number
// 从 0 开始，第 i 步可以左移或右移 i，到达 target 的最少步数。

// 方法1：数学 + 二分查找
function reachNumber(target: number): number {
  target = Math.abs(target);
  // 找最小的 k 使得 1+2+...+k >= target
  let left = 0;
  let right = target;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const sum = (mid * (mid + 1)) / 2;
    if (sum >= target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  // 调整使得差值为偶数
  while (((left * (left + 1)) / 2 - target) % 2 !== 0) {
    left++;
  }
  return left;
}

// 方法2：直接计算
function reachNumberMath(target: number): number {
  target = Math.abs(target);
  let k = 0;
  let sum = 0;
  while (sum < target || (sum - target) % 2 !== 0) {
    k++;
    sum += k;
  }
  return k;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 到达终点数字 =====");
console.log("二分 3:", reachNumber(3)); // 2
console.log("二分 2:", reachNumber(2)); // 3
console.log("数学 3:", reachNumberMath(3)); // 2

export {};
