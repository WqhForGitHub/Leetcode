// ============================================================
// 024. 二叉树的所有路径
// ============================================================
// LeetCode 257. Binary Tree Paths
// 给定二叉树，返回所有从根节点到叶子节点的路径，格式为 "1->2->3"。
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
// 深度优先搜索，维护当前路径，到达叶子节点时将路径转为字符串
// 时间复杂度 O(N^2)（每条路径需要构建字符串），空间复杂度 O(N) 递归栈
function binaryTreePaths(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (root === null) return result;

  const path: number[] = [];

  function dfs(node: TreeNode): void {
    path.push(node.val);

    // 叶子节点：将路径转为字符串
    if (node.left === null && node.right === null) {
      result.push(path.join("->"));
    } else {
      if (node.left !== null) dfs(node.left);
      if (node.right !== null) dfs(node.right);
    }

    // 回溯
    path.pop();
  }

  dfs(root);
  return result;
}

// 方法2：BFS 队列
// 使用广度优先搜索，每个节点维护从根到该节点的路径字符串
// 时间复杂度 O(N^2), 空间复杂度 O(N^2)
function binaryTreePaths2(root: TreeNode | null): string[] {
  const result: string[] = [];
  if (root === null) return result;

  // 队列存储节点和对应路径
  const queue: { node: TreeNode; path: string }[] = [{ node: root, path: String(root.val) }];

  while (queue.length > 0) {
    const { node, path }: { node: TreeNode; path: string } = queue.shift()!;

    // 叶子节点
    if (node.left === null && node.right === null) {
      result.push(path);
    }

    // 将左右子节点入队
    if (node.left !== null) {
      queue.push({ node: node.left, path: path + "->" + node.left.val });
    }
    if (node.right !== null) {
      queue.push({ node: node.right, path: path + "->" + node.right.val });
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 二叉树的所有路径 =====");
const tree1: TreeNode | null = buildTree([1, 2, 3, null, 5]);
console.log(binaryTreePaths(tree1)); // 期望结果: ["1->2->5","1->3"]
console.log(binaryTreePaths2(tree1)); // 期望结果: ["1->2->5","1->3"]

const tree2: TreeNode | null = buildTree([1]);
console.log(binaryTreePaths(tree2)); // 期望结果: ["1"]
console.log(binaryTreePaths2(tree2)); // 期望结果: ["1"]

export {};
