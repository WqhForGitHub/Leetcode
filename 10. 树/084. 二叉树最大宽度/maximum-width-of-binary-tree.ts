// ============================================================
// 084. 二叉树最大宽度
// ============================================================
// LeetCode 662. Maximum Width of Binary Tree
// 给定一个二叉树，计算其最大宽度（每层最左和最右节点之间的宽度）。
// 宽度 = 最右节点编号 - 最左节点编号 + 1（包含两端）
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

// 方法1：BFS+编号（推荐）
// 给每个节点编号：根为1，左孩子2*idx，右孩子2*idx+1
// 每层记录第一个和最后一个节点的编号，宽度 = last - first + 1
function widthOfBinaryTree(root: TreeNode | null): number {
  if (root === null) return 0;
  let maxWidth = 0;
  // 队列存储 [节点, 编号]
  const queue: [TreeNode, number][] = [[root, 1]];
  while (queue.length > 0) {
    const size = queue.length;
    const firstIndex = queue[0][1];
    let lastIndex = firstIndex;
    for (let i = 0; i < size; i++) {
      const [node, idx] = queue.shift()!;
      lastIndex = idx;
      if (node.left) queue.push([node.left, 2 * idx]);
      if (node.right) queue.push([node.right, 2 * idx + 1]);
    }
    const width = lastIndex - firstIndex + 1;
    if (width > maxWidth) maxWidth = width;
  }
  return maxWidth;
}

// 方法2：DFS+编号
// 递归记录每层最左节点编号，递归时计算当前层宽度
function widthOfBinaryTreeDFS(root: TreeNode | null): number {
  if (root === null) return 0;
  const leftmost = new Map<number, number>(); // 层 -> 该层最左节点编号
  let maxWidth = 0;
  function dfs(node: TreeNode | null, depth: number, index: number): void {
    if (node === null) return;
    // 第一次到达该层时记录最左编号
    if (!leftmost.has(depth)) {
      leftmost.set(depth, index);
    }
    const width = index - leftmost.get(depth)! + 1;
    if (width > maxWidth) maxWidth = width;
    dfs(node.left, depth + 1, 2 * index);
    dfs(node.right, depth + 1, 2 * index + 1);
  }
  dfs(root, 0, 1);
  return maxWidth;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 二叉树最大宽度 =====");

// 测试1: root = [1,3,2,5,3,null,9]
//        1
//       / \
//      3   2
//     / \   \
//    5   3   9
// 第3层：5 3 null 9，宽度4
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(3);
tree1.right = new TreeNode(2);
tree1.left.left = new TreeNode(5);
tree1.left.right = new TreeNode(3);
tree1.right.right = new TreeNode(9);
console.log("BFS:", widthOfBinaryTree(tree1)); // 期望 4
console.log("DFS:", widthOfBinaryTreeDFS(tree1)); // 期望 4

// 测试2: root = [1,3,null,5,3]
//     1
//    /
//   3
//  / \
// 5   3
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(3);
tree2.left.left = new TreeNode(5);
tree2.left.right = new TreeNode(3);
console.log("BFS:", widthOfBinaryTree(tree2)); // 期望 2
console.log("DFS:", widthOfBinaryTreeDFS(tree2)); // 期望 2

// 测试3: root = [1,3,2,5]
//     1
//    / \
//   3   2
//  /
// 5
const tree3 = new TreeNode(1);
tree3.left = new TreeNode(3);
tree3.right = new TreeNode(2);
tree3.left.left = new TreeNode(5);
console.log("BFS:", widthOfBinaryTree(tree3)); // 期望 2
console.log("DFS:", widthOfBinaryTreeDFS(tree3)); // 期望 2

// 测试4: 单节点
const tree4 = new TreeNode(1);
console.log("BFS:", widthOfBinaryTree(tree4)); // 期望 1
console.log("DFS:", widthOfBinaryTreeDFS(tree4)); // 期望 1

export {};
