// ============================================================
// 011. 二叉树的后序遍历
// ============================================================
// LeetCode 145. Binary Tree Postorder Traversal
// 给你一棵二叉树的根节点 root，返回它节点值的后序遍历。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ------------------------------------------------------------
// 方法1：迭代栈（后序遍历，双栈/反转法）
// ------------------------------------------------------------
// 后序：左->右->根。先序变体「根->右->左」结果反转即得后序。
// 入栈顺序：先左后右（弹出先右后左），最后反转结果。
// 时间 O(n)，空间 O(n)。
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  result.reverse();
  return result;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function postorderTraversalRecursive(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
  console.log('测试1 - 迭代:', postorderTraversal(root), '期望: [3,2,1]');
  console.log('测试2 - 递归:', postorderTraversalRecursive(root), '期望: [3,2,1]');
  console.log('测试3:', postorderTraversal(null), '期望: []');
}

test();

export {};
