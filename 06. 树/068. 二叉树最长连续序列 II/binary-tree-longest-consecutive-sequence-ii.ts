// ============================================================
// 068. 二叉树最长连续序列 II
// ============================================================
// LeetCode 549. Binary Tree Longest Consecutive Sequence II
// 给定一个二叉树，找到最长的连续路径（可以是递增或递减，步长为1）。
// 路径可以从任意节点出发，经过父子关系到达任意节点。
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

// 方法1：DFS后序递归返回递增递减长度（推荐）
// 对每个节点，返回以该节点为端点的最长递增、递减序列长度
// 经过该节点的最长路径 = 左递增 + 右递减（或左递减 + 右递增）+ 1
function longestConsecutive(root: TreeNode | null): number {
  let maxLen = 0;
  // 返回 [以 node 为终点的递增长度, 递减长度]
  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [0, 0];
    let inc = 1; // 递增长度（node.val 比 child.val 小 1）
    let dec = 1; // 递减长度（node.val 比 child.val 大 1）
    const left = dfs(node.left);
    const right = dfs(node.right);
    // 处理左孩子
    if (node.left !== null) {
      if (node.left.val === node.val + 1) {
        // node 比 left 小 1，递增方向 node -> left
        inc = Math.max(inc, left[0] + 1);
      } else if (node.left.val === node.val - 1) {
        // node 比 left 大 1，递减方向 node -> left
        dec = Math.max(dec, left[1] + 1);
      }
    }
    // 处理右孩子
    if (node.right !== null) {
      if (node.right.val === node.val + 1) {
        inc = Math.max(inc, right[0] + 1);
      } else if (node.right.val === node.val - 1) {
        dec = Math.max(dec, right[1] + 1);
      }
    }
    // 经过当前节点的最长路径（左增右减 或 左减右增）
    maxLen = Math.max(maxLen, inc + dec - 1);
    return [inc, dec];
  }
  dfs(root);
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 二叉树最长连续序列 II =====");
// 树:
//        1
//       / \
//      2   3
// 最长连续路径: 1-2 或 1-3，长度 2
const tree1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("[1,2,3]:", longestConsecutive(tree1)); // 2

// 树:
//        2
//       / \
//      1   3
// 最长连续路径: 1-2-3，长度 3
const tree2 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log("[2,1,3]:", longestConsecutive(tree2)); // 3

// 树:
//        3
//       / \
//      2   4
//     /     \
//    1       5
// 最长连续路径: 1-2-3-4-5，长度 5
const tree3 = new TreeNode(
  3,
  new TreeNode(2, new TreeNode(1), null),
  new TreeNode(4, null, new TreeNode(5))
);
console.log("递增5:", longestConsecutive(tree3)); // 5

// 树:
//        1
//       / \
//      3   2
//     /     \
//    4       1
// 最长连续路径: 4-3-2-1，长度 4
const tree4 = new TreeNode(
  1,
  new TreeNode(3, new TreeNode(4), null),
  new TreeNode(2, null, new TreeNode(1))
);
console.log("递减4:", longestConsecutive(tree4)); // 4

// 单节点
const single = new TreeNode(1);
console.log("单节点:", longestConsecutive(single)); // 1

export {};
