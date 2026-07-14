// ============================================================
// 035. 统计同值子树
// ============================================================
// LeetCode 250. Count Univalue Subtrees
// 给定一个二叉树，统计该树中度数同值子树的数目。
// 同值子树是指该子树的所有节点都具有相同的值。
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

// 方法1：递归后序遍历（推荐）
// 自底向上判断：当前子树为同值子树，当且仅当左右子树都是同值子树
// 且左右子节点（若存在）的值都等于当前节点值。
function countUnivalSubtrees(root: TreeNode | null): number {
  let count = 0;
  function isUnival(node: TreeNode | null, parentVal?: number): boolean {
    if (node === null) return true;
    // 利用父节点值提前短路优化
    if (parentVal !== undefined && node.val !== parentVal) return false;
    const leftUni = isUnival(node.left, node.val);
    const rightUni = isUnival(node.right, node.val);
    if (leftUni && rightUni) {
      count++;
      return true;
    }
    return false;
  }
  isUnival(root);
  return count;
}

// 方法1变体：不依赖父值传递
function countUnivalSubtreesV2(root: TreeNode | null): number {
  let count = 0;
  function helper(node: TreeNode | null): boolean {
    if (node === null) return true;
    const leftUni = helper(node.left);
    const rightUni = helper(node.right);
    if (!leftUni || !rightUni) return false;
    if (node.left !== null && node.left.val !== node.val) return false;
    if (node.right !== null && node.right.val !== node.val) return false;
    count++;
    return true;
  }
  helper(root);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 统计同值子树 =====");
// 构造树: [5,1,5,5,5,null,5]
const tree35 = new TreeNode(
  5,
  new TreeNode(1, new TreeNode(5), new TreeNode(5)),
  new TreeNode(5, null, new TreeNode(5)),
);
console.log("同值子树数:", countUnivalSubtrees(tree35)); // 期望 4

const tree35b = new TreeNode(
  5,
  new TreeNode(1, new TreeNode(5), new TreeNode(5)),
  new TreeNode(5, null, new TreeNode(5)),
);
console.log("同值子树数 V2:", countUnivalSubtreesV2(tree35b)); // 期望 4

// 空树
console.log("空树:", countUnivalSubtrees(null)); // 期望 0

// 单节点
console.log("单节点:", countUnivalSubtrees(new TreeNode(1))); // 期望 1

export {};
