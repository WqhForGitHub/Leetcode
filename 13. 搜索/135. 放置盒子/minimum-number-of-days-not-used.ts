// ============================================================
// 135. 放置盒子
// ============================================================
// LeetCode 1739. Building Boxes
// 给定 n 个盒子，第 i 层可放 1, 2, 3, ... 个，但下面的盒子要支撑上面的。
// 求最少占地面积。

// 方法1：数学 + 二分查找
function minimumBoxes(n: number): number {
  if (n <= 3) return n;
  // 先找最大完整金字塔
  let level = 1;
  let total = 0;
  while (total + (level * (level + 1)) / 2 <= n) {
    total += (level * (level + 1)) / 2;
    level++;
  }
  level--;
  if (total === n) return (level * (level + 1)) / 2;
  // 剩余需要放在地面上
  let remaining = n - total;
  let ground = 0;
  let i = 1;
  while (remaining > 0) {
    remaining -= i;
    ground += i;
    i++;
  }
  return (level * (level + 1)) / 2 + ground;
}

// 方法2：二分查找
function minimumBoxesBinary(n: number): number {
  // 找最大 k 使得 k(k+1)(k+2)/6 <= n
  let lo = 1;
  let hi = Math.cbrt(6 * n) + 1;
  let k = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if ((mid * (mid + 1) * (mid + 2)) / 6 <= n) {
      k = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  const used = (k * (k + 1) * (k + 2)) / 6;
  if (used === n) return (k * (k + 1)) / 2;
  // 剩余
  let remaining = n - used;
  let ground = 0;
  let i = 1;
  while (remaining > 0) {
    remaining -= i;
    ground += i;
    i++;
  }
  return (k * (k + 1)) / 2 + ground;
}

// 方法3：二分查找地面数量
function minimumBoxesBinaryGround(n: number): number {
  // 完整金字塔
  let lo = 1;
  let hi = 2000000;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const pyramid = (mid * (mid + 1) * (mid + 2)) / 6;
    if (pyramid < n) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 放置盒子 =====");
console.log("数学 3:", minimumBoxes(3)); // 3
console.log("数学 4:", minimumBoxes(4)); // 3
console.log("数学 10:", minimumBoxes(10)); // 6
console.log("二分 4:", minimumBoxesBinary(4)); // 3

export {};
