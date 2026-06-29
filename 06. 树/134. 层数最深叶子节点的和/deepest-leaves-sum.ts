// ============================================================
// 134. 层数最深叶子节点的和
// ============================================================
// LeetCode 1302. Deepest Leaves Sum
// 给你一棵二叉树的根节点 root，返回树中最深层叶子节点的和。
// 时间复杂度：O(n)，空间复杂度：O(w)

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

// 方法1：BFS层序（推荐）
// 逐层遍历，记录最后一层的节点之和
function deepestLeavesSum(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let lastSum = 0;
  while (queue.length > 0) {
    const size = queue.length;
    let levelSum = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      levelSum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    lastSum = levelSum; // 每层都更新，最后一次即为最深
  }
  return lastSum;
}

// 方法2：DFS递归
// 记录最大深度，DFS 中遇到更深节点则重置 sum，遇到同深节点则累加
let maxDepth: number;
let depthSum: number;
function deepestLeavesSumDFS(root: TreeNode | null): number {
  maxDepth = 0;
  depthSum = 0;
  dfs(root, 0);
  return depthSum;
}

function dfs(node: TreeNode | null, depth: number): void {
  if (node === null) return;
  // 仅在叶节点处判断
  if (node.left === null && node.right === null) {
    if (depth > maxDepth) {
      maxDepth = depth;
      depthSum = node.val;
    } else if (depth === maxDepth) {
      depthSum += node.val;
    }
    return;
  }
  dfs(node.left, depth + 1);
  dfs(node.right, depth + 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 层数最深叶子节点的和 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(leftVal) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(rightVal) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: root = [1,2,3,4,5,null,6,7,null,null,null,null,8]
//          1
//         / \
//        2   3
//       / \   \
//      4   5   6
//     /         \
//    7           8
// 最深叶节点为 7 和 8，和 = 15
console.log(
  "测试1 BFS:",
  deepestLeavesSum(buildTree([1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, 8]))
); // 期望 15
console.log(
  "测试1 DFS:",
  deepestLeavesSumDFS(
    buildTree([1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, 8])
  )
); // 期望 15

// 测试2: root = [6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]
// 最深层为第4层，叶节点 9,1,4,5，和 = 19
console.log(
  "测试2 BFS:",
  deepestLeavesSum(
    buildTree([6, 7, 8, 2, 7, 1, 3, 9, null, 1, 4, null, null, null, 5])
  )
); // 期望 19

// 测试3: 单节点 [1]
console.log("测试3 BFS:", deepestLeavesSum(buildTree([1]))); // 期望 1

export {};
