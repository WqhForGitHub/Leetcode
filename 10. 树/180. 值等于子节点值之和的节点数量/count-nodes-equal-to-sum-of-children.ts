// ============================================================
// 180. 值等于子节点值之和的节点数量
// ============================================================
// LeetCode 2277. Count Nodes Equal to Sum of Children
// 给定一棵二叉树的根节点 root，返回值等于其所有子节点值之和的节点数量。
// 时间复杂度：O(n)，空间复杂度：O(h)

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

// 方法1：DFS后序遍历（推荐）
// 遍历树，对于每个节点，计算其子节点值之和
// 若节点值等于子节点值之和，计数 +1
function countNodesEqualToSumOfChildren(root: TreeNode | null): number {
  let count = 0;
  dfs(root);
  return count;

  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    // 计算子节点值之和
    const leftVal = node.left !== null ? node.left.val : 0;
    const rightVal = node.right !== null ? node.right.val : 0;
    const childSum = leftVal + rightVal;
    // 判断是否相等（叶子节点子节点和为 0，除非节点值也是 0）
    if (node.val === childSum) {
      count++;
    }
    // 递归处理子树
    dfs(node.left);
    dfs(node.right);
  }
}

// 方法2：BFS层序遍历
function countNodesBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let count = 0;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    const leftVal = node.left !== null ? node.left.val : 0;
    const rightVal = node.right !== null ? node.right.val : 0;
    if (node.val === leftVal + rightVal) {
      count++;
    }
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return count;
}

// 方法3：递归返回计数
function countNodesRecursive(root: TreeNode | null): number {
  if (root === null) return 0;
  const leftVal = root.left !== null ? root.left.val : 0;
  const rightVal = root.right !== null ? root.right.val : 0;
  const current = root.val === leftVal + rightVal ? 1 : 0;
  return current + countNodesRecursive(root.left) + countNodesRecursive(root.right);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 180. 值等于子节点值之和的节点数量 =====");

// 测试1:
//       10
//      /  \
//     4    6   -> 10 = 4+6, 计数
//    / \    \
//   2   2    6  -> 4 = 2+2, 计数; 6 != 0+6
const t1 = new TreeNode(10);
t1.left = new TreeNode(4);
t1.right = new TreeNode(6);
t1.left.left = new TreeNode(2);
t1.left.right = new TreeNode(2);
t1.right.right = new TreeNode(6);
console.log("测试1 DFS后序:", countNodesEqualToSumOfChildren(t1)); // 2 (节点10和4)
console.log("测试1 BFS:", countNodesBFS(t1)); // 2
console.log("测试1 递归:", countNodesRecursive(t1)); // 2

// 测试2:
//       5
//      / \
//     3   2  -> 5 = 3+2, 计数
//    / \
//   1   2   -> 3 = 1+2, 计数
const t2 = new TreeNode(5);
t2.left = new TreeNode(3);
t2.right = new TreeNode(2);
t2.left.left = new TreeNode(1);
t2.left.right = new TreeNode(2);
console.log("测试2 DFS后序:", countNodesEqualToSumOfChildren(t2)); // 2
console.log("测试2 BFS:", countNodesBFS(t2)); // 2

// 测试3: 单节点（叶子节点，子节点和=0）
// 若节点值=0则计数，否则不计数
const t3 = new TreeNode(0);
console.log("测试3 单节点0:", countNodesEqualToSumOfChildren(t3)); // 1 (0==0)
const t3b = new TreeNode(5);
console.log("测试3b 单节点5:", countNodesEqualToSumOfChildren(t3b)); // 0

// 测试4: 空树
console.log("测试4 空树:", countNodesEqualToSumOfChildren(null)); // 0

// 测试5: 所有节点都满足
//       3
//      / \
//     1   2  -> 3=1+2 ✓
//    / \
//   0   1   -> 1=0+1 ✓
const t5 = new TreeNode(3);
t5.left = new TreeNode(1);
t5.right = new TreeNode(2);
t5.left.left = new TreeNode(0);
t5.left.right = new TreeNode(1);
console.log("测试5:", countNodesEqualToSumOfChildren(t5)); // 2

export {};
