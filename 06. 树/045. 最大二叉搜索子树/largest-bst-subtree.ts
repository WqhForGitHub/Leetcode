// ============================================================
// 045. 最大二叉搜索子树
// ============================================================
// LeetCode 333. Largest BST Subtree
// 给定一个二叉树，找到最大的子树（该子树是二叉搜索树），返回该最大子树的节点数。
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

// 方法1：递归后序遍历返回子树信息（推荐）
// 每棵子树返回：(是否 BST, 最小值, 最大值, 节点数)。
// 当前子树为 BST 当且仅当左右子树都是 BST 且
// 左子树最大值 < 当前值 < 右子树最小值。
interface SubtreeInfo {
  isBST: boolean;
  min: number;
  max: number;
  size: number;
}

function largestBSTSubtree(root: TreeNode | null): number {
  let maxSize = 0;
  function dfs(node: TreeNode | null): SubtreeInfo {
    if (node === null) {
      // 空树视为 BST，min/max 用极端值方便比较
      return { isBST: true, min: Infinity, max: -Infinity, size: 0 };
    }
    const left = dfs(node.left);
    const right = dfs(node.right);
    // 判断当前子树是否是 BST
    if (left.isBST && right.isBST && node.val > left.max && node.val < right.min) {
      const size = left.size + right.size + 1;
      maxSize = Math.max(maxSize, size);
      return {
        isBST: true,
        min: left.size === 0 ? node.val : left.min,
        max: right.size === 0 ? node.val : right.max,
        size,
      };
    }
    return { isBST: false, min: 0, max: 0, size: 0 };
  }
  dfs(root);
  return maxSize;
}

// 方法1变体：直接用变量记录子树根节点
function largestBSTSubtreeV2(root: TreeNode | null): number {
  let maxSize = 0;
  function helper(node: TreeNode | null): { min: number; max: number; size: number } {
    if (node === null) {
      return { min: Infinity, max: -Infinity, size: 0 };
    }
    const left = helper(node.left);
    const right = helper(node.right);
    // size < 0 表示不是 BST（用负数标记）
    if (left.size >= 0 && right.size >= 0 && node.val > left.max && node.val < right.min) {
      const size = left.size + right.size + 1;
      maxSize = Math.max(maxSize, size);
      return {
        min: left.size === 0 ? node.val : left.min,
        max: right.size === 0 ? node.val : right.max,
        size,
      };
    }
    return { min: 0, max: 0, size: -1 }; // 标记不是 BST
  }
  helper(root);
  return maxSize;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 最大二叉搜索子树 =====");
// 构造树:
//        10
//       /  \
//      5   15
//     / \    \
//    1   8    7
// 子树 [5,1,8] 是 BST，节点数 3
const tree45 = new TreeNode(
  10,
  new TreeNode(5, new TreeNode(1), new TreeNode(8)),
  new TreeNode(15, null, new TreeNode(7)),
);
console.log("最大 BST 子树:", largestBSTSubtree(tree45)); // 期望 3
console.log("V2:", largestBSTSubtreeV2(tree45)); // 期望 3

// 构造树: [4,2,7,1,3]  整棵树是 BST
const tree45b = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(7));
console.log("整棵 BST:", largestBSTSubtree(tree45b)); // 期望 5
console.log("V2 整棵 BST:", largestBSTSubtreeV2(tree45b)); // 期望 5

console.log("空树:", largestBSTSubtree(null)); // 期望 0
console.log("单节点:", largestBSTSubtree(new TreeNode(1))); // 期望 1

export {};
