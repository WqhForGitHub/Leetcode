// ============================================================
// 018. 不同的二叉搜索树 II
// ============================================================
// LeetCode 95. Unique Binary Search Trees II
// 给定一个整数 n，生成所有由 1..n 组成的结构不同的二叉搜索树。
// 时间复杂度 O(n^2 * Catalan)，空间复杂度 O(n * Catalan)

// 二叉树节点定义
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

// 方法1：动态规划（推荐）
// dp[i] 存储所有由 1..i 组成的不同 BST 的列表
// 以 j 为根时，左子树由 dp[j-1] 构建，右子树由 dp[i-j] 构建并偏移 j
// 时间复杂度 O(n^2 * Catalan)，空间复杂度 O(n * Catalan)
function generateTrees(n: number): Array<TreeNode | null> {
  if (n === 0) return [];

  // dp[i] 存储由 1..i 组成的所有 BST
  const dp: Array<Array<TreeNode | null>> = [];
  // dp[0] = [null]，空树
  dp[0] = [null];

  // 从 1 到 n 逐步构建
  for (let i: number = 1; i <= n; i++) {
    const trees: Array<TreeNode | null> = [];
    // 以 j 为根节点
    for (let j: number = 1; j <= i; j++) {
      const leftTrees: Array<TreeNode | null> = dp[j - 1]; // 左子树由 1..j-1 组成
      const rightTrees: Array<TreeNode | null> = dp[i - j]; // 右子树由 1..i-j 组成
      // 笛卡尔积组合左右子树
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // 右子树需要偏移 j（因为实际值域是 j+1..i）
          const root: TreeNode = new TreeNode(j);
          root.left = cloneTree(left);
          root.right = cloneTreeWithOffset(right, j);
          trees.push(root);
        }
      }
    }
    dp[i] = trees;
  }

  return dp[n];
}

// 克隆一棵树
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  const newNode: TreeNode = new TreeNode(node.val);
  newNode.left = cloneTree(node.left);
  newNode.right = cloneTree(node.right);
  return newNode;
}

// 克隆一棵树并将所有节点值加上 offset
function cloneTreeWithOffset(node: TreeNode | null, offset: number): TreeNode | null {
  if (node === null) return null;
  const newNode: TreeNode = new TreeNode(node.val + offset);
  newNode.left = cloneTreeWithOffset(node.left, offset);
  newNode.right = cloneTreeWithOffset(node.right, offset);
  return newNode;
}

// 方法2：递归
// 递归地构建 [start, end] 范围内的所有 BST
// 时间复杂度 O(n^2 * Catalan)，空间复杂度 O(n * Catalan)
function generateTrees2(n: number): Array<TreeNode | null> {
  if (n === 0) return [];

  // 递归构建 [start, end] 范围内的所有 BST
  function build(start: number, end: number): Array<TreeNode | null> {
    const result: Array<TreeNode | null> = [];
    if (start > end) {
      result.push(null);
      return result;
    }

    // 以 i 为根节点
    for (let i: number = start; i <= end; i++) {
      // 递归构建左子树和右子树
      const leftTrees: Array<TreeNode | null> = build(start, i - 1);
      const rightTrees: Array<TreeNode | null> = build(i + 1, end);
      // 笛卡尔积组合
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          const root: TreeNode = new TreeNode(i);
          root.left = left;
          root.right = right;
          result.push(root);
        }
      }
    }

    return result;
  }

  return build(1, n);
}

// 辅助函数：统计树的个数（用于测试验证）
function countTrees(trees: Array<TreeNode | null>): number {
  return trees.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 不同的二叉搜索树 II =====");
console.log(countTrees(generateTrees(3))); // 期望结果: 5
console.log(countTrees(generateTrees(1))); // 期望结果: 1
console.log(countTrees(generateTrees2(3))); // 期望结果: 5
console.log(countTrees(generateTrees2(1))); // 期望结果: 1

export {};
