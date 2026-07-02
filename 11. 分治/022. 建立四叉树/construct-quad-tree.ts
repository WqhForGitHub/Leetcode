// ============================================================
// 022. 建立四叉树
// ============================================================
// LeetCode 427. Construct Quad Tree
// 给定 n x n 的 0/1 网格（n 为 2 的幂），建立四叉树。
// 每个叶子节点代表区域全为相同值，否则递归分成四个子区域。
// 时间复杂度：O(n^2)，空间复杂度：O(log n)（递归栈）

// 四叉树节点定义
class Node {
  val: boolean;
  isLeaf: boolean;
  topLeft: Node | null;
  topRight: Node | null;
  bottomLeft: Node | null;
  bottomRight: Node | null;

  constructor(
    val: boolean,
    isLeaf: boolean,
    topLeft: Node | null = null,
    topRight: Node | null = null,
    bottomLeft: Node | null = null,
    bottomRight: Node | null = null,
  ) {
    this.val = val;
    this.isLeaf = isLeaf;
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
  }
}

// 方法1：分治递归（推荐）
// 思路：检查当前区域是否所有格子值相同。若相同则直接构造叶子节点；
//       否则按行列中点划分成四个象限，递归构造子节点，再组成内部节点。
function construct(grid: number[][]): Node | null {
  return build(0, 0, grid.length, grid);
}

function build(r: number, c: number, size: number, grid: number[][]): Node {
  // 检查区域内所有值是否相同
  if (isUniform(r, c, size, grid)) {
    return new Node(grid[r][c] === 1, true);
  }

  // 不是叶子节点，递归构造四个子节点
  const half = size >> 1;
  const node = new Node(true, false); // 内部节点 val 无意义，置 true
  node.topLeft = build(r, c, half, grid);
  node.topRight = build(r, c + half, half, grid);
  node.bottomLeft = build(r + half, c, half, grid);
  node.bottomRight = build(r + half, c + half, half, grid);
  return node;
}

function isUniform(r: number, c: number, size: number, grid: number[][]): boolean {
  const first = grid[r][c];
  for (let i = r; i < r + size; i++) {
    for (let j = c; j < c + size; j++) {
      if (grid[i][j] !== first) return false;
    }
  }
  return true;
}

// 方法2：分治 + 前缀和优化（O(n^2)）
// 思路：用二维前缀和快速判断区域是否全 0 或全 1，避免每次线性扫描。
//       区域和为 0 则全 0，为 size^2 则全 1，否则需分裂。
function constructPrefix(grid: number[][]): Node | null {
  const n = grid.length;
  // 前缀和，pre[i+1][j+1] = 区域 (0,0)-(i,j) 的和
  const pre: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pre[i + 1][j + 1] = pre[i][j + 1] + pre[i + 1][j] - pre[i][j] + grid[i][j];
    }
  }

  return buildPrefix(0, 0, n, grid, pre);
}

function buildPrefix(r: number, c: number, size: number, grid: number[][], pre: number[][]): Node {
  // 区域和
  const sum = pre[r + size][c + size] - pre[r][c + size] - pre[r + size][c] + pre[r][c];

  if (sum === 0) return new Node(false, true);
  if (sum === size * size) return new Node(true, true);

  const half = size >> 1;
  const node = new Node(true, false);
  node.topLeft = buildPrefix(r, c, half, grid, pre);
  node.topRight = buildPrefix(r, c + half, half, grid, pre);
  node.bottomLeft = buildPrefix(r + half, c, half, grid, pre);
  node.bottomRight = buildPrefix(r + half, c + half, half, grid, pre);
  return node;
}

// ============================================================
// 测试
// ============================================================
// 辅助：把四叉树序列化为 [(isLeaf, val)] 的层序数组（仅用于验证结构）
function serialize(root: Node | null): Array<[boolean, boolean]> {
  if (root === null) return [];
  const result: Array<[boolean, boolean]> = [];
  const queue: Array<Node | null> = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) continue;
    result.push([node.isLeaf, node.val]);
    if (!node.isLeaf) {
      queue.push(node.topLeft, node.topRight, node.bottomLeft, node.bottomRight);
    }
  }
  return result;
}

console.log("===== 022. 建立四叉树 =====");
const grid1 = [
  [0, 1],
  [1, 0],
];
console.log("分治 2x2:", JSON.stringify(serialize(construct(grid1))));
// 期望: [[false,true],[true,false],[true,true],[true,true],[false,true]]（内部节点 + 4 个叶子）

const grid2 = [
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
console.log("分治 8x8 顶层是否叶子:", construct(grid2)?.isLeaf); // 期望: false
console.log("前缀和 2x2:", JSON.stringify(serialize(constructPrefix(grid1))));
console.log("前缀和 8x8 顶层是否叶子:", constructPrefix(grid2)?.isLeaf); // 期望: false

export {};
