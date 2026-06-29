// ============================================================
// 010. 二叉树的最大深度
// ============================================================
// LeetCode 104. Maximum Depth of Binary Tree
// 给定一个二叉树 root，返回其最大深度（从根节点到最远叶子节点的最长路径上的节点数）。
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

// 方法1：递归（推荐）
// 最大深度 = 1 + max(左子树深度, 右子树深度)
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 方法2：BFS
// 层序遍历，记录层数
function maxDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let depth = 0;
  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    depth++;
  }
  return depth;
}

// 方法3：DFS 迭代
// 使用栈模拟后序遍历，记录每个节点的深度
function maxDepthDFS(root: TreeNode | null): number {
  if (root === null) return 0;
  const stack: { node: TreeNode; depth: number }[] = [{ node: root, depth: 1 }];
  let maxDepthValue = 0;
  while (stack.length > 0) {
    const { node, depth } = stack.pop()!;
    maxDepthValue = Math.max(maxDepthValue, depth);
    if (node.left !== null) stack.push({ node: node.left, depth: depth + 1 });
    if (node.right !== null) stack.push({ node: node.right, depth: depth + 1 });
  }
  return maxDepthValue;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 二叉树的最大深度 =====");
// 测试1: [3,9,20,null,null,15,7] -> 3
const tree1 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("[3,9,20,null,null,15,7] (递归):", maxDepth(tree1)); // 3
console.log("[3,9,20,null,null,15,7] (BFS):", maxDepthBFS(tree1)); // 3
console.log("[3,9,20,null,null,15,7] (DFS迭代):", maxDepthDFS(tree1)); // 3

// 测试2: [1,null,2] -> 2
const tree2 = new TreeNode(1, null, new TreeNode(2));
console.log("[1,null,2] (递归):", maxDepth(tree2)); // 2

// 测试3: 空树 -> 0
console.log("null (递归):", maxDepth(null)); // 0

// 测试4: [1] -> 1
const tree4 = new TreeNode(1);
console.log("[1] (递归):", maxDepth(tree4)); // 1

export {};
