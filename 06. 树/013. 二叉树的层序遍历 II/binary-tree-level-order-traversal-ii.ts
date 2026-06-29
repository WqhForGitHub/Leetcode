// ============================================================
// 013. 二叉树的层序遍历 II
// ============================================================
// LeetCode 107. Binary Tree Level Order Traversal II
// 给你二叉树的根节点 root，返回其节点值自底向上的层序遍历（从叶子节点所在层到根节点所在层）。
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

// 方法1：BFS + 反转（推荐）
// 先做普通层序遍历，再反转结果
function levelOrderBottom(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  if (root === null) return result;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(level);
  }
  // 反转结果，使自底向上
  return result.reverse();
}

// 方法2：DFS 递归
// 按层级递归，最后反转结果数组
function levelOrderBottomDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  function dfs(node: TreeNode | null, level: number): void {
    if (node === null) return;
    if (result.length === level) {
      result.push([]);
    }
    result[level].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return result.reverse();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 二叉树的层序遍历 II =====");
// 测试1: [3,9,20,null,null,15,7] -> [[15,7],[9,20],[3]]
const tree1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log(
  "[3,9,20,null,null,15,7] (BFS+反转):",
  JSON.stringify(levelOrderBottom(tree1))
); // [[15,7],[9,20],[3]]
console.log(
  "[3,9,20,null,null,15,7] (DFS):",
  JSON.stringify(levelOrderBottomDFS(tree1))
); // [[15,7],[9,20],[3]]

// 测试2: [1] -> [[1]]
const tree2 = new TreeNode(1);
console.log("[1] (BFS+反转):", JSON.stringify(levelOrderBottom(tree2))); // [[1]]

// 测试3: 空树 -> []
console.log("null (BFS+反转):", JSON.stringify(levelOrderBottom(null))); // []

export {};
