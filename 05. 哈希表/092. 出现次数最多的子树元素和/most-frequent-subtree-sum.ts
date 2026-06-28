// ============================================================
// 092. 出现次数最多的子树元素和
// ============================================================
// LeetCode 508. Most Frequent Subtree Sum
// 给你一棵二叉树的根节点 root，请你返回出现次数最多的子树元素和。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 内联定义二叉树节点
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

// 哈希表记录每个子树和出现的次数
const sumCount = new Map<number, number>();
let maxFreq = 0;

function findFrequentTreeSum(root: TreeNode | null): number[] {
  sumCount.clear();
  maxFreq = 0;
  dfs(root);
  const result: number[] = [];
  for (const [sum, freq] of sumCount) {
    if (freq === maxFreq) result.push(sum);
  }
  return result;
}

// 后序遍历：先递归左右子树，再计算当前子树和
function dfs(node: TreeNode | null): number {
  if (node === null) return 0;
  const left = dfs(node.left);
  const right = dfs(node.right);
  const sum = node.val + left + right;
  const freq = (sumCount.get(sum) ?? 0) + 1;
  sumCount.set(sum, freq);
  if (freq > maxFreq) maxFreq = freq;
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 出现次数最多的子树元素和 =====");
// 测试 1: [5,2,-3] -> [2,-3,4]
//   子树和: 2, -3, 5+2-3=4，均出现 1 次
const t1 = new TreeNode(5, new TreeNode(2), new TreeNode(-3));
console.log(findFrequentTreeSum(t1).sort((a, b) => a - b));
// 测试 2: [5,2,-5] -> [2]
//   子树和: 2, -5, 5+2-5=2，2 出现 2 次
const t2 = new TreeNode(5, new TreeNode(2), new TreeNode(-5));
console.log(findFrequentTreeSum(t2));
// 测试 3: 单节点 [1] -> [1]
const t3 = new TreeNode(1);
console.log(findFrequentTreeSum(t3));

export {};
