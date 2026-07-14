// ============================================================
// 054. 打家劫舍 III
// ============================================================
// LeetCode 337. House Robber III
// 小偷发现了一个可利用的住宅区，这个地区的所有房屋排列类似于一棵二叉树。
// 如果两个直接相连的房子在同一天晚上被打劫，将自动报警。
// 计算在不触动警报的情况下，小偷一晚能够盗取的最高金额。
// 时间复杂度 O(n)，空间复杂度 O(h)

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

// 方法1：动态规划 / 后序遍历（推荐）
// 对每个节点返回两个值：[偷当前节点的最大值, 不偷当前节点的最大值]
// 状态转移：
//   偷当前节点 = 当前节点值 + 左子树不偷的最大值 + 右子树不偷的最大值
//   不偷当前节点 = max(左子树偷, 左子树不偷) + max(右子树偷, 右子树不偷)
// 时间复杂度 O(n)，空间复杂度 O(h)，h 为树高
function rob(root: TreeNode | null): number {
  // 后序遍历，返回 [偷当前节点的最大收益, 不偷当前节点的最大收益]
  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [0, 0];

    // 先递归处理左右子树
    const left: [number, number] = dfs(node.left);
    const right: [number, number] = dfs(node.right);

    // 偷当前节点：不能偷左右子节点，所以加上左右子树"不偷"的值
    const robCurrent: number = node.val + left[1] + right[1];

    // 不偷当前节点：左右子节点可偷可不偷，各自取最大值
    const notRobCurrent: number = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    return [robCurrent, notRobCurrent];
  }

  const result: [number, number] = dfs(root);
  // 返回偷或不偷中的较大值
  return Math.max(result[0], result[1]);
}

// 方法2：记忆化递归（可选）
// 用 Map 缓存每个节点的计算结果，避免重复递归
// 时间复杂度 O(n)，空间复杂度 O(n)
function rob2(root: TreeNode | null): number {
  const memo: Map<TreeNode, number> = new Map();

  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    if (memo.has(node)) return memo.get(node)!;

    // 偷当前节点：跳过直接子节点，偷孙子节点
    let rob: number = node.val;
    if (node.left) {
      rob += dfs(node.left.left) + dfs(node.left.right);
    }
    if (node.right) {
      rob += dfs(node.right.left) + dfs(node.right.right);
    }

    // 不偷当前节点：偷子节点
    const notRob: number = dfs(node.left) + dfs(node.right);

    const maxVal: number = Math.max(rob, notRob);
    memo.set(node, maxVal);
    return maxVal;
  }

  return dfs(root);
}

// 辅助函数：从 LeetCode 数组格式构建二叉树
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = new TreeNode(arr[0]!);
  const queue: TreeNode[] = [root];
  let i: number = 1;
  while (queue.length > 0 && i < arr.length) {
    const node: TreeNode = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 打家劫舍 III =====");
console.log(rob(buildTree([3, 2, 3, null, 3, null, 1]))); // 期望结果: 7 (3 + 3 + 1)
console.log(rob(buildTree([3, 4, 5, 1, 3, null, 1]))); // 期望结果: 9 (4 + 5)
console.log(rob(buildTree([1]))); // 期望结果: 1
console.log(rob2(buildTree([3, 2, 3, null, 3, null, 1]))); // 期望结果: 7

export {};
