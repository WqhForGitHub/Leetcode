// ============================================================
// 028. 二叉树的垂直遍历
// ============================================================
// LeetCode 314. Binary Tree Vertical Order Traversal
// 给定二叉树，按列号从左到右返回垂直遍历结果；同列内自顶向下、同层从左到右。

// 二叉树节点定义
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val?: number,
    left?: TreeNode | null,
    right?: TreeNode | null
  ) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：BFS + 列号追踪（推荐，O(n) 时间，O(n) 空间）
// BFS 天然保证自顶向下、同层从左到右；用哈希表按列号收集节点值。
function verticalOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const columnMap = new Map<number, number[]>();
  // 队列元素：[节点, 列号]
  const queue: Array<[TreeNode, number]> = [[root, 0]];
  let minCol = 0;
  let maxCol = 0;

  while (queue.length > 0) {
    const [node, col] = queue.shift()!;
    if (!columnMap.has(col)) {
      columnMap.set(col, []);
    }
    columnMap.get(col)!.push(node.val);

    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);

    if (node.left !== null) queue.push([node.left, col - 1]);
    if (node.right !== null) queue.push([node.right, col + 1]);
  }

  const result: number[][] = [];
  for (let c = minCol; c <= maxCol; c++) {
    const col = columnMap.get(c);
    if (col) result.push(col);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 二叉树的垂直遍历 =====");

// 构造树：
//       3
//      / \
//     9   20
//        /  \
//       15   7
const root1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("BFS 列遍历:", verticalOrder(root1)); // 期望 [[9],[3,15],[20],[7]]

// 构造树：
//       1
//      / \
//     2   3
//    / \  /
//   4   5 6
const root2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, new TreeNode(6), null)
);
console.log("BFS 列遍历:", verticalOrder(root2)); // 期望 [[4],[2],[1,5,6],[3]]

export {};
