// ============================================================
// 089. 最长同值路径
// ============================================================
// LeetCode 687. Longest Univalue Path
// 给定一个二叉树的根节点 root，返回最长的同值路径长度。
// 路径的两个端点之间的边数即为长度，路径方向可向上或向下但不可分叉。
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

// 方法1：DFS后序递归（推荐）
// 对每个节点，计算以该节点为最高点的单侧同值路径长度（左/右最长）
// 经过该节点的同值路径长度 = 左侧长度 + 右侧长度
// 全局取最大值
function longestUnivaluePath(root: TreeNode | null): number {
  let maxLen = 0;
  // 返回以 node 为根、向下的同值路径最长边数
  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    const leftLen = dfs(node.left);
    const rightLen = dfs(node.right);
    let leftArrow = 0;
    let rightArrow = 0;
    if (node.left !== null && node.left.val === node.val) {
      leftArrow = leftLen + 1;
    }
    if (node.right !== null && node.right.val === node.val) {
      rightArrow = rightLen + 1;
    }
    // 经过当前节点的路径长度（边数）
    const throughCurrent = leftArrow + rightArrow;
    if (throughCurrent > maxLen) maxLen = throughCurrent;
    // 返回单侧最长
    return Math.max(leftArrow, rightArrow);
  }
  dfs(root);
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 最长同值路径 =====");

// 测试1: root = [5,4,5,1,1,null,5]
//        5
//       / \
//      4   5
//     / \   \
//    1   1   5
// 最长同值路径：5-5-5（右子树两条边）长度2
const tree1 = new TreeNode(5);
tree1.left = new TreeNode(4);
tree1.right = new TreeNode(5);
tree1.left.left = new TreeNode(1);
tree1.left.right = new TreeNode(1);
tree1.right.right = new TreeNode(5);
console.log("测试1:", longestUnivaluePath(tree1)); // 期望 2

// 测试2: root = [1,4,5,4,4,null,5]
//        1
//       / \
//      4   5
//     / \   \
//    4   4   5
// 最长同值路径：4-4-4 长度2
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(4);
tree2.right = new TreeNode(5);
tree2.left.left = new TreeNode(4);
tree2.left.right = new TreeNode(4);
tree2.right.right = new TreeNode(5);
console.log("测试2:", longestUnivaluePath(tree2)); // 期望 2

// 测试3: 单节点
const tree3 = new TreeNode(1);
console.log("测试3:", longestUnivaluePath(tree3)); // 期望 0

// 测试4: root = [1,null,1,1,1,1,1,1]
//        1
//         \
//          1
//         / \
//        1   1
//       / \ / \
//      1  1 1  1
// 最长同值路径长度
const tree4 = new TreeNode(1);
tree4.right = new TreeNode(1);
tree4.right.left = new TreeNode(1);
tree4.right.right = new TreeNode(1);
tree4.right.left.left = new TreeNode(1);
tree4.right.left.right = new TreeNode(1);
tree4.right.right.left = new TreeNode(1);
console.log("测试4:", longestUnivaluePath(tree4)); // 期望 4

export {};
