// ============================================================
// 025. 二叉树的前序遍历
// ============================================================
// LeetCode 144. Binary Tree Preorder Traversal
// 给你二叉树的根节点 root，返回它节点值的前序遍历（根 -> 左 -> 右）。
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
function preorderTraversal(root: TreeNode | null): number[] {
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

// 方法2：迭代栈
function preorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    // 先压右再压左，保证弹出顺序为左在前
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }
  return result;
}

// 方法3：Morris 遍历（空间 O(1)）
function preorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let curr = root;
  while (curr !== null) {
    if (curr.left === null) {
      result.push(curr.val);
      curr = curr.right;
    } else {
      // 找前驱节点
      let prev: TreeNode | null = curr.left;
      while (prev.right !== null && prev.right !== curr) {
        prev = prev.right;
      }
      if (prev.right === null) {
        // 建立线索
        result.push(curr.val);
        prev.right = curr;
        curr = curr.left;
      } else {
        // 移除线索
        prev.right = null;
        curr = curr.right;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 二叉树的前序遍历 =====");
// 树: [1,null,2,3]
const tree025 = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
console.log("递归:", preorderTraversal(tree025)); // [1,2,3]
console.log("迭代:", preorderTraversalIterative(tree025)); // [1,2,3]
console.log("Morris:", preorderTraversalMorris(tree025)); // [1,2,3]

// 树: [1,2,3,4,5,null,6]
const tree025b = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6)),
);
console.log("递归 [1,2,3,4,5,null,6]:", preorderTraversal(tree025b)); // [1,2,4,5,3,6]
console.log("迭代 [1,2,3,4,5,null,6]:", preorderTraversalIterative(tree025b)); // [1,2,4,5,3,6]
console.log("Morris [1,2,3,4,5,null,6]:", preorderTraversalMorris(tree025b)); // [1,2,4,5,3,6]

console.log("空树:", preorderTraversal(null)); // []
console.log("空树:", preorderTraversalIterative(null)); // []
console.log("空树:", preorderTraversalMorris(null)); // []

export {};
