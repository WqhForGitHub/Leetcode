// ============================================================
// 103. 所有可能的真二叉树
// ============================================================
// LeetCode 894. All Possible Full Binary Trees
// 给定一个整数 n，返回包含 n 个节点的所有可能真二叉树（满二叉树）的列表。
// 真二叉树：每个节点有 0 或 2 个孩子。
// n 个节点的真二叉树必须满足 n 为奇数。
// 时间复杂度：O(2^(n/2))（结果数级别），空间复杂度：O(2^(n/2))

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
// 真二叉树根节点必有两个子树，左右子树节点数都是奇数。
// 枚举左子树节点数 i（1,3,5,...,n-2），右子树节点数 n-1-i。
// 递归构造所有可能的左右子树，再组合。

function allPossibleFBT(n: number): Array<TreeNode | null> {
  // n 为偶数时无法构造真二叉树
  if (n % 2 === 0) return [];

  function build(count: number): TreeNode[] {
    if (count === 1) return [new TreeNode(0)];
    const result: TreeNode[] = [];
    // 枚举左子树节点数（奇数）
    for (let leftCount = 1; leftCount < count; leftCount += 2) {
      const rightCount = count - 1 - leftCount;
      const leftTrees = build(leftCount);
      const rightTrees = build(rightCount);
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          result.push(new TreeNode(0, left, right));
        }
      }
    }
    return result;
  }

  return build(n);
}

// 方法2：动态规划
// 自底向上，memo[i] 存储节点数为 i 的所有可能树。
function allPossibleFBTDP(n: number): Array<TreeNode | null> {
  if (n % 2 === 0) return [];

  const memo: Map<number, TreeNode[]> = new Map();
  memo.set(1, [new TreeNode(0)]);

  for (let count = 3; count <= n; count += 2) {
    const trees: TreeNode[] = [];
    for (let leftCount = 1; leftCount < count; leftCount += 2) {
      const rightCount = count - 1 - leftCount;
      const leftTrees = memo.get(leftCount)!;
      const rightTrees = memo.get(rightCount)!;
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // 注意：树节点会被复用，需要深拷贝避免共享引用
          trees.push(new TreeNode(0, deepCopy(left), deepCopy(right)));
        }
      }
    }
    memo.set(count, trees);
  }

  return memo.get(n) || [];
}

// 深拷贝二叉树（用于 DP 方法避免共享子树引用）
function deepCopy(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  return new TreeNode(node.val, deepCopy(node.left), deepCopy(node.right));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 所有可能的真二叉树 =====");

// 辅助函数：序列化树为字符串（用于打印）
function serialize(root: TreeNode | null): string {
  if (root === null) return "null";
  return `[${root.val},${serialize(root.left)},${serialize(root.right)}]`;
}

// 测试1: n = 7
// 真二叉树数量为 catalan(3) = 5
const trees1 = allPossibleFBT(7);
console.log("n=7 时真二叉树数量（递归）:", trees1.length); // 期望 5
for (const t of trees1) {
  console.log("  ", serialize(t));
}

// 测试2: n = 3
// 只有一种：根 + 左右两个叶节点
const trees2 = allPossibleFBT(3);
console.log("n=3 时真二叉树数量:", trees2.length); // 期望 1
console.log("  ", serialize(trees2[0]));

// 测试3: n = 1
const trees3 = allPossibleFBT(1);
console.log("n=1 时真二叉树数量:", trees3.length); // 期望 1

// 测试4: n = 5
const trees4 = allPossibleFBTDP(5);
console.log("n=5 时真二叉树数量（DP）:", trees4.length); // 期望 2

// 测试5: n 为偶数
const trees5 = allPossibleFBT(2);
console.log("n=2（偶数）时真二叉树数量:", trees5.length); // 期望 0

export {};
