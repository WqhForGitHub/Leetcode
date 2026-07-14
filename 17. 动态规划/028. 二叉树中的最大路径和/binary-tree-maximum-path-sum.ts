// ============================================================
// 028. 二叉树中的最大路径和
// ============================================================
// LeetCode 124. Binary Tree Maximum Path Sum
// 二叉树中任意节点到任意节点的路径最大和。
// 时间复杂度 O(n)，空间复杂度 O(h)，h 为树高

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

// 方法1：动态规划/后序遍历递归（推荐）
// 对每个节点，计算以该节点为最高点的最大路径和
// 同时计算以该节点为端点向下延伸的最大贡献值
// 时间复杂度 O(n)，空间复杂度 O(h)
function maxPathSum(root: TreeNode | null): number {
  let maxSum: number = -Infinity;

  // 返回以 node 为端点向下的最大贡献值
  function maxGain(node: TreeNode | null): number {
    if (node === null) return 0;

    // 递归计算左右子树的最大贡献值
    const leftGain: number = Math.max(maxGain(node.left), 0);
    const rightGain: number = Math.max(maxGain(node.right), 0);

    // 以当前节点为最高点的路径和
    const currentPathSum: number = node.val + leftGain + rightGain;
    // 更新全局最大路径和
    maxSum = Math.max(maxSum, currentPathSum);

    // 返回以当前节点向下的最大贡献值（只能选左或右一条路）
    return node.val + Math.max(leftGain, rightGain);
  }

  maxGain(root);
  return maxSum;
}

// 方法2：后序遍历迭代法
// 使用栈进行后序遍历，逻辑与方法1相同
// 时间复杂度 O(n)，空间复杂度 O(h)
function maxPathSum2(root: TreeNode | null): number {
  if (root === null) return 0;

  let maxSum: number = -Infinity;
  // gainMap 存储每个节点的最大贡献值
  const gainMap: Map<TreeNode, number> = new Map();
  const stack: TreeNode[] = [];
  let node: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (stack.length > 0 || node !== null) {
    if (node !== null) {
      // 先走到最左
      stack.push(node);
      node = node.left;
    } else {
      const peekNode: TreeNode = stack[stack.length - 1];
      if (peekNode.right !== null && peekNode.right !== lastVisited) {
        // 右子树还没访问
        node = peekNode.right;
      } else {
        // 访问当前节点
        const curr: TreeNode = stack.pop()!;
        const leftGain: number = Math.max(curr.left ? (gainMap.get(curr.left) ?? 0) : 0, 0);
        const rightGain: number = Math.max(curr.right ? (gainMap.get(curr.right) ?? 0) : 0, 0);
        // 以当前节点为最高点的路径和
        maxSum = Math.max(maxSum, curr.val + leftGain + rightGain);
        // 记录当前节点的最大贡献值
        gainMap.set(curr, curr.val + Math.max(leftGain, rightGain));
        lastVisited = curr;
      }
    }
  }

  return maxSum;
}

// ============================================================
// 辅助函数：根据数组构建二叉树
// ============================================================
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i: number = 1;
  while (queue.length > 0 && i < arr.length) {
    const node: TreeNode = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 二叉树中的最大路径和 =====");
console.log(maxPathSum(buildTree([1, 2, 3]))); // 期望结果: 6
console.log(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7]))); // 期望结果: 42
console.log(maxPathSum(buildTree([-3]))); // 期望结果: -3
console.log(maxPathSum2(buildTree([1, 2, 3]))); // 期望结果: 6
console.log(maxPathSum2(buildTree([-10, 9, 20, null, null, 15, 7]))); // 期望结果: 42

export {};
