// ============================================================
// 097. 二叉树剪枝
// ============================================================
// LeetCode 814. Binary Tree Pruning
// 给定二叉树根结点 root，此外树的每个结点的值要么是 0，要么是 1。
// 返回移除了所有不包含 1 的子树的原二叉树。（节点 node 的子树为 node 本身加上所有 node 的后代）
// 时间复杂度：O(n)，空间复杂度：O(h)（n为节点数，h为树高）

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

// 方法1：递归后序遍历（推荐）
// 后序：先递归处理左右子树，再判断当前节点。
// 若当前节点值为 0 且左右子树都已被剪成 null（即子树中无 1），则当前节点也剪掉。
function pruneTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // 先递归剪枝左右子树
  root.left = pruneTree(root.left);
  root.right = pruneTree(root.right);

  // 若当前节点为 0 且无左右子树，则剪掉
  if (root.val === 0 && root.left === null && root.right === null) {
    return null;
  }
  return root;
}

// 方法2：带返回值的辅助函数（显式判断子树是否包含1）
function pruneTreeAlt(root: TreeNode | null): TreeNode | null {
  function containsOne(node: TreeNode | null): boolean {
    if (node === null) return false;
    const leftHas = containsOne(node.left);
    const rightHas = containsOne(node.right);
    if (!leftHas) node.left = null;
    if (!rightHas) node.right = null;
    // 当前子树是否含1
    return node.val === 1 || leftHas || rightHas;
  }
  return containsOne(root) ? root : null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 二叉树剪枝 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForPrune(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 辅助函数：层序遍历输出
function levelOrderForPrune(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: root = [1,null,0,0,1]
//   1                  1
//    \                  \
//     0        =>        0
//    / \                  \
//   0   1                  1
const tree1 = buildTreeForPrune([1, null, 0, 0, 1]);
const pruned1 = pruneTree(tree1);
console.log("测试1 - 剪枝后:", levelOrderForPrune(pruned1)); // 期望 [1,null,0,null,1]

// 测试2: root = [1,0,1,0,0,0,1]
//        1                  1
//       / \                / \
//      0   1      =>      null 1
//     / \ / \                / \
//    0  0 0  1              null 1
const tree2 = buildTreeForPrune([1, 0, 1, 0, 0, 0, 1]);
const pruned2 = pruneTree(tree2);
console.log("测试2 - 剪枝后:", levelOrderForPrune(pruned2)); // 期望 [1,null,1,null,1]

// 测试3: root = [1,1,0,1,1,0,1,0]
// 复杂场景
const tree3 = buildTreeForPrune([1, 1, 0, 1, 1, 0, 1, 0]);
const pruned3 = pruneTreeAlt(tree3);
console.log("测试3 - 剪枝后(方法2):", levelOrderForPrune(pruned3));

// 测试4: 全0树
const tree4 = buildTreeForPrune([0, 0, 0]);
const pruned4 = pruneTree(tree4);
console.log("测试4 - 全0树剪枝后:", pruned4); // 期望 null

export {};
