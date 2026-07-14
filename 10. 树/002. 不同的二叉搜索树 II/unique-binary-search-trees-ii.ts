// ============================================================
// 002. 不同的二叉搜索树 II
// ============================================================
// LeetCode 95. Unique Binary Search Trees II
// 给你一个整数 n，请你生成并返回所有由 n 个节点组成且节点值从 1 到 n 互不相同的不同二叉搜索树。
// 时间复杂度：O(4^n / sqrt(n))，空间复杂度：O(4^n / sqrt(n))

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

// 方法1：递归分治（推荐）
// 以 i 为根，[start, i-1] 构造左子树，[i+1, end] 构造右子树
function generateTrees(n: number): (TreeNode | null)[] {
  if (n === 0) return [];
  return generateTreesHelper(1, n);
}

function generateTreesHelper(start: number, end: number): (TreeNode | null)[] {
  const result: (TreeNode | null)[] = [];
  if (start > end) {
    result.push(null);
    return result;
  }
  // 枚举根节点
  for (let i = start; i <= end; i++) {
    // 递归构造所有左子树
    const leftTrees = generateTreesHelper(start, i - 1);
    // 递归构造所有右子树
    const rightTrees = generateTreesHelper(i + 1, end);
    // 组合所有左右子树
    for (const left of leftTrees) {
      for (const right of rightTrees) {
        const root = new TreeNode(i);
        root.left = left;
        root.right = right;
        result.push(root);
      }
    }
  }
  return result;
}

// 方法2：动态规划
// 利用 dp[i] 表示由前 i 个数能组成的所有 BST
function generateTreesDP(n: number): (TreeNode | null)[] {
  if (n === 0) return [];
  // dp[i] 存储由 1..i 能组成的所有 BST；dp[0] = [null] 表示空树
  const dp: (TreeNode | null)[][] = [[null], [new TreeNode(1)]];
  for (let i = 2; i <= n; i++) {
    const trees: (TreeNode | null)[] = [];
    for (let root = 1; root <= i; root++) {
      // 左子树由 root-1 个节点构成，使用前 root-1 个数的所有 BST
      const leftTrees = dp[root - 1];
      // 右子树由 i-root 个节点构成，将值偏移 root
      const rightTrees = dp[i - root].map((t) => cloneAndOffset(t, root));
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          const node = new TreeNode(root);
          node.left = left;
          node.right = right;
          trees.push(node);
        }
      }
    }
    dp.push(trees);
  }
  return dp[n];
}

// 克隆树并对每个节点值加上偏移量 offset
function cloneAndOffset(node: TreeNode | null, offset: number): TreeNode | null {
  if (node === null) return null;
  const newNode = new TreeNode(node.val + offset);
  newNode.left = cloneAndOffset(node.left, offset);
  newNode.right = cloneAndOffset(node.right, offset);
  return newNode;
}

// 辅助函数：将树序列化为字符串便于比较
function treeToArray(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去掉末尾的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 不同的二叉搜索树 II =====");
console.log("n=3, 树的种类数:", generateTrees(3).length); // 5
console.log("n=1, 树的种类数:", generateTrees(1).length); // 1
console.log("n=3 (DP), 树的种类数:", generateTreesDP(3).length); // 5
console.log("n=3 所有树的层序遍历:");
generateTrees(3).forEach((t, i) => {
  console.log(`  树 ${i + 1}:`, JSON.stringify(treeToArray(t)));
});

export {};
