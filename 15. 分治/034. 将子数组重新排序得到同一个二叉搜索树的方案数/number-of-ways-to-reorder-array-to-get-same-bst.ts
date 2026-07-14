// ============================================================
// 034. 将子数组重新排序得到同一个二叉搜索树的方案数
// ============================================================
// LeetCode 1569. Number of Ways to Reorder Array to Get Same BST
// 给定数组 nums，nums 的所有元素互不相同。
// 统计能重新排列 nums 使得得到相同 BST 的方案数，结果对 10^9+7 取模。
// 注意：第一个元素必须保持原样（BST 的根）。
// 时间复杂度：O(n^2), 空间复杂度：O(n^2)

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

const MOD: number = 1e9 + 7;
const MAXN: number = 1001;

// 预计算组合数 C(n, r) mod p
const C: number[][] = (() => {
  const c: number[][] = Array.from({ length: MAXN }, () => new Array(MAXN).fill(0));
  for (let i: number = 0; i < MAXN; i++) {
    c[i][0] = 1;
    for (let j: number = 1; j <= i; j++) {
      c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % MOD;
    }
  }
  return c;
})();

// 方法1：分治递归（推荐）
// 根为 nums[0]，划分左右子序列，方案数 = C(n-1, leftLen) * ways(left) * ways(right)
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)（组合数表）
function numOfWays(nums: number[]): number {
  // 对子数组 nums[l..r] 计算形成相同 BST 的方案数（含自身一种）
  function dfs(arr: number[]): number {
    const n: number = arr.length;
    if (n <= 2) return 1;

    const root: number = arr[0];
    const left: number[] = [];
    const right: number[] = [];
    for (let i: number = 1; i < n; i++) {
      if (arr[i] < root) left.push(arr[i]);
      else right.push(arr[i]);
    }

    const leftWays: number = dfs(left);
    const rightWays: number = dfs(right);
    const leftLen: number = left.length;

    // 在 n-1 个位置中选 leftLen 个给左子树
    const comb: number = C[n - 1][leftLen];
    const result: number = (((comb * leftWays) % MOD) * rightWays) % MOD;
    return result;
  }

  // 题目要求：方案数减 1（排除原排列本身）
  const total: number = dfs(nums);
  return (total - 1 + MOD) % MOD;
}

// 方法2：分治递归 + 显式构建 BST（验证用）
// 同样的递推公式，但额外构建出 BST 用于理解
function numOfWaysBuild(nums: number[]): number {
  // 构建 BST（仅用于辅助理解）
  function insert(root: TreeNode | null, val: number): TreeNode {
    if (root === null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
  }
  let bst: TreeNode | null = null;
  for (const v of nums) bst = insert(bst, v);

  // 递归计算方案数（与方法1相同逻辑）
  function dfs(arr: number[]): number {
    const n: number = arr.length;
    if (n <= 2) return 1;
    const root: number = arr[0];
    const left: number[] = [];
    const right: number[] = [];
    for (let i: number = 1; i < n; i++) {
      if (arr[i] < root) left.push(arr[i]);
      else right.push(arr[i]);
    }
    const leftWays: number = dfs(left);
    const rightWays: number = dfs(right);
    const leftLen: number = left.length;
    const comb: number = C[n - 1][leftLen];
    return (((comb * leftWays) % MOD) * rightWays) % MOD;
  }

  const total: number = dfs(nums);
  return (total - 1 + MOD) % MOD;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 将子数组重新排序得到同一个二叉搜索树的方案数 =====");
console.log(numOfWays([2, 1, 3])); // 期望结果: 1
console.log(numOfWays([3, 4, 5, 1, 2])); // 期望结果: 5
console.log(numOfWays([1, 2, 3])); // 期望结果: 0
console.log(numOfWays([3, 1, 2, 5, 4, 6])); // 期望结果: 19
console.log("--- 方法2测试 ---");
console.log(numOfWaysBuild([2, 1, 3])); // 期望结果: 1
console.log(numOfWaysBuild([3, 4, 5, 1, 2])); // 期望结果: 5
console.log(numOfWaysBuild([1, 2, 3])); // 期望结果: 0

export {};
