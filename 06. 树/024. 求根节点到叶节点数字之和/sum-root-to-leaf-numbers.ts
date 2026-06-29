// ============================================================
// 024. 求根节点到叶节点数字之和
// ============================================================
// LeetCode 129. Sum Root to Leaf Numbers
// 给你一个二叉树的根节点 root，树中每个节点都存放有一个 0 到 9 之间的数字。
// 每条从根节点到叶节点的路径都代表一个数字。返回这些数字之和。
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

// 方法1：DFS 递归（推荐）
function sumNumbers(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, currentSum: number): number {
    if (node === null) return 0;
    const newSum = currentSum * 10 + node.val;
    // 叶子节点
    if (node.left === null && node.right === null) {
      return newSum;
    }
    return dfs(node.left, newSum) + dfs(node.right, newSum);
  }
  return dfs(root, 0);
}

// 方法2：BFS 迭代（使用双队列）
function sumNumbersBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let total = 0;
  const nodeQueue: TreeNode[] = [root];
  const numQueue: number[] = [root.val];
  while (nodeQueue.length > 0) {
    const node = nodeQueue.shift()!;
    const num = numQueue.shift()!;
    // 叶子节点
    if (node.left === null && node.right === null) {
      total += num;
      continue;
    }
    if (node.left !== null) {
      nodeQueue.push(node.left);
      numQueue.push(num * 10 + node.left.val);
    }
    if (node.right !== null) {
      nodeQueue.push(node.right);
      numQueue.push(num * 10 + node.right.val);
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 求根节点到叶节点数字之和 =====");
// 树: [1,2,3] -> 12 + 13 = 25
const tree024a = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("DFS [1,2,3]:", sumNumbers(tree024a)); // 25
console.log("BFS [1,2,3]:", sumNumbersBFS(tree024a)); // 25

// 树: [4,9,0,5,1] -> 495 + 491 + 40 = 1026
const tree024b = new TreeNode(
  4,
  new TreeNode(9, new TreeNode(5), new TreeNode(1)),
  new TreeNode(0),
);
console.log("DFS [4,9,0,5,1]:", sumNumbers(tree024b)); // 1026
console.log("BFS [4,9,0,5,1]:", sumNumbersBFS(tree024b)); // 1026

// 单节点
const single024 = new TreeNode(0);
console.log("DFS 单节点 [0]:", sumNumbers(single024)); // 0
console.log("BFS 单节点 [0]:", sumNumbersBFS(single024)); // 0

export {};
