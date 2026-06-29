// ============================================================
// 051. 建立四叉树
// ============================================================
// LeetCode 427. Construct Quad Tree
// 给你一个 n * n 矩阵 grid，其中每个单元格的值不是 0 就是 1。
// 构建一个四叉树。如果当前网格所有值相同则为叶子节点，
// 否则将其分成四个子网格递归构建。
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)

// 四叉树节点定义
class QuadNode {
  val: boolean;
  isLeaf: boolean;
  topLeft: QuadNode | null;
  topRight: QuadNode | null;
  bottomLeft: QuadNode | null;
  bottomRight: QuadNode | null;
  constructor(
    val: boolean,
    isLeaf: boolean,
    topLeft?: QuadNode | null,
    topRight?: QuadNode | null,
    bottomLeft?: QuadNode | null,
    bottomRight?: QuadNode | null
  ) {
    this.val = val;
    this.isLeaf = isLeaf;
    this.topLeft = topLeft ?? null;
    this.topRight = topRight ?? null;
    this.bottomLeft = bottomLeft ?? null;
    this.bottomRight = bottomRight ?? null;
  }
}

// 方法1：递归分治（推荐）
// 检查当前区域是否所有值相同，若相同则创建叶子节点
// 否则递归处理四个子区域
function construct(grid: number[][]): QuadNode | null {
  function build(
    row: number,
    col: number,
    size: number
  ): QuadNode {
    // 检查当前区域是否所有值相同
    let allSame = true;
    const first = grid[row][col];
    for (let i = row; i < row + size; i++) {
      for (let j = col; j < col + size; j++) {
        if (grid[i][j] !== first) {
          allSame = false;
          break;
        }
      }
      if (!allSame) break;
    }

    if (allSame) {
      // 叶子节点
      return new QuadNode(first === 1, true);
    }

    // 内部节点，递归构建四个子节点
    const half = size / 2;
    const topLeft = build(row, col, half);
    const topRight = build(row, col + half, half);
    const bottomLeft = build(row + half, col, half);
    const bottomRight = build(row + half, col + half, half);
    // 内部节点 val 可任意，这里用 true
    return new QuadNode(true, false, topLeft, topRight, bottomLeft, bottomRight);
  }

  if (grid.length === 0) return null;
  return build(0, 0, grid.length);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 建立四叉树 =====");
// 测试1: 全为0的2x2网格
const grid1 = [[0, 0], [0, 0]];
const quad1 = construct(grid1);
console.log("全0网格 isLeaf:", quad1?.isLeaf, "val:", quad1?.val); // 期望 true, false

// 测试2: 全为1的2x2网格
const grid2 = [[1, 1], [1, 1]];
const quad2 = construct(grid2);
console.log("全1网格 isLeaf:", quad2?.isLeaf, "val:", quad2?.val); // 期望 true, true

// 测试3: 混合的2x2网格
const grid3 = [[1, 1], [0, 0]];
const quad3 = construct(grid3);
console.log("混合网格 isLeaf:", quad3?.isLeaf); // 期望 false
console.log("  topLeft isLeaf:", quad3?.topLeft?.isLeaf, "val:", quad3?.topLeft?.val); // true, true
console.log("  bottomLeft isLeaf:", quad3?.bottomLeft?.isLeaf, "val:", quad3?.bottomLeft?.val); // true, false

// 测试4: [[0,1],[1,0]]
const grid4 = [[0, 1], [1, 0]];
const quad4 = construct(grid4);
console.log("对角网格 isLeaf:", quad4?.isLeaf); // 期望 false

export {};
