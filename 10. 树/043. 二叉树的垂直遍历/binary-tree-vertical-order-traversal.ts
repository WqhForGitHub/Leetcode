// ============================================================
// 043. 二叉树的垂直遍历
// ============================================================
// LeetCode 314. Binary Tree Vertical Order Traversal
// 给定一个二叉树，返回其节点的垂直遍历（按列从左到右，同列同层从上到下）。
// 时间复杂度：O(n log n) 或 O(n)，空间复杂度：O(n)

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

// 方法1：BFS + 列号（推荐）
// BFS 保证同列内从上到下的顺序；用 map 按列号收集节点值，最后按列号升序输出。
function verticalOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const columnMap = new Map<number, number[]>();
  const queue: { node: TreeNode; col: number }[] = [{ node: root, col: 0 }];
  let minCol = 0;
  let maxCol = 0;
  while (queue.length > 0) {
    const { node, col } = queue.shift()!;
    if (!columnMap.has(col)) columnMap.set(col, []);
    columnMap.get(col)!.push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left !== null) queue.push({ node: node.left, col: col - 1 });
    if (node.right !== null) queue.push({ node: node.right, col: col + 1 });
  }
  const result: number[][] = [];
  for (let c = minCol; c <= maxCol; c++) {
    if (columnMap.has(c)) result.push(columnMap.get(c)!);
  }
  return result;
}

// 方法2：DFS + 排序
// DFS 时记录 (col, row, val)，最后按 col 升序、row 升序排序后分组。
function verticalOrderDFS(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const nodes: { col: number; row: number; val: number }[] = [];
  function dfs(node: TreeNode | null, col: number, row: number): void {
    if (node === null) return;
    nodes.push({ col, row, val: node.val });
    dfs(node.left, col - 1, row + 1);
    dfs(node.right, col + 1, row + 1);
  }
  dfs(root, 0, 0);
  nodes.sort((a, b) => a.col - b.col || a.row - b.row);
  const result: number[][] = [];
  let curCol: number | null = null;
  let curList: number[] = [];
  for (const n of nodes) {
    if (curCol !== n.col) {
      if (curList.length > 0) result.push(curList);
      curList = [n.val];
      curCol = n.col;
    } else {
      curList.push(n.val);
    }
  }
  if (curList.length > 0) result.push(curList);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 二叉树的垂直遍历 =====");
// 构造树: [3,9,20,null,null,15,7]
const tree43 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)),
);
console.log("BFS:", verticalOrder(tree43)); // 期望 [[9],[3,15],[20],[7]]
console.log("DFS:", verticalOrderDFS(tree43)); // 期望 [[9],[3,15],[20],[7]]

// 构造树: [3,9,8,4,0,1,7]
const tree43b = new TreeNode(
  3,
  new TreeNode(9, new TreeNode(4), new TreeNode(0)),
  new TreeNode(8, new TreeNode(1), new TreeNode(7)),
);
console.log("BFS:", verticalOrder(tree43b)); // 期望 [[4],[9],[3,0,1],[8],[7]]
console.log("DFS:", verticalOrderDFS(tree43b)); // 期望 [[4],[9],[3,0,1],[8],[7]]

console.log("空树:", verticalOrder(null)); // 期望 []

export {};
