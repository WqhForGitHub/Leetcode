// ============================================================
// 030. 完全二叉树的节点个数
// ============================================================
// LeetCode 222. Count Complete Tree Nodes
// 给你一棵完全二叉树的根节点 root，求出该树的节点个数。
// 时间复杂度：O(n)（方法1）/ O(log^2 n)（方法2）

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

// 方法1：递归遍历 O(n)（简单直接）
function countNodes(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

// 方法2：利用完全二叉树性质二分 O(log^2 n)（推荐）
// 完全二叉树中，要么左右子树深度相同（左子树为满），要么右子树深度少 1
function countNodesOptimized(root: TreeNode | null): number {
  if (root === null) return 0;
  // 计算从某节点开始向左走到底的深度（左子树高度）
  function leftDepth(node: TreeNode | null): number {
    let depth = 0;
    while (node !== null) {
      depth++;
      node = node.left;
    }
    return depth;
  }
  // 计算从某节点开始向右走到底的深度（右子树高度）
  function rightDepth(node: TreeNode | null): number {
    let depth = 0;
    while (node !== null) {
      depth++;
      node = node.right;
    }
    return depth;
  }

  const ld = leftDepth(root);
  const rd = rightDepth(root);
  // 如果左右深度相同，说明是满二叉树，节点数为 2^h - 1
  if (ld === rd) {
    return (1 << ld) - 1;
  }
  // 否则递归计算左右子树
  return 1 + countNodesOptimized(root.left) + countNodesOptimized(root.right);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 完全二叉树的节点个数 =====");
// 完全二叉树: [1,2,3,4,5,6]
//        1
//       / \
//      2   3
//     / \ /
//    4  5 6
function buildTree030(): TreeNode {
  return new TreeNode(
    1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3, new TreeNode(6), null)
  );
}
console.log("递归 [1,2,3,4,5,6]:", countNodes(buildTree030())); // 6
console.log("二分 [1,2,3,4,5,6]:", countNodesOptimized(buildTree030())); // 6

// 满二叉树: [1,2,3,4,5,6,7]
function buildFullTree(): TreeNode {
  return new TreeNode(
    1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3, new TreeNode(6), new TreeNode(7))
  );
}
console.log("递归 满二叉树:", countNodes(buildFullTree())); // 7
console.log("二分 满二叉树:", countNodesOptimized(buildFullTree())); // 7

// 单节点
const single030 = new TreeNode(1);
console.log("递归 单节点:", countNodes(single030)); // 1
console.log("二分 单节点:", countNodesOptimized(single030)); // 1

// 空树
console.log("递归 空树:", countNodes(null)); // 0
console.log("二分 空树:", countNodesOptimized(null)); // 0

export {};
