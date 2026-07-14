// ============================================================
// 016. 平衡二叉树
// ============================================================
// LeetCode 110. Balanced Binary Tree
// 给定一个二叉树，判断它是否是高度平衡的。
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

// 方法1：自顶向下递归（不推荐，存在重复计算）
function isBalanced(root: TreeNode | null): boolean {
  function height(node: TreeNode | null): number {
    if (node === null) return 0;
    return Math.max(height(node.left), height(node.right)) + 1;
  }
  if (root === null) return true;
  const leftHeight = height(root.left);
  const rightHeight = height(root.right);
  if (Math.abs(leftHeight - rightHeight) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
}

// 方法2：自底向上递归（推荐，O(n) 一次遍历）
function isBalancedBottomUp(root: TreeNode | null): boolean {
  // 返回节点高度；若不平衡返回 -1
  function check(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = check(node.left);
    if (left === -1) return -1;
    const right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  }
  return check(root) !== -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 平衡二叉树 =====");
// 构造平衡树: [3,9,20,null,null,15,7]
const balancedTree = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)),
);
console.log("自顶向下 [3,9,20,null,null,15,7]:", isBalanced(balancedTree)); // true
console.log("自底向上 [3,9,20,null,null,15,7]:", isBalancedBottomUp(balancedTree)); // true

// 构造不平衡树: [1,2,2,3,3,null,null,4,4]
const unbalancedTree = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(3, new TreeNode(4), new TreeNode(4)), new TreeNode(3)),
  new TreeNode(2),
);
console.log("自顶向下 [1,2,2,3,3,null,null,4,4]:", isBalanced(unbalancedTree)); // false
console.log("自底向上 [1,2,2,3,3,null,null,4,4]:", isBalancedBottomUp(unbalancedTree)); // false

// 空树
console.log("空树:", isBalanced(null)); // true
console.log("空树:", isBalancedBottomUp(null)); // true

export {};
