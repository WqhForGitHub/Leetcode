// ============================================================
// 113. 二叉树的垂序遍历
// ============================================================
// LeetCode 987. Vertical Order Traversal of a Binary Tree
// 给你二叉树的根结点 root，返回结点值垂序遍历的序列。
// 同列按行从小到大，同行按值从小到大排列。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

interface NodeInfo {
  row: number;
  col: number;
  val: number;
}

// 方法1：DFS+排序（推荐）
// 先 DFS 收集每个节点的 (row, col, val)
// 按 col 升序、row 升序、val 升序排序
// 按 col 分组输出
function verticalTraversal(root: TreeNode | null): number[][] {
  const nodes: NodeInfo[] = [];
  dfs(root, 0, 0, nodes);

  // 排序：列升序，行升序，值升序
  nodes.sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    if (a.row !== b.row) return a.row - b.row;
    return a.val - b.val;
  });

  const result: number[][] = [];
  let currentCol: number | null = null;
  let currentGroup: number[] = [];

  for (const node of nodes) {
    if (currentCol === null || node.col !== currentCol) {
      if (currentGroup.length > 0) result.push(currentGroup);
      currentGroup = [node.val];
      currentCol = node.col;
    } else {
      currentGroup.push(node.val);
    }
  }
  if (currentGroup.length > 0) result.push(currentGroup);

  return result;
}

function dfs(node: TreeNode | null, row: number, col: number, nodes: NodeInfo[]): void {
  if (node === null) return;
  nodes.push({ row, col, val: node.val });
  dfs(node.left, row + 1, col - 1, nodes);
  dfs(node.right, row + 1, col + 1, nodes);
}

// 方法2：BFS+排序
// 使用 BFS 层序遍历收集节点信息，再排序
function verticalTraversalBFS(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const nodes: NodeInfo[] = [];
  const queue: { node: TreeNode; row: number; col: number }[] = [
    { node: root, row: 0, col: 0 },
  ];

  while (queue.length > 0) {
    const { node, row, col } = queue.shift()!;
    nodes.push({ row, col, val: node.val });
    if (node.left !== null) queue.push({ node: node.left, row: row + 1, col: col - 1 });
    if (node.right !== null) queue.push({ node: node.right, row: row + 1, col: col + 1 });
  }

  nodes.sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    if (a.row !== b.row) return a.row - b.row;
    return a.val - b.val;
  });

  const result: number[][] = [];
  let currentCol: number | null = null;
  let currentGroup: number[] = [];

  for (const node of nodes) {
    if (currentCol === null || node.col !== currentCol) {
      if (currentGroup.length > 0) result.push(currentGroup);
      currentGroup = [node.val];
      currentCol = node.col;
    } else {
      currentGroup.push(node.val);
    }
  }
  if (currentGroup.length > 0) result.push(currentGroup);

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 二叉树的垂序遍历 =====");

// 辅助函数：从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 测试1: root = [3,9,20,null,null,15,7]
//       3
//      / \
//     9  20
//        / \
//       15  7
// 列 -2: 9
// 列 -1: 15
// 列  0: 3
// 列  1: 20
// 列  2: 7
const tree1 = buildTree([3, 9, 20, null, null, 15, 7]);
console.log("测试1 DFS:", verticalTraversal(tree1)); // 期望 [[9],[15],[3],[20],[7]]
const tree1b = buildTree([3, 9, 20, null, null, 15, 7]);
console.log("测试1 BFS:", verticalTraversalBFS(tree1b)); // 期望 [[9],[15],[3],[20],[7]]

// 测试2: root = [1,2,3,4,5,6,7]
//        1
//      /   \
//     2     3
//    / \   / \
//   4  5  6  7
// 列 -2: 4
// 列 -1: 2
// 列  0: 1,5,6
// 列  1: 3
// 列  2: 7
const tree2 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("测试2 DFS:", verticalTraversal(tree2)); // 期望 [[4],[2],[1,5,6],[3],[7]]

// 测试3: 单节点
const tree3 = buildTree([1]);
console.log("测试3 DFS:", verticalTraversal(tree3)); // 期望 [[1]]

// 测试4: 同位置多节点需按值排序
// root = [0,5,1,9,null,2,null,null,null,null,3,4,8,6,null,null,null,7]
// 复杂测试，主要验证同位置按值排序
const tree4 = buildTree([3, 1, 4, 0, 2, 2]);
console.log("测试4 DFS:", verticalTraversal(tree4));

export {};
