// ============================================================
// 160. 将子数组重新排序得到同一个二叉搜索树的方案数
// ============================================================
// LeetCode 1569. Number of Ways to Reorder Array to Get Same BST
// 给定一个数组 nums，它表示二叉搜索树的前序遍历。
// 返回重新排列 nums 使得得到的 BST 相同的方案数（对 10^9+7 取模）。
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)

const MOD = 1e9 + 7;

// 方法1：递归分治 + 组合数
// 思路：BST 的根是数组的第一个元素。
// 数组中比根小的元素构成左子树的前序，比根大的元素构成右子树的前序。
// 在保持左右两组内部相对顺序的前提下，可以把它们交错合并。
// 合并方案数 = C(left+right, left) * 方案(左) * 方案(右)
// 当数组长度 <= 1 时方案数为 1
function numOfWays(nums: number[]): number {
  const n = nums.length;
  // 预处理组合数表 C[i][j]
  const C: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    C[i][0] = 1;
    for (let j = 1; j <= i; j++) {
      C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
  }

  function dfs(arr: number[]): number {
    if (arr.length <= 1) return 1;
    const root = arr[0];
    const left: number[] = [];
    const right: number[] = [];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < root) left.push(arr[i]);
      else right.push(arr[i]);
    }
    const l = left.length;
    const r = right.length;
    // C(l+r, l) * dfs(left) * dfs(right)
    const ways = (((C[l + r][l] * dfs(left)) % MOD) * dfs(right)) % MOD;
    return ways;
  }

  // 题目要求减去原始顺序本身（即答案 - 1）
  return (dfs(nums) - 1 + MOD) % MOD;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 将子数组重新排序得到同一个二叉搜索树的方案数 =====");

// 测试1: nums=[3,4,5,1,2]
// 原BST: 3 是根，左子树 [1,2]，右子树 [4,5]
// 方案数（含原顺序）= C(2,1) * 1 * 1 = 2，减1 = 1
console.log("测试1:", numOfWays([3, 4, 5, 1, 2])); // 期望 1

// 测试2: nums=[1,2,3]
// 1 是根，左子树空，右子树 [2,3]，方案数 = 1
console.log("测试2:", numOfWays([1, 2, 3])); // 期望 0

// 测试3: nums=[9,4,2,1,3,6,5,7,8,14,11,10,12,13,16,15,17,18]
console.log("测试3:", numOfWays([9, 4, 2, 1, 3, 6, 5, 7, 8, 14, 11, 10, 12, 13, 16, 15, 17, 18])); // 期望 221109596

// 测试4: nums=[2,1,3]
// 2 是根，左 [1]，右 [3]，方案数 1 -> 减 1 = 0
console.log("测试4:", numOfWays([2, 1, 3])); // 期望 0

export {};
