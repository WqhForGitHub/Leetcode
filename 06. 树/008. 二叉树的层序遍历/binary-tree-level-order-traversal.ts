// ============================================================
// 008. 二叉树的层序遍历
// ============================================================
// LeetCode 102. Binary Tree Level Order Traversal
// 给你二叉树的根节点 root，返回其节点值的层序遍历（逐层地，从左到右）。
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

// 方法1：BFS 队列（推荐）
// 逐层处理，每层先记录当前队列大小再处理
function levelOrder(root: TreeNode | null): number[][] {
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
  return result;
}

// 方法2：DFS 递归
// 按层级递归，将节点值放入对应层级的数组
function levelOrderDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  function dfs(node: TreeNode | null, level: number): void {
    if (node === null) return;
    // 当前层还没有数组，创建一个
    if (result.length === level) {
      result.push([]);
    }
    result[level].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 二叉树的层序遍历 =====");
// 测试1: [3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]]
const tree1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("[3,9,20,null,null,15,7] (BFS):", JSON.stringify(levelOrder(tree1)));
// [[3],[9,20],[15,7]]
console.log("[3,9,20,null,null,15,7] (DFS):", JSON.stringify(levelOrderDFS(tree1)));
// [[3],[9,20],[15,7]]

// 测试2: [1] -> [[1]]
const tree2 = new TreeNode(1);
console.log("[1] (BFS):", JSON.stringify(levelOrder(tree2))); // [[1]]

// 测试3: 空树 -> []
console.log("null (BFS):", JSON.stringify(levelOrder(null))); // []

export {};
