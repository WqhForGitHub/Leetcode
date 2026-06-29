// ============================================================
// 042. 二叉树最长连续序列
// ============================================================
// LeetCode 298. Binary Tree Longest Consecutive Sequence
// 给定一个二叉树，找出最长的连续路径序列的长度（父节点到子节点，递增1）。
// 时间复杂度：O(n)，空间复杂度：O(H)

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
// 自顶向下递归：传入父节点值和当前连续长度，
// 若当前节点值等于父值+1，则长度+1；否则从1重新计数。
function longestConsecutive(root: TreeNode | null): number {
  let maxLen = 0;
  function dfs(node: TreeNode | null, parentVal: number | null, length: number): void {
    if (node === null) return;
    if (parentVal !== null && node.val === parentVal + 1) {
      length = length + 1;
    } else {
      length = 1;
    }
    maxLen = Math.max(maxLen, length);
    dfs(node.left, node.val, length);
    dfs(node.right, node.val, length);
  }
  dfs(root, null, 0);
  return maxLen;
}

// 方法1变体：从每个节点向下递归（无父值版本）
function longestConsecutiveV2(root: TreeNode | null): number {
  let maxLen = 0;
  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    let leftLen = dfs(node.left);
    let rightLen = dfs(node.right);
    // 检查左子节点是否能延续
    let cur = 1;
    if (node.left !== null && node.left.val === node.val + 1) {
      cur = Math.max(cur, 1 + leftLen);
    }
    if (node.right !== null && node.right.val === node.val + 1) {
      cur = Math.max(cur, 1 + rightLen);
    }
    maxLen = Math.max(maxLen, cur);
    return cur;
  }
  dfs(root);
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 二叉树最长连续序列 =====");
// 构造树:
//     1
//      \
//       3
//      / \
//     2   4
//          \
//           5
const tree42 = new TreeNode(
  1,
  null,
  new TreeNode(3, new TreeNode(2), new TreeNode(4, null, new TreeNode(5))),
);
console.log("DFS:", longestConsecutive(tree42)); // 期望 3 (1->3 不连续; 3->4->5 长度3)
console.log("V2:", longestConsecutiveV2(tree42)); // 期望 3

// 构造树: [2,null,3,2,null,1]
//     2
//      \
//       3
//      /
//     2
//    /
//   1
const tree42b = new TreeNode(2, null, new TreeNode(3, new TreeNode(2, new TreeNode(1))));
console.log("DFS:", longestConsecutive(tree42b)); // 期望 2 (2->3)

console.log("单节点:", longestConsecutive(new TreeNode(1))); // 期望 1
console.log("空树:", longestConsecutive(null)); // 期望 0

export {};
