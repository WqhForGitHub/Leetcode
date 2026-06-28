// ============================================================
// 119. 两数之和 IV - 输入二叉搜索树
// ============================================================
// LeetCode 653. Two Sum IV - Input is a BST
// 给定二叉搜索树根和目标值 k，判断树中是否存在两个节点值之和等于 k。
// 时间复杂度：O(n)，空间复杂度：O(n)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 思路：哈希集合 + DFS
// 遍历树，对每个节点判断 k - val 是否已出现过
function findTarget(root: TreeNode | null, k: number): boolean {
  const seen = new Set<number>();

  const dfs = (node: TreeNode | null): boolean => {
    if (node === null) return false;
    if (seen.has(k - node.val)) {
      return true;
    }
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  };

  return dfs(root);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. 两数之和 IV - 输入二叉搜索树 =====");
// 测试 1: BST [5,3,6,2,4,null,7], k=9 -> true (3+6=9? 实际是 2+7 或 3+6)
const root1 = new TreeNode(5);
root1.left = new TreeNode(3, new TreeNode(2), new TreeNode(4));
root1.right = new TreeNode(6, null, new TreeNode(7));
console.log(findTarget(root1, 9)); // 期望: true
// 测试 2: 同树 k=28 -> false
console.log(findTarget(root1, 28)); // 期望: false
// 测试 3: 单节点
const root2 = new TreeNode(1);
console.log(findTarget(root2, 2)); // 期望: false

export {};
