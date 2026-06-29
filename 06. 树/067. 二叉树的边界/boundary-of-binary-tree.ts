// ============================================================
// 067. 二叉树的边界
// ============================================================
// LeetCode 545. Boundary of Binary Tree
// 给定一棵二叉树，以逆时针顺序返回其边界（左边界、叶子节点、右边界逆序）。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：DFS分三部分收集（推荐）
// 1. 左边界：从根的左孩子开始，一直走左，没有左则走右
// 2. 叶子节点：DFS收集所有叶子
// 3. 右边界：从根的右孩子开始，一直走右，没有右则走左，最后逆序
function boundaryOfBinaryTree(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [root.val];
  // 左边界（不含根）
  if (root.left !== null) {
    let node: TreeNode | null = root.left;
    while (node !== null && (node.left !== null || node.right !== null)) {
      result.push(node.val);
      if (node.left !== null) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
  }
  // 叶子节点（根单独处理，避免根为叶子时重复加入）
  function addLeaves(node: TreeNode | null): void {
    if (node === null) return;
    if (node.left === null && node.right === null) {
      result.push(node.val);
      return;
    }
    addLeaves(node.left);
    addLeaves(node.right);
  }
  addLeaves(root.left);
  addLeaves(root.right);
  // 右边界（不含根，逆序）
  const rightBoundary: number[] = [];
  if (root.right !== null) {
    let node: TreeNode | null = root.right;
    while (node !== null && (node.left !== null || node.right !== null)) {
      rightBoundary.push(node.val);
      if (node.right !== null) {
        node = node.right;
      } else {
        node = node.left;
      }
    }
  }
  for (let i = rightBoundary.length - 1; i >= 0; i--) {
    result.push(rightBoundary[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 二叉树的边界 =====");
// 树:
//          1
//           \
//            2
//           / \
//          3   4
//         /
//        5
// 边界: [1, 3, 5, 4] (左侧无, 叶子5, 右边界2,4倒序)
const tree1 = new TreeNode(
  1,
  null,
  new TreeNode(2, new TreeNode(3, new TreeNode(5), null), new TreeNode(4))
);
console.log("树1:", boundaryOfBinaryTree(tree1)); // [1, 3, 5, 4]

// 树:
//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
//       / \
//      7   8
// 边界: [1,2,4,7,8,6,3]
const tree2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5, new TreeNode(7), new TreeNode(8))),
  new TreeNode(3, null, new TreeNode(6))
);
console.log("树2:", boundaryOfBinaryTree(tree2)); // [1,2,4,7,8,6,3]

// 单节点
const single = new TreeNode(1);
console.log("单节点:", boundaryOfBinaryTree(single)); // [1]

// 只有左孩子
const tree3 = new TreeNode(1, new TreeNode(2, new TreeNode(3), null), null);
console.log("只有左:", boundaryOfBinaryTree(tree3)); // [1,2,3]

export {};
