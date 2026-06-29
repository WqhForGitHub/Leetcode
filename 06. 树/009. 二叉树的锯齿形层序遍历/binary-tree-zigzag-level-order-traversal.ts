// ============================================================
// 009. 二叉树的锯齿形层序遍历
// ============================================================
// LeetCode 103. Binary Tree Zigzag Level Order Traversal
// 给你二叉树的根节点 root，返回其节点值的锯齿形层序遍历（先左到右，再右到左交替）。
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

// 方法1：BFS + 方向标志（推荐）
// 偶数层从左到右，奇数层从右到左
function zigzagLevelOrder(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  if (root === null) return result;
  const queue: TreeNode[] = [root];
  let leftToRight = true; // 方向标志
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = new Array(levelSize);
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      // 根据方向决定插入位置
      const index = leftToRight ? i : levelSize - 1 - i;
      level[index] = node.val;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(level);
    leftToRight = !leftToRight; // 反转方向
  }
  return result;
}

// 方法2：DFS 递归
// 按层级递归，奇数层在前端插入（unshift），偶数层在尾端插入（push）
function zigzagLevelOrderDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  function dfs(node: TreeNode | null, level: number): void {
    if (node === null) return;
    if (result.length === level) {
      result.push([]);
    }
    // 偶数层（0,2,4...）从左到右，push 到尾部
    // 奇数层（1,3,5...）从右到左，unshift 到头部
    if (level % 2 === 0) {
      result[level].push(node.val);
    } else {
      result[level].unshift(node.val);
    }
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 二叉树的锯齿形层序遍历 =====");
// 测试1: [3,9,20,null,null,15,7] -> [[3],[20,9],[15,7]]
const tree1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log("[3,9,20,null,null,15,7] (BFS):", JSON.stringify(zigzagLevelOrder(tree1))); // [[3],[20,9],[15,7]]
console.log("[3,9,20,null,null,15,7] (DFS):", JSON.stringify(zigzagLevelOrderDFS(tree1))); // [[3],[20,9],[15,7]]

// 测试2: [1] -> [[1]]
const tree2 = new TreeNode(1);
console.log("[1] (BFS):", JSON.stringify(zigzagLevelOrder(tree2))); // [[1]]

// 测试3: 空树 -> []
console.log("null (BFS):", JSON.stringify(zigzagLevelOrder(null))); // []

export {};
