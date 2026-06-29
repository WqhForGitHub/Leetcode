// ============================================================
// 062. 在每个树行中找最大值
// ============================================================
// LeetCode 515. Find Largest Value in Each Tree Row
// 给定一棵二叉树的根节点 root，请找出该二叉树中每一层的最大值。
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

// 方法1：BFS层序遍历（推荐）
// 逐层遍历，每层记录最大值
function largestValues(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    let levelMax = -Infinity;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      levelMax = Math.max(levelMax, node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(levelMax);
  }
  return result;
}

// 方法2：DFS递归
// 根据深度将节点值与对应层当前最大值比较
function largestValuesDFS(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (node === null) return;
    // 第一次到达该层，初始化为当前节点值
    if (result.length === depth) {
      result.push(node.val);
    } else {
      result[depth] = Math.max(result[depth], node.val);
    }
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 在每个树行中找最大值 =====");
// 树:
//        1
//       / \
//      3   2
//     / \   \
//    5   3   9
// 每层最大值: [1, 3, 9]
const tree1 = new TreeNode(
  1,
  new TreeNode(3, new TreeNode(5), new TreeNode(3)),
  new TreeNode(2, null, new TreeNode(9))
);
console.log("BFS [1,3,2,5,3,null,9]:", largestValues(tree1)); // [1, 3, 9]
console.log("DFS [1,3,2,5,3,null,9]:", largestValuesDFS(tree1)); // [1, 3, 9]

// 单节点
const single = new TreeNode(1);
console.log("BFS 单节点:", largestValues(single)); // [1]
console.log("DFS 单节点:", largestValuesDFS(single)); // [1]

// 空树
console.log("BFS 空树:", largestValues(null)); // []
console.log("DFS 空树:", largestValuesDFS(null)); // []

// 包含负数
const tree2 = new TreeNode(
  -1,
  new TreeNode(-2, new TreeNode(-4), null),
  new TreeNode(-3, null, new TreeNode(-5))
);
console.log("BFS 含负数:", largestValues(tree2)); // [-1, -2, -4]
console.log("DFS 含负数:", largestValuesDFS(tree2)); // [-1, -2, -4]

export {};
