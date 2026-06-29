// ============================================================
// 051. 二叉树的垂直遍历
// ============================================================
// LeetCode 314. Binary Tree Vertical Order Traversal
// 给定二叉树，返回其节点的垂直遍历（按列从左到右，同列从上到下）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 二叉树节点定义
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// BFS + 哈希表按列分组
// 使用 BFS 保证同列节点从上到下的顺序，用哈希表记录每列的节点列表
function verticalOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  // 哈希表：列号 -> 该列的节点值列表
  const columnMap = new Map<number, number[]>();
  // 队列存储 [节点, 列号]
  const queue: [TreeNode, number][] = [[root, 0]];
  let minCol = 0;
  let maxCol = 0;

  while (queue.length > 0) {
    const [node, col] = queue.shift()!;
    // 将节点值加入对应列
    if (!columnMap.has(col)) {
      columnMap.set(col, []);
    }
    columnMap.get(col)!.push(node.val);

    // 更新列范围
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);

    // 左子节点列号 -1，右子节点列号 +1
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }

  // 按列号从小到大输出结果
  const result: number[][] = [];
  for (let col = minCol; col <= maxCol; col++) {
    if (columnMap.has(col)) {
      result.push(columnMap.get(col)!);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 二叉树的垂直遍历 =====");

// 测试 1: [3,9,20,null,null,15,7]
//     3
//    / \
//   9  20
//      / \
//     15  7
const tree1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(verticalOrder(tree1)); // 期望: [[9],[3,15],[20],[7]]

// 测试 2: [1,2,3,4,5,6,7]
//         1
//        / \
//       2   3
//      / \ / \
//     4  5 6  7
const tree2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, new TreeNode(6), new TreeNode(7)),
);
console.log(verticalOrder(tree2)); // 期望: [[4],[2],[1,5,6],[3],[7]]

// 测试 3: 空树
console.log(verticalOrder(null)); // 期望: []

export {};
