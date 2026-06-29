// ============================================================
// 059. 出现次数最多的子树元素和
// ============================================================
// LeetCode 508. Most Frequent Subtree Sum
// 给你一个二叉树的根节点 root，找出并返回所有出现次数最多的子树元素和。
// 子树元素和定义为以该节点为根的子树（包括节点本身）的所有节点值之和。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：DFS后序遍历+哈希表（推荐）
// 后序遍历计算每个子树的和，用哈希表统计每个和出现的次数
// 最后找出出现次数最多的和
function findFrequentTreeSum(root: TreeNode | null): number[] {
  if (root === null) return [];

  const sumCount = new Map<number, number>();
  let maxCount = 0;

  // 后序遍历，返回以 node 为根的子树和
  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    const leftSum = dfs(node.left);
    const rightSum = dfs(node.right);
    const sum = node.val + leftSum + rightSum;
    // 统计该和出现的次数
    const count = (sumCount.get(sum) ?? 0) + 1;
    sumCount.set(sum, count);
    maxCount = Math.max(maxCount, count);
    return sum;
  }

  dfs(root);

  // 收集出现次数等于 maxCount 的和
  const result: number[] = [];
  for (const [sum, count] of sumCount) {
    if (count === maxCount) {
      result.push(sum);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 出现次数最多的子树元素和 =====");
// 构造树: [5,2,-3]
//       5
//      / \
//     2  -3
const tree1 = new TreeNode(5);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(-3);
console.log(
  "测试1:",
  findFrequentTreeSum(tree1).sort((a, b) => a - b),
); // 期望结果 [2,-3,4] 的某种顺序

// 构造树: [5,2,-5]
//       5
//      / \
//     2  -5
const tree2 = new TreeNode(5);
tree2.left = new TreeNode(2);
tree2.right = new TreeNode(-5);
console.log("测试2:", findFrequentTreeSum(tree2)); // 期望结果 [2]

// 构造树: [1]
const tree3 = new TreeNode(1);
console.log("测试3:", findFrequentTreeSum(tree3)); // 期望结果 [1]

// 构造树: [1,1,1]
//       1
//      / \
//     1   1
// 子树和：左叶子1=1，右叶子1=1，根=1+1+1=3；sum 1出现2次（最多）
const tree4 = new TreeNode(1);
tree4.left = new TreeNode(1);
tree4.right = new TreeNode(1);
console.log(
  "测试4:",
  findFrequentTreeSum(tree4).sort((a, b) => a - b),
); // 期望结果 [1]

export {};
