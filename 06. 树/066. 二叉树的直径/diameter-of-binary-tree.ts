// ============================================================
// 066. 二叉树的直径
// ============================================================
// LeetCode 543. Diameter of Binary Tree
// 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是
// 任意两个结点路径长度中的最大值（路径长度为路径上边的数量）。
// 时间复杂度：O(n)，空间复杂度：O(h)

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

// 方法1：DFS后序递归（推荐）
// 对每个节点计算左右子树高度之和（经过该节点的路径长度），取最大值
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = 0;
  // 返回以 node 为根的树的高度（节点数-1 即边数）
  function height(node: TreeNode | null): number {
    if (node === null) return 0;
    const leftH = height(node.left);
    const rightH = height(node.right);
    // 经过当前节点的最长路径长度 = 左高度 + 右高度
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH);
  }
  height(root);
  return maxDiameter;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 二叉树的直径 =====");
// 树:
//        1
//       / \
//      2   3
//     / \
//    4   5
// 直径为 3 (路径 4-2-1-3 或 5-2-1-3)
const tree1 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
console.log("[1,2,3,4,5]:", diameterOfBinaryTree(tree1)); // 3

// 树:
//        1
//       /
//      2
//     /
//    3
// 直径为 2 (路径 3-2-1)
const tree2 = new TreeNode(1, new TreeNode(2, new TreeNode(3), null), null);
console.log("[1,2,null,3]:", diameterOfBinaryTree(tree2)); // 2

// 树:
//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
//   /       /
//  7       8
// 直径为 5 (路径 7-4-2-1-3-6-8? 实际是 7-4-2-1-3-6-8 = 6条边)
const tree3 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4, new TreeNode(7), null), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6, new TreeNode(8), null)),
);
console.log("复杂树:", diameterOfBinaryTree(tree3)); // 6

// 单节点
const single = new TreeNode(1);
console.log("单节点:", diameterOfBinaryTree(single)); // 0

export {};
