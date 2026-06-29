// ============================================================
// 061. 找树左下角的值
// ============================================================
// LeetCode 513. Find Bottom Left Tree Value
// 给定一个二叉树的根节点 root，请找出该二叉树最底层最左边节点的值。
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

// 方法1：BFS层序从右到左（推荐）
// 从右到左层序遍历，最后一个访问的节点就是最底层最左边的节点
function findBottomLeftValue(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let node: TreeNode = root;
  while (queue.length > 0) {
    node = queue.shift()!;
    // 先右后左，这样最后剩下的就是最左下角的节点
    if (node.right !== null) queue.push(node.right);
    if (node.left !== null) queue.push(node.left);
  }
  return node.val;
}

// 方法2：DFS递归记录深度
// 记录当前最大深度，第一次到达更深的层时记录节点值
function findBottomLeftValueDFS(root: TreeNode | null): number {
  let maxDepth = -1;
  let result = 0;
  function dfs(node: TreeNode | null, depth: number): void {
    if (node === null) return;
    // 第一次到达更深的层，记录该层最左边的节点值
    if (depth > maxDepth) {
      maxDepth = depth;
      result = node.val;
    }
    // 先左后右，保证每层最先访问的是最左节点
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 找树左下角的值 =====");
// 树:
//        2
//       / \
//      1   3
// 最底层最左节点为 1
const tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log("BFS [2,1,3]:", findBottomLeftValue(tree1)); // 1
console.log("DFS [2,1,3]:", findBottomLeftValueDFS(tree1)); // 1

// 树:
//        1
//       / \
//      2   3
//     /   / \
//    4   5   6
//       /
//      7
// 最底层最左节点为 7
const tree2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), null),
  new TreeNode(3, new TreeNode(5, new TreeNode(7), null), new TreeNode(6))
);
console.log("BFS 复杂树:", findBottomLeftValue(tree2)); // 7
console.log("DFS 复杂树:", findBottomLeftValueDFS(tree2)); // 7

// 单节点
const single = new TreeNode(1);
console.log("BFS 单节点:", findBottomLeftValue(single)); // 1
console.log("DFS 单节点:", findBottomLeftValueDFS(single)); // 1

export {};
