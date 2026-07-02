// ============================================================
// 032. 矩形内船只的数目
// ============================================================
// LeetCode 1274. Number of Ships in a Rectangle
// 在海面上有一个矩形区域，每艘船位于一个整数坐标点上。
// 给定矩形右上角和左下角坐标，统计该矩形内的船只数量。
// 可以调用 hasShips(topRight, bottomLeft) 判断某矩形区域内是否有船。
// 时间复杂度：O(S log W), 空间复杂度：O(log W)
// 其中 S 为船只数量，W = max(width, height)

// 海接口定义（交互式问题）
interface Sea {
  hasShips(topRight: number[], bottomLeft: number[]): boolean;
}

// 方法1：分治 - 将矩形划分为 4 个象限（推荐）
// 递归划分矩形为 4 个子象限，跳过空矩形，递归直到单点
// 时间复杂度 O(S log W)，空间复杂度 O(log W)
function countShips(sea: Sea, topRight: number[], bottomLeft: number[]): number {
  // 边界：矩形无效或该区域无船
  if (bottomLeft[0] > topRight[0] || bottomLeft[1] > topRight[1]) {
    return 0;
  }
  if (!sea.hasShips(topRight, bottomLeft)) {
    return 0;
  }

  // 单点区域：hasShips 为 true 即代表恰好一艘船
  if (bottomLeft[0] === topRight[0] && bottomLeft[1] === topRight[1]) {
    return 1;
  }

  // 分治：以中点划分 4 个象限
  const midX: number = bottomLeft[0] + Math.floor((topRight[0] - bottomLeft[0]) / 2);
  const midY: number = bottomLeft[1] + Math.floor((topRight[1] - bottomLeft[1]) / 2);

  // 左下象限
  const q1: number = countShips(sea, [midX, midY], bottomLeft);
  // 右下象限
  const q2: number = countShips(sea, [topRight[0], midY], [midX + 1, bottomLeft[1]]);
  // 左上象限
  const q3: number = countShips(sea, [midX, topRight[1]], [bottomLeft[0], midY + 1]);
  // 右上象限
  const q4: number = countShips(sea, topRight, [midX + 1, midY + 1]);

  return q1 + q2 + q3 + q4;
}

// 方法2：分治 - 划分为 2 个子区域（左右或上下）
// 每次仅沿一个方向二分，递归到单点
// 时间复杂度 O(S log W)，空间复杂度 O(log W)
function countShipsBinary(sea: Sea, topRight: number[], bottomLeft: number[]): number {
  function count(tr: number[], bl: number[], axis: number): number {
    if (bl[0] > tr[0] || bl[1] > tr[1]) return 0;
    if (!sea.hasShips(tr, bl)) return 0;
    if (bl[0] === tr[0] && bl[1] === tr[1]) return 1;

    // 优先沿较长边划分，axis=0 沿 x 划分，axis=1 沿 y 划分
    const width: number = tr[0] - bl[0];
    const height: number = tr[1] - bl[1];
    if (width >= height) {
      const midX: number = bl[0] + Math.floor(width / 2);
      const left: number = count([midX, tr[1]], bl, 1);
      const right: number = count(tr, [midX + 1, bl[1]], 1);
      return left + right;
    } else {
      const midY: number = bl[1] + Math.floor(height / 2);
      const down: number = count([tr[0], midY], bl, 0);
      const up: number = count(tr, [bl[0], midY + 1], 0);
      return down + up;
    }
  }

  return count(topRight, bottomLeft, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 矩形内船只的数目 =====");

// 模拟 Sea：在 points 中维护船只坐标集合
class SeaImpl implements Sea {
  private ships: Set<string>;
  constructor(ships: number[][]) {
    this.ships = new Set<string>(ships.map((p: number[]) => `${p[0]},${p[1]}`));
  }
  hasShips(topRight: number[], bottomLeft: number[]): boolean {
    for (let x: number = bottomLeft[0]; x <= topRight[0]; x++) {
      for (let y: number = bottomLeft[1]; y <= topRight[1]; y++) {
        if (this.ships.has(`${x},${y}`)) return true;
      }
    }
    return false;
  }
}

const sea1: Sea = new SeaImpl([
  [1, 1],
  [2, 2],
  [3, 3],
  [5, 6],
]);
console.log(countShips(sea1, [4, 4], [0, 0])); // 期望结果: 3 ([1,1],[2,2],[3,3])

const sea2: Sea = new SeaImpl([
  [1, 1],
  [2, 2],
  [3, 3],
  [5, 6],
]);
console.log(countShips(sea2, [10, 10], [0, 0])); // 期望结果: 4

const sea3: Sea = new SeaImpl([
  [1, 1],
  [2, 2],
  [3, 3],
  [5, 6],
]);
console.log(countShips(sea3, [5, 6], [5, 6])); // 期望结果: 1

console.log("--- 方法2测试 ---");
const sea4: Sea = new SeaImpl([
  [1, 1],
  [2, 2],
  [3, 3],
  [5, 6],
]);
console.log(countShipsBinary(sea4, [4, 4], [0, 0])); // 期望结果: 3
const sea5: Sea = new SeaImpl([
  [1, 1],
  [2, 2],
  [3, 3],
  [5, 6],
]);
console.log(countShipsBinary(sea5, [10, 10], [0, 0])); // 期望结果: 4

export {};
