// ============================================================
// 032. 猜数字大小
// ============================================================
// LeetCode 374. Guess Number Higher or Lower
// 从 1 到 n 中选一个数字，提供 guess(num) 接口，返回猜的数字。

// 模拟 API
let pick = 6;
function guess(num: number): number {
  if (num === pick) return 0;
  if (num < pick) return 1;
  return -1;
}

// 方法1：二分查找
function guessNumber(n: number): number {
  let left = 1;
  let right = n;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const res = guess(mid);
    if (res === 0) return mid;
    if (res === 1) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 方法2：三分查找（每次将搜索空间缩小为1/3）
function guessNumberTernary(n: number): number {
  let left = 1;
  let right = n;
  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);
    const r1 = guess(mid1);
    const r2 = guess(mid2);
    if (r1 === 0) return mid1;
    if (r2 === 0) return mid2;
    if (r1 < 0) {
      right = mid1 - 1;
    } else if (r2 > 0) {
      left = mid2 + 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 猜数字大小 =====");
pick = 6;
console.log("二分 10:", guessNumber(10)); // 6
pick = 1;
console.log("二分 1:", guessNumber(1)); // 1
pick = 2;
console.log("三分 2:", guessNumberTernary(2)); // 2

export {};
