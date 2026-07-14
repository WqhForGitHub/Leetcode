// ============================================================
// 016. 不同的二叉搜索树 II
// ============================================================
// LeetCode 95. Unique Binary Search Trees II
// 给定 n，生成所有由 1...n 组成的结构不同的二叉搜索树。
// 时间复杂度：O(n * C_n)，其中 C_n 为卡特兰数，空间复杂度：O(n) 递归栈

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

// 方法1：递归分治 (推荐)
// 以每个值 i 为根，左子树由 [start, i-1] 构成，右子树由 [i+1, end] 构成
// 时间复杂度 O(n * C_n), 空间复杂度 O(n) 递归栈
function generateTrees(n: number): (TreeNode | null)[] {
  if (n <= 0) return [];
  return generate(1, n);
}

function generate(start: number, end: number): (TreeNode | null)[] {
  const result: (TreeNode | null)[] = [];
  if (start > end) {
    result.push(null);
    return result;
  }

  // 以每个值 i 为根节点
  for (let i = start; i <= end; i++) {
    // 递归生成所有左子树和右子树
    const leftTrees: (TreeNode | null)[] = generate(start, i - 1);
    const rightTrees: (TreeNode | null)[] = generate(i + 1, end);
    // 组合每棵左子树和右子树
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

// 方法2：动态规划
// 利用 dp[i] 表示 1...i 能生成的所有 BST，dp[i] 由 dp[j] (j < i) 推导
// 时间复杂度 O(n * C_n), 空间复杂度 O(n * C_n)
function generateTrees2(n: number): (TreeNode | null)[] {
  if (n <= 0) return [];

  // dp[i] 存储 1..i 能构成的所有 BST
  const dp: (TreeNode | null)[][] = new Array(n + 1).fill(null).map(() => []);
  dp[0] = [null]; // 空树

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      // j 为根节点，左子树有 j-1 个节点，右子树有 i-j 个节点
      for (const left of dp[j - 1]) {
        for (const right of dp[i - j]) {
          const root: TreeNode = new TreeNode(j);
          root.left = cloneTree(left);
          // 右子树需要偏移 j（因为右子树的值在 j+1..i 范围）
          root.right = offsetTree(right, j);
          dp[i].push(root);
        }
      }
    }
  }
  return dp[n];
}

// 克隆树
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  const newNode: TreeNode = new TreeNode(node.val);
  newNode.left = cloneTree(node.left);
  newNode.right = cloneTree(node.right);
  return newNode;
}

// 偏移树中所有节点的值（用于动态规划中右子树的偏移）
function offsetTree(node: TreeNode | null, offset: number): TreeNode | null {
  if (node === null) return null;
  const newNode: TreeNode = new TreeNode(node.val + offset);
  newNode.left = offsetTree(node.left, offset);
  newNode.right = offsetTree(node.right, offset);
  return newNode;
}

// ============================================================
// 辅助函数：前序遍历打印树（用于测试验证）
// ============================================================
function treeToArray(root: TreeNode | null): number[] {
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node: TreeNode | null = queue.shift()!;
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
  return result as number[];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 不同的二叉搜索树 II =====");
const trees1: (TreeNode | null)[] = generateTrees(3);
console.log(`generateTrees(3) 生成的树的数量: ${trees1.length}`); // 期望结果: 5
console.log(trees1.map((t) => treeToArray(t)));

const trees2: (TreeNode | null)[] = generateTrees2(3);
console.log(`generateTrees2(3) 生成的树的数量: ${trees2.length}`); // 期望结果: 5
console.log(trees2.map((t) => treeToArray(t)));

const trees3: (TreeNode | null)[] = generateTrees(1);
console.log(`generateTrees(1) 生成的树的数量: ${trees3.length}`); // 期望结果: 1

export {};
