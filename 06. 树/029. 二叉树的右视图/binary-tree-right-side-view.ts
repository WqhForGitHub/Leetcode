// ============================================================
// 029. 二叉树的右视图
// ============================================================
// LeetCode 199. Binary Tree Right Side View
// 给定一个二叉树的根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，
// 返回从右侧所能看到的节点值。
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

// 方法1：BFS 每层最后一个节点（推荐）
function rightSideView(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      // 每层最后一个节点即为右视图可见节点
      if (i === size - 1) {
        result.push(node.val);
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return result;
}

// 方法2：DFS 右子树优先
// 先访问右孩子再访问左孩子，每层第一个被访问的节点即为右视图节点
function rightSideViewDFS(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (node === null) return;
    // 当前深度第一次访问的节点
    if (depth === result.length) {
      result.push(node.val);
    }
    // 右子树优先
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 二叉树的右视图 =====");
// 树: [1,2,3,null,5,null,4]
//        1        <-- 右视图: 1
//       / \
//      2   3      <-- 右视图: 3
//       \   \
//        5   4    <-- 右视图: 4
function buildTree029(): TreeNode {
  return new TreeNode(
    1,
    new TreeNode(2, null, new TreeNode(5)),
    new TreeNode(3, null, new TreeNode(4)),
  );
}
console.log("BFS [1,2,3,null,5,null,4]:", rightSideView(buildTree029())); // [1,3,4]
console.log("DFS [1,2,3,null,5,null,4]:", rightSideViewDFS(buildTree029())); // [1,3,4]

// 树: [1,null,3]
const tree029b = new TreeNode(1, null, new TreeNode(3));
console.log("BFS [1,null,3]:", rightSideView(tree029b)); // [1,3]
console.log("DFS [1,null,3]:", rightSideViewDFS(tree029b)); // [1,3]

// 空树
console.log("BFS 空树:", rightSideView(null)); // []
console.log("DFS 空树:", rightSideViewDFS(null)); // []

// 单节点
const single029 = new TreeNode(1);
console.log("BFS 单节点:", rightSideView(single029)); // [1]
console.log("DFS 单节点:", rightSideViewDFS(single029)); // [1]

export {};
