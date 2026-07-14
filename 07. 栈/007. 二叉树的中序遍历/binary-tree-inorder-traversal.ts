// ============================================================
// 007. 二叉树的中序遍历
// ============================================================
// LeetCode 94. Binary Tree Inorder Traversal
// 给定一个二叉树的根节点 root，返回它的中序遍历。

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
// 方法1：迭代栈（中序遍历）
// ------------------------------------------------------------
// 不断向左走到底压栈，弹出访问，再转向右子树。
// 时间 O(n)，空间 O(n)。
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
    result.push(cur.val);
    cur = cur.right;
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function inorderTraversalRecursive(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
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
  //      \
  //       2
  //      /
  //     3
  const root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
  console.log("测试1 - 迭代:", inorderTraversal(root), "期望: [1,3,2]");
  console.log("测试2 - 递归:", inorderTraversalRecursive(root), "期望: [1,3,2]");
  console.log("测试3:", inorderTraversal(null), "期望: []");
}

test();

export {};
