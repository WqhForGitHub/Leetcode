// ============================================================
// 010. 二叉树的前序遍历
// ============================================================
// LeetCode 144. Binary Tree Preorder Traversal
// 给你二叉树的根节点 root，返回它节点值的前序遍历。

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
// 方法1：迭代栈（前序遍历）
// ------------------------------------------------------------
// 根 -> 左 -> 右。入栈顺序：先右后左（这样弹出先左后右）。
// 时间 O(n)，空间 O(n)。
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function preorderTraversalRecursive(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     1
  //    / \
  //   2   3
  //  / \
  // 4   5
  const root = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
  console.log('测试1 - 迭代:', preorderTraversal(root), '期望: [1,2,4,5,3]');
  console.log('测试2 - 递归:', preorderTraversalRecursive(root), '期望: [1,2,4,5,3]');
  console.log('测试3:', preorderTraversal(null), '期望: []');
}

test();

export {};
