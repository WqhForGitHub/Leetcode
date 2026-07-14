// ============================================================
// 202. 可见点的最大数目
// ============================================================
// LeetCode 1610. Maximum Number of Visible Points
// 给定点集 points（部分点可能在原点 [0,0]）和视角角度 angle（度）。
// 你站在原点，可以旋转视角范围为 angle 度的视野。求最多能看到多少个点
// （位于原点的点始终可见）。返回最大数量。

// 方法1：极角排序 + 倍增数组滑动窗口（O(n log n)）
function visiblePoints(points: number[][], angle: number): number {
  // 统计位于原点的点数（始终可见）
  const originCount = points.filter((p) => p[0] === 0 && p[1] === 0).length;

  // 计算非原点点的极角（度数）
  const angles: number[] = [];
  for (const [x, y] of points) {
    if (x === 0 && y === 0) continue;
    angles.push((Math.atan2(y, x) * 180) / Math.PI);
  }

  angles.sort((a, b) => a - b);
  const n = angles.length;
  if (n === 0) return originCount;

  // 倍增数组处理环形：将每个角度 +360 追加到末尾
  const doubled = [...angles];
  for (let i = 0; i < n; i++) {
    doubled.push(angles[i] + 360);
  }

  // 滑动窗口求最大窗口内角度差 <= angle 的点数
  let max = 0;
  let left = 0;
  for (let right = 0; right < doubled.length; right++) {
    while (left < doubled.length && doubled[right] - doubled[left] > angle + 1e-9) {
      left++;
    }
    const windowSize = right - left + 1;
    if (windowSize > n) {
      left++;
    }
    max = Math.max(max, right - left + 1);
  }

  return max + originCount;
}

// 方法2：极角排序 + 循环双指针（O(n log n)）
// 对每个起点 i，用指针 j 尽可能向右扩展（循环），统计在 angle 范围内的点数
function visiblePoints2(points: number[][], angle: number): number {
  const originCount = points.filter((p) => p[0] === 0 && p[1] === 0).length;

  const angles: number[] = [];
  for (const [x, y] of points) {
    if (x === 0 && y === 0) continue;
    angles.push((Math.atan2(y, x) * 180) / Math.PI);
  }

  angles.sort((a, b) => a - b);
  const n = angles.length;
  if (n === 0) return originCount;

  let max = 0;
  let j = 0;
  // 循环双指针：i 为起点，j 为可到达的最远位置（可循环绕回）
  for (let i = 0; i < n; i++) {
    if (j < i) j = i;
    while (j < i + n) {
      let diff = angles[j % n] - angles[i];
      if (diff < 0) diff += 360;
      if (diff > angle + 1e-9) break;
      j++;
    }
    max = Math.max(max, j - i);
    if (max >= n) break;
  }

  return max + originCount;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 202. 可见点的最大数目 =====");
console.log(
  "方法1 [[2,1],[2,2],[3,3]] angle=90:",
  visiblePoints(
    [
      [2, 1],
      [2, 2],
      [3, 3],
    ],
    90,
  ),
);
console.log(
  "方法2 [[2,1],[2,2],[3,3]] angle=90:",
  visiblePoints2(
    [
      [2, 1],
      [2, 2],
      [3, 3],
    ],
    90,
  ),
);
console.log(
  "方法1 [[1,1],[1,2],[2,1]] angle=30:",
  visiblePoints(
    [
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    30,
  ),
);
console.log(
  "方法2 [[1,1],[1,2],[2,1]] angle=30:",
  visiblePoints2(
    [
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    30,
  ),
);
console.log(
  "方法1 [[0,0],[1,1],[1,2],[2,1]] angle=30:",
  visiblePoints(
    [
      [0, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    30,
  ),
);
console.log(
  "方法2 [[0,0],[1,1],[1,2],[2,1]] angle=30:",
  visiblePoints2(
    [
      [0, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    30,
  ),
);

export {};
