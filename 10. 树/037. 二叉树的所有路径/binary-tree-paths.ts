// ============================================================
// 037. 二叉树的所有路径
// ============================================================
// LeetCode 257. Binary Tree Paths
// 给定一个二叉树，返回所有从根节点到叶子节点的路径。
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)

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

// 方法1：DFS 回溯（推荐）
function binaryTreePaths(root: TreeNode | null): string[] {
  const result: string[] = [];
  const path: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    path.push(node.val);
    if (node.left === null && node.right === null) {
      result.push(path.join("->"));
    } else {
      dfs(node.left);
      dfs(node.right);
    }
    path.pop(); // 回溯
  }
  dfs(root);
  return result;
}

// 方法2：BFS
function binaryTreePathsBFS(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (root === null) return result;
  // 队列同时保存节点和到该节点的路径
  const queue: { node: TreeNode; path: string }[] = [{ node: root, path: String(root.val) }];
  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (node.left === null && node.right === null) {
      result.push(path);
      continue;
    }
    if (node.left !== null) {
      queue.push({ node: node.left, path: path + "->" + node.left.val });
    }
    if (node.right !== null) {
      queue.push({ node: node.right, path: path + "->" + node.right.val });
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 二叉树的所有路径 =====");
// 构造树: [1,2,3,null,5]
const tree37 = new TreeNode(1, new TreeNode(2, null, new TreeNode(5)), new TreeNode(3));
console.log("DFS:", binaryTreePaths(tree37)); // 期望 ["1->2->5","1->3"]
console.log("BFS:", binaryTreePathsBFS(tree37)); // 期望 ["1->2->5","1->3"]

const tree37b = new TreeNode(1);
console.log("单节点 DFS:", binaryTreePaths(tree37b)); // 期望 ["1"]
console.log("空树 BFS:", binaryTreePathsBFS(null)); // 期望 []

export {};
