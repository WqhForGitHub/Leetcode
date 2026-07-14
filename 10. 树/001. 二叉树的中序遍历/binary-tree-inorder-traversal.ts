// ============================================================
// 001. 二叉树的中序遍历
// ============================================================
// LeetCode 94. Binary Tree Inorder Traversal
// 给定一个二叉树的根节点 root ，返回它的中序遍历。
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

// 方法1：递归（推荐）
function inorderTraversal(root: TreeNode | null): number[] {
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

// 方法2：迭代（使用栈）
function inorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    result.push(curr.val);
    curr = curr.right;
  }
  return result;
}

// 方法3：Morris 遍历（空间 O(1)）
function inorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (curr.left === null) {
      result.push(curr.val);
      curr = curr.right;
    } else {
      let prev: TreeNode | null = curr.left;
      while (prev.right !== null && prev.right !== curr) {
        prev = prev.right;
      }
      if (prev.right === null) {
        prev.right = curr;
        curr = curr.left;
      } else {
        prev.right = null;
        result.push(curr.val);
        curr = curr.right;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 二叉树的中序遍历 =====");
// 构造树: [1,null,2,3]
const tree1 = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
console.log("递归:", inorderTraversal(tree1)); // 期望结果 [1,3,2]
console.log("迭代:", inorderTraversalIterative(tree1)); // 期望结果 [1,3,2]
console.log("Morris:", inorderTraversalMorris(tree1)); // 期望结果 [1,3,2]

export {};
