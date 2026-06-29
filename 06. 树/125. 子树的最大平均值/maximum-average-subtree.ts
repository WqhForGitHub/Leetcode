// ============================================================
// 125. 子树的最大平均值
// ============================================================
// LeetCode 1120. Maximum Average Subtree
// 给定一棵二叉树的根节点 root，返回子树中最大的平均值。
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

// 方法1：DFS后序遍历返回 {sum, count}
// 后序遍历：先得到左右子树的 (sum, count)，再计算当前子树的 sum 和 count
// 计算当前子树平均值并更新全局最大值
let maxAvg: number;
function maximumAverageSubtree(root: TreeNode | null): number {
  maxAvg = 0;
  dfs(root);
  return maxAvg;
}

// 返回 [子树和, 子树节点数]
function dfs(node: TreeNode | null): [number, number] {
  if (node === null) return [0, 0];
  const [leftSum, leftCnt] = dfs(node.left);
  const [rightSum, rightCnt] = dfs(node.right);

  const sum = leftSum + rightSum + node.val;
  const count = leftCnt + rightCnt + 1;
  const avg = sum / count;
  if (avg > maxAvg) maxAvg = avg;
  return [sum, count];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 子树的最大平均值 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(leftVal) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(rightVal) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: root = [5,6,1]
// 子树 [6] 平均值 6，子树 [1] 平均值 1，子树 [5,6,1] 平均值 4
// 最大平均值为 6
console.log("测试1:", maximumAverageSubtree(buildTree([5, 6, 1]))); // 期望 6

// 测试2: root = [0,null,1]
// 子树 [1] 平均值 1，子树 [0,null,1] 平均值 0.5
// 最大平均值为 1
console.log("测试2:", maximumAverageSubtree(buildTree([0, null, 1]))); // 期望 1

// 测试3: 单节点 [1]
console.log("测试3:", maximumAverageSubtree(buildTree([1]))); // 期望 1

export {};
