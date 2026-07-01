// ============================================================
// 123. 两球之间的磁力
// ============================================================
// LeetCode 1552. Magnetic Force Between Two Balls
// 球放在位置数组中，放 m 个球使最小间距最大化。

// 方法1：二分查找
function maxDistance(position: number[], m: number): number {
  position.sort((a, b) => a - b);
  let left = 1;
  let right = position[position.length - 1] - position[0];
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (canPlace(position, m, mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

function canPlace(position: number[], m: number, minDist: number): boolean {
  let count = 1;
  let lastPos = position[0];
  for (let i = 1; i < position.length; i++) {
    if (position[i] - lastPos >= minDist) {
      count++;
      lastPos = position[i];
      if (count >= m) return true;
    }
  }
  return count >= m;
}

// 方法2：二分查找（左闭右闭写法）
function maxDistanceAlt(position: number[], m: number): number {
  position.sort((a, b) => a - b);
  let lo = 0;
  let hi = position[position.length - 1];
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    let balls = 1;
    let prev = position[0];
    for (let i = 1; i < position.length; i++) {
      if (position[i] - prev >= mid) {
        balls++;
        prev = position[i];
      }
    }
    if (balls >= m) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 两球之间的磁力 =====");
console.log("二分 [1,2,3,4,7],3:", maxDistance([1, 2, 3, 4, 7], 3)); // 3
console.log("二分 [5,4,3,2,1,1000000000],2:", maxDistance([5, 4, 3, 2, 1, 1000000000], 2)); // 999999999
console.log("变体 [1,2,8,4,9],3:", maxDistanceAlt([1, 2, 8, 4, 9], 3)); // 3

export {};
