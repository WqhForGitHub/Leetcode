// ============================================================
// 133. 删除树节点
// ============================================================
// LeetCode 1110 变体. Delete Tree Node
// 给定一个二叉树和一个目标值 target，删除树中所有值为 target 的节点，
// 返回剩余节点组成的森林。
// 时间复杂度：O(n)，空间复杂度：O(n + h)

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

// 方法1：DFS递归+集合
// 与 LC1110 相同思路，但 to_delete 为单个值
// 后序遍历：先处理子节点，再处理当前节点
// 若当前节点被删除，其子节点（若存在）成为新树的根，加入结果
function deleteTreeNodes(
  root: TreeNode | null,
  target: number
): TreeNode[] {
  const result: TreeNode[] = [];

  function dfs(node: TreeNode | null, isRoot: boolean): TreeNode | null {
    if (node === null) return null;

    const deleted = node.val === target;
    node.left = dfs(node.left, deleted);
    node.right = dfs(node.right, deleted);

    if (deleted) {
      return null;
    }
    if (isRoot) {
      result.push(node);
    }
    return node;
  }

  dfs(root, true);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 删除树节点 =====");

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

// 测试1: root = [1,2,3,4,5,6,7], target = 3
console.log("测试1:", deleteTreeNodes(buildTree([1, 2, 3, 4, 5, 6, 7]), 3).map(treeToArray));
// 删除3后：6,7成为新树，原树变为 [1,2,null,4,5]
// 期望 [[1,2,null,4,5],[6],[7]]

// 测试2: root = [1,2,3,4,5,6,7], target = 1
// 删除根节点1，子树2和3成为根
console.log("测试2:", deleteTreeNodes(buildTree([1, 2, 3, 4, 5, 6, 7]), 1).map(treeToArray));
// 期望 [[2,4,5],[3,6,7]]

// 测试3: root = [1,2,3,4,5,6,7], target = 9 (无匹配)
console.log("测试3:", deleteTreeNodes(buildTree([1, 2, 3, 4, 5, 6, 7]), 9).map(treeToArray));
// 期望 [[1,2,3,4,5,6,7]]

export {};
