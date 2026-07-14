// ============================================================
// 017. 路径总和 II
// ============================================================
// LeetCode 113. Path Sum II
// 给定二叉树和目标和 targetSum，返回所有从根到叶子节点路径，使得路径和等于 targetSum。
// 时间复杂度：O(N^2)，空间复杂度：O(N)

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

// 从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = new TreeNode(arr[0]);
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

// 方法1：DFS 回溯 (推荐)
// 深度优先搜索，维护当前路径，到达叶子节点时检查路径和
// 时间复杂度 O(N^2)（最坏情况每条路径都需要复制），空间复杂度 O(N) 递归栈
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function dfs(node: TreeNode | null, remaining: number): void {
    if (node === null) return;

    // 将当前节点加入路径
    path.push(node.val);

    // 如果是叶子节点，检查是否满足目标和
    if (node.left === null && node.right === null) {
      if (remaining === node.val) {
        result.push([...path]); // 复制路径
      }
    } else {
      // 递归左右子树
      dfs(node.left, remaining - node.val);
      dfs(node.right, remaining - node.val);
    }

    // 回溯，移除当前节点
    path.pop();
  }

  dfs(root, targetSum);
  return result;
}

// 方法2：BFS + 路径记录
// 使用广度优先搜索，每个节点记录从根到该节点的路径
// 时间复杂度 O(N^2), 空间复杂度 O(N^2)
function pathSum2(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  if (root === null) return result;

  // 队列存储节点和对应的路径
  const queue: { node: TreeNode; path: number[]; sum: number }[] = [
    { node: root, path: [root.val], sum: root.val },
  ];

  while (queue.length > 0) {
    const { node, path, sum }: { node: TreeNode; path: number[]; sum: number } = queue.shift()!;

    // 叶子节点，检查路径和
    if (node.left === null && node.right === null) {
      if (sum === targetSum) {
        result.push([...path]);
      }
    }

    // 将左右子节点入队
    if (node.left !== null) {
      queue.push({
        node: node.left,
        path: [...path, node.left.val],
        sum: sum + node.left.val,
      });
    }
    if (node.right !== null) {
      queue.push({
        node: node.right,
        path: [...path, node.right.val],
        sum: sum + node.right.val,
      });
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 路径总和 II =====");
const tree1: TreeNode | null = buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]);
console.log(pathSum(tree1, 22)); // 期望结果: [[5,4,11,2],[5,8,4,5]]
console.log(pathSum2(tree1, 22)); // 期望结果: [[5,4,11,2],[5,8,4,5]]

const tree2: TreeNode | null = buildTree([1, 2, 3]);
console.log(pathSum(tree2, 3)); // 期望结果: []

const tree3: TreeNode | null = buildTree([1, 2]);
console.log(pathSum(tree3, 1)); // 期望结果: []

export {};
