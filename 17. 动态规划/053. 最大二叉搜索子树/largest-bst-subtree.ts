// ============================================================
// 053. 最大二叉搜索子树
// ============================================================
// LeetCode 333. Largest BST Subtree
// 给定一个二叉树，找到最大的 BST（二叉搜索树）子树的节点数。
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

// 方法1：后序遍历 + 动态规划（推荐）
// 后序遍历每个子树，返回子树的最小值、最大值、节点数、是否为 BST
// 利用子树信息判断当前树是否为 BST，并更新最大 BST 子树大小
// 时间复杂度 O(n)，空间复杂度 O(h)，h 为树高
function largestBSTSubtree(root: TreeNode | null): number {
  let result: number = 0;

  // 后序遍历返回子树信息
  // 返回值: { min: 子树最小值, max: 子树最大值, size: 节点数, isBST: 是否为BST }
  function dfs(node: TreeNode | null): {
    min: number;
    max: number;
    size: number;
    isBST: boolean;
  } {
    // 空节点：是 BST，大小为 0，min 为正无穷，max 为负无穷
    if (node === null) {
      return { min: Infinity, max: -Infinity, size: 0, isBST: true };
    }

    // 后序遍历：先递归左右子树
    const left = dfs(node.left);
    const right = dfs(node.right);

    // 判断当前子树是否为 BST
    // 条件：左右子树都是 BST，且当前节点值 > 左子树最大值，< 右子树最小值
    if (left.isBST && right.isBST && node.val > left.max && node.val < right.min) {
      const size: number = left.size + right.size + 1;
      // 更新全局最大值
      result = Math.max(result, size);
      // 返回当前子树信息
      return {
        min: left.size === 0 ? node.val : left.min,
        max: right.size === 0 ? node.val : right.max,
        size: size,
        isBST: true,
      };
    } else {
      // 不是 BST，返回无效信息
      return { min: 0, max: 0, size: 0, isBST: false };
    }
  }

  dfs(root);
  return result;
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
console.log("===== 053. 最大二叉搜索子树 =====");
console.log(largestBSTSubtree(buildTree([10, 5, 15, 1, 8, null, 7]))); // 期望结果: 3 (子树 5->1,8)
console.log(
  largestBSTSubtree(buildTree([4, 2, 7, 2, 3, 5, null, 2, null, null, null, null, null, 1])),
); // 期望结果: 2
console.log(largestBSTSubtree(null)); // 期望结果: 0
console.log(largestBSTSubtree(buildTree([1, 2, 3]))); // 期望结果: 2 (子树 2 或 3)

export {};
