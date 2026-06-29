// ============================================================
// 122. 根到叶路径上的不足节点
// ============================================================
// LeetCode 1080. Insufficient Nodes in Root to Leaf Paths
// 给定一棵二叉树的根节点 root 和一个整数 limit，请删除所有"不足节点"。
// 不足节点是指从根到该节点的路径上所有节点值之和小于 limit 的叶节点路径上的节点。
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

// 方法1：DFS递归后序剪枝
// 自底向上判断：如果一个节点是叶节点，判断从根到它的路径和是否 < limit
// 若 < limit，则该叶节点是不足节点，返回 null（被删除）
// 对于内部节点，递归处理左右子树，如果处理后左右子树都为 null，
// 说明该节点也变成了叶节点，需要再次判断它是否为不足节点
function sufficientSubset(
  root: TreeNode | null,
  limit: number
): TreeNode | null {
  // 返回该节点经过剪枝后是否仍然存在（即从根到该节点的路径上存在某个叶节点路径和 >= limit）
  // 用一个辅助函数返回处理后的节点
  const result = dfs(root, 0, limit);
  return result;
}

function dfs(
  node: TreeNode | null,
  parentSum: number,
  limit: number
): TreeNode | null {
  if (node === null) return null;

  const currSum = parentSum + node.val;

  // 如果是叶节点
  if (node.left === null && node.right === null) {
    // 如果路径和 < limit，该叶节点不足，删除
    if (currSum < limit) return null;
    return node;
  }

  // 递归处理子树
  node.left = dfs(node.left, currSum, limit);
  node.right = dfs(node.right, currSum, limit);

  // 如果处理后该节点变成叶节点（左右子树都被删除），
  // 说明通过该节点的所有路径都不足，该节点也应被删除
  if (node.left === null && node.right === null) {
    return null;
  }
  return node;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 根到叶路径上的不足节点 =====");

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

// 辅助函数：树转数组（层序）
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: root = [1,2,3,4,-99,-99,7,8,9,-99,-99,12,13,-99,14], limit = 1
// 删除所有路径和 < 1 的叶节点路径上的节点
console.log(
  "测试1:",
  treeToArray(
    sufficientSubset(
      buildTree([
        1, 2, 3, 4, -99, -99, 7, 8, 9, -99, -99, 12, 13, -99, 14,
      ]),
      1
    )
  )
);
// 期望 [1,2,3,4,null,null,7,8,null,null,12,null,13,null,14]

// 测试2: root = [5,4,8,11,null,17,4,7,1,null,null,null,2], limit = 22
console.log(
  "测试2:",
  treeToArray(
    sufficientSubset(
      buildTree([5, 4, 8, 11, null, 17, 4, 7, 1, null, null, null, 2]),
      22
    )
  )
);
// 期望 [5,4,8,11,null,17,4,7,null,null,null,2]

// 测试3: root = [1,2,-3,-5,null,4,null], limit = -1
console.log(
  "测试3:",
  treeToArray(
    sufficientSubset(buildTree([1, 2, -3, -5, null, 4, null]), -1)
  )
);
// 期望 [1,null,-3,4]

export {};
