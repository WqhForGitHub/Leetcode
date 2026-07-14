// ============================================================
// 079. 二叉树的层平均值
// ============================================================
// LeetCode 637. Average of Levels in Binary Tree
// 给定一个非空二叉树的根节点 root，以数组的形式返回每一层节点的平均值。
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
// 每层统计和与节点数，平均值 = sum / count
function averageOfLevels(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      sum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(sum / size);
  }
  return result;
}

// 方法2：DFS递归
// 用两个数组分别记录每层的和与节点数，最后计算平均值
function averageOfLevelsDFS(root: TreeNode | null): number[] {
  if (root === null) return [];
  const sums: number[] = [];
  const counts: number[] = [];
  function dfs(node: TreeNode | null, level: number): void {
    if (node === null) return;
    if (level < sums.length) {
      sums[level] += node.val;
      counts[level] += 1;
    } else {
      sums.push(node.val);
      counts.push(1);
    }
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return sums.map((s, i) => s / counts[i]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 二叉树的层平均值 =====");

// 测试1: [3,9,20,null,null,15,7]
//      3
//     / \
//    9  20
//       / \
//      15  7
const tree1 = new TreeNode(3);
tree1.left = new TreeNode(9);
tree1.right = new TreeNode(20);
tree1.right.left = new TreeNode(15);
tree1.right.right = new TreeNode(7);
console.log("BFS:", averageOfLevels(tree1)); // 期望 [3, 14.5, 11]
console.log("DFS:", averageOfLevelsDFS(tree1)); // 期望 [3, 14.5, 11]

// 测试2: [3,9,20,15,7]
const tree2 = new TreeNode(3);
tree2.left = new TreeNode(9);
tree2.right = new TreeNode(20);
tree2.left.left = new TreeNode(15);
tree2.left.right = new TreeNode(7);
console.log("BFS:", averageOfLevels(tree2)); // 期望 [3, 14.5, 11]
console.log("DFS:", averageOfLevelsDFS(tree2)); // 期望 [3, 14.5, 11]

// 测试3: 单节点
const tree3 = new TreeNode(5);
console.log("BFS:", averageOfLevels(tree3)); // 期望 [5]
console.log("DFS:", averageOfLevelsDFS(tree3)); // 期望 [5]

export {};
