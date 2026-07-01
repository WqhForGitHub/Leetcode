// ============================================================
// 046. 用最少数量的箭引爆气球
// ============================================================
// LeetCode 452. Minimum Number of Arrows to Burst Balloons
// 气球用水平直径区间表示，一支箭可引爆所有与其相交的气球。
// 求引爆所有气球所需最少箭数。

// 方法1：按右端点排序贪心（推荐，O(n log n) 时间，O(log n) 空间）
// 按右端点升序排序，从左到右遍历，每当当前气球的左端点超过当前箭位置时，
// 需要一支新箭，并把箭放在当前气球的右端点（尽可能覆盖更多右侧气球）。
function findMinArrowShots(points: number[][]): number {
  const n = points.length;
  if (n === 0) return 0;

  // 按右端点升序排序
  points.sort((a, b) => a[1] - b[1]);

  let arrows = 1;
  let arrowPos = points[0][1]; // 当前箭的位置（最右可覆盖位置）

  for (let i = 1; i < n; i++) {
    // 当前气球左端点 > 箭位置，说明无法被现有箭覆盖，需要新箭
    if (points[i][0] > arrowPos) {
      arrows++;
      arrowPos = points[i][1];
    }
    // 否则当前气球可被现有箭引爆
  }

  return arrows;
}

// 方法2：按左端点排序贪心（O(n log n) 时间，O(log n) 空间）
// 按左端点升序排序，维护当前一箭能覆盖的右边界（所有重叠气球右边界的最小值）。
// 当下一个气球左端点超过该右边界时，需要新箭。
function findMinArrowShots_byStart(points: number[][]): number {
  const n = points.length;
  if (n === 0) return 0;

  // 按左端点升序排序
  points.sort((a, b) => a[0] - b[0]);

  let arrows = 1;
  let rightBound = points[0][1]; // 当前一箭覆盖区域的最小右边界

  for (let i = 1; i < n; i++) {
    if (points[i][0] > rightBound) {
      // 不重叠，需要新箭
      arrows++;
      rightBound = points[i][1];
    } else {
      // 重叠，缩小右边界为所有重叠气球右端点的最小值
      rightBound = Math.min(rightBound, points[i][1]);
    }
  }

  return arrows;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 用最少数量的箭引爆气球 =====");
console.log("按右端点 [[10,16],[2,8],[1,6],[7,12]]:", findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]])); // 期望: 2
console.log("按右端点 [[1,2],[3,4],[5,6],[7,8]]:", findMinArrowShots([[1, 2], [3, 4], [5, 6], [7, 8]])); // 期望: 4
console.log("按右端点 [[1,2],[2,3],[3,4],[4,5]]:", findMinArrowShots([[1, 2], [2, 3], [3, 4], [4, 5]])); // 期望: 2

console.log("按左端点 [[10,16],[2,8],[1,6],[7,12]]:", findMinArrowShots_byStart([[10, 16], [2, 8], [1, 6], [7, 12]])); // 期望: 2
console.log("按左端点 [[1,2],[3,4],[5,6],[7,8]]:", findMinArrowShots_byStart([[1, 2], [3, 4], [5, 6], [7, 8]])); // 期望: 4
console.log("按左端点 [[1,2],[2,3],[3,4],[4,5]]:", findMinArrowShots_byStart([[1, 2], [2, 3], [3, 4], [4, 5]])); // 期望: 2

export {};
