// ============================================================
// 128. 最大层内元素和
// ============================================================
// LeetCode 1161. Maximum Level Sum of a Binary Tree
// 给你一个二叉树的根节点 root，返回层内元素之和最大的层的层编号。
// 层编号从 1 开始。
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
// 逐层遍历，计算每一层的和，记录最大和对应的层编号
function maxLevelSum(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let maxSum = -Infinity;
  let maxLevel = 0;
  let level = 0;
  while (queue.length > 0) {
    level++;
    const size = queue.length;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      sum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    if (sum > maxSum) {
      maxSum = sum;
      maxLevel = level;
    }
  }
  return maxLevel;
}

// 方法2：DFS递归
// 用一个数组记录每层的和，sums[level] += node.val
// 最后遍历数组找最大值所在层
function maxLevelSumDFS(root: TreeNode | null): number {
  if (root === null) return 0;
  const sums: number[] = [];

  function dfs(node: TreeNode | null, level: number): void {
    if (node === null) return;
    if (level >= sums.length) sums.push(0);
    sums[level] += node.val;
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);
  let maxSum = -Infinity;
  let maxLevel = 0;
  for (let i = 0; i < sums.length; i++) {
    if (sums[i] > maxSum) {
      maxSum = sums[i];
      maxLevel = i + 1;
    }
  }
  return maxLevel;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 最大层内元素和 =====");

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

// 测试1: root = [1,7,0,7,-8,null,null]
// 第1层和=1, 第2层和=7, 第3层和=-1
// 最大和为7，对应第2层
console.log("测试1 BFS:", maxLevelSum(buildTree([1, 7, 0, 7, -8, null, null]))); // 期望 2
console.log("测试1 DFS:", maxLevelSumDFS(buildTree([1, 7, 0, 7, -8, null, null]))); // 期望 2

// 测试2: root = [989,null,10250,98693,-89388,null,null,null,-32127]
console.log(
  "测试2 BFS:",
  maxLevelSum(buildTree([989, null, 10250, 98693, -89388, null, null, null, -32127])),
); // 期望 2

// 测试3: 单节点 [1]
console.log("测试3 BFS:", maxLevelSum(buildTree([1]))); // 期望 1

export {};
