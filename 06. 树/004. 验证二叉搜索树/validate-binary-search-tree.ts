// ============================================================
// 004. 验证二叉搜索树
// ============================================================
// LeetCode 98. Validate Binary Search Tree
// 给你一个二叉树的根节点 root，判断其是否是一个有效的二叉搜索树。
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

// 方法1：递归带范围（推荐）
// 节点值必须在 (min, max) 范围内
function isValidBST(root: TreeNode | null): boolean {
  return isValidBSTHelper(root, -Infinity, Infinity);
}

function isValidBSTHelper(
  node: TreeNode | null,
  min: number,
  max: number
): boolean {
  if (node === null) return true;
  if (node.val <= min || node.val >= max) return false;
  // 左子树所有值必须 < node.val，右子树所有值必须 > node.val
  return (
    isValidBSTHelper(node.left, min, node.val) &&
    isValidBSTHelper(node.right, node.val, max)
  );
}

// 方法2：中序遍历
// BST 的中序遍历是严格递增序列
function isValidBSTInorder(root: TreeNode | null): boolean {
  let prev: number | null = null;
  let valid = true;

  function inorder(node: TreeNode | null): void {
    if (node === null || !valid) return;
    inorder(node.left);
    if (prev !== null && node.val <= prev) {
      valid = false;
      return;
    }
    prev = node.val;
    inorder(node.right);
  }

  inorder(root);
  return valid;
}

// 方法3：迭代中序遍历
// 使用栈模拟中序遍历
function isValidBSTIterative(root: TreeNode | null): boolean {
  const stack: TreeNode[] = [];
  let prev: number | null = null;
  let curr: TreeNode | null = root;

  while (curr !== null || stack.length > 0) {
    // 走到最左
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    // 检查中序序列是否递增
    if (prev !== null && curr.val <= prev) {
      return false;
    }
    prev = curr.val;
    curr = curr.right;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 验证二叉搜索树 =====");
// 测试1: [2,1,3] -> true
const tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log("[2,1,3] (递归范围):", isValidBST(tree1)); // true
console.log("[2,1,3] (中序):", isValidBSTInorder(tree1)); // true
console.log("[2,1,3] (迭代):", isValidBSTIterative(tree1)); // true

// 测试2: [5,1,4,null,null,3,6] -> false
const tree2 = new TreeNode(
  5,
  new TreeNode(1),
  new TreeNode(4, new TreeNode(3), new TreeNode(6))
);
console.log("[5,1,4,null,null,3,6] (递归范围):", isValidBST(tree2)); // false
console.log("[5,1,4,null,null,3,6] (中序):", isValidBSTInorder(tree2)); // false
console.log("[5,1,4,null,null,3,6] (迭代):", isValidBSTIterative(tree2)); // false

// 测试3: [1,1] -> false
const tree3 = new TreeNode(1, new TreeNode(1));
console.log("[1,1] (递归范围):", isValidBST(tree3)); // false

export {};
