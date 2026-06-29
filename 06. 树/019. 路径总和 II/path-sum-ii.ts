// ============================================================
// 019. 路径总和 II
// ============================================================
// LeetCode 113. Path Sum II
// 给你二叉树的根节点 root 和一个整数 targetSum，找出所有从根节点到叶子节点路径总和等于给定目标和的路径。
// 时间复杂度：O(n^2)，空间复杂度：O(n)

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

// 方法1：DFS 回溯（推荐）
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function dfs(node: TreeNode | null, remaining: number): void {
    if (node === null) return;
    path.push(node.val);
    // 叶子节点判断
    if (node.left === null && node.right === null && remaining === node.val) {
      result.push([...path]);
    } else {
      dfs(node.left, remaining - node.val);
      dfs(node.right, remaining - node.val);
    }
    // 回溯
    path.pop();
  }

  dfs(root, targetSum);
  return result;
}

// 方法2：BFS（使用父节点映射记录路径）
function pathSumBFS(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  if (root === null) return result;
  // 队列存节点和到该节点的累计和
  const queue: { node: TreeNode; sum: number }[] = [{ node: root, sum: root.val }];
  // 父节点映射，用于回溯路径
  const parentMap = new Map<TreeNode, TreeNode | null>();
  parentMap.set(root, null);

  while (queue.length > 0) {
    const { node, sum } = queue.shift()!;
    // 叶子节点
    if (node.left === null && node.right === null && sum === targetSum) {
      // 回溯路径
      const path: number[] = [];
      let curr: TreeNode | null = node;
      while (curr !== null) {
        path.unshift(curr.val);
        curr = parentMap.get(curr) ?? null;
      }
      result.push(path);
    }
    if (node.left !== null) {
      parentMap.set(node.left, node);
      queue.push({ node: node.left, sum: sum + node.left.val });
    }
    if (node.right !== null) {
      parentMap.set(node.right, node);
      queue.push({ node: node.right, sum: sum + node.right.val });
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 路径总和 II =====");
// 树: [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum=22
const tree019 = new TreeNode(
  5,
  new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
  new TreeNode(8, new TreeNode(13), new TreeNode(4, new TreeNode(5), new TreeNode(1)))
);
console.log("DFS targetSum=22:", JSON.stringify(pathSum(tree019, 22))); // [[5,4,11,2],[5,8,4,5]]
console.log("BFS targetSum=22:", JSON.stringify(pathSumBFS(tree019, 22))); // [[5,4,11,2],[5,8,4,5]]

console.log("空树:", JSON.stringify(pathSum(null, 1))); // []
console.log("空树:", JSON.stringify(pathSumBFS(null, 1))); // []

// 单节点树
const single019 = new TreeNode(1);
console.log("单节点 targetSum=1:", JSON.stringify(pathSum(single019, 1))); // [[1]]
console.log("单节点 targetSum=1:", JSON.stringify(pathSumBFS(single019, 1))); // [[1]]

export {};
