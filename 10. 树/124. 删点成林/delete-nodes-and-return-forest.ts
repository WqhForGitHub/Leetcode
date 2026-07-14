// ============================================================
// 124. 删点成林
// ============================================================
// LeetCode 1110. Delete Nodes And Return Forest
// 给出二叉树的根节点 root 和一个整数数组 to_delete，
// 删除所有值为 to_delete[i] 的节点，最后返回删除后剩下的森林。
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
// 使用集合存储待删除值，便于 O(1) 查询
// 后序遍历：先处理子节点，再处理当前节点
// 若当前节点被删除，其子节点（若存在）成为新树的根，加入结果
// 使用 isRoot 标记当前节点是否为某棵树的根（即父节点已被删除或是整棵树的根）
function delNodes(root: TreeNode | null, to_delete: number[]): TreeNode[] {
  const toDelete = new Set<number>(to_delete);
  const result: TreeNode[] = [];

  function dfs(node: TreeNode | null, isRoot: boolean): TreeNode | null {
    if (node === null) return null;

    // 先递归处理子节点，传入 isRoot 由当前节点是否被删除决定
    const deleted = toDelete.has(node.val);
    node.left = dfs(node.left, deleted);
    node.right = dfs(node.right, deleted);

    // 当前节点被删除：返回 null（父节点的对应子指针置空）
    if (deleted) {
      return null;
    }

    // 当前节点未被删除：
    // 若它是根（父节点被删除或原本就是根），加入结果
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
console.log("===== 124. 删点成林 =====");

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

// 测试1: root = [1,2,3,4,5,6,7], to_delete = [3,5]
console.log("测试1:", delNodes(buildTree([1, 2, 3, 4, 5, 6, 7]), [3, 5]).map(treeToArray));
// 期望 [[1,2,null,4],[6],[7]]

// 测试2: root = [1,2,4,null,3], to_delete = [3]
console.log("测试2:", delNodes(buildTree([1, 2, 4, null, 3]), [3]).map(treeToArray));
// 期望 [[1,2,4]]

export {};
