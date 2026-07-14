// ============================================================
// 096. 二叉搜索树节点最小距离
// ============================================================
// LeetCode 783. Minimum Distance Between BST Nodes
// 给定一个二叉搜索树的根节点 root，返回树中任意两个不同节点值之间的最小差值。
// 注意：节点数量 >= 2。
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

// 方法1：中序遍历
// BST 中序遍历得到升序序列，相邻两数差取最小即可。
// 用 prev 指针记录前一个访问的节点，遍历过程中实时更新答案。

function minDiffInBST(root: TreeNode | null): number {
  let prev: TreeNode | null = null;
  let minDiff = Infinity;

  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    if (prev !== null) {
      minDiff = Math.min(minDiff, node.val - prev.val);
    }
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  return minDiff;
}

// 方法2：中序遍历迭代版本（显式栈）
function minDiffInBSTIter(root: TreeNode | null): number {
  const stack: TreeNode[] = [];
  let curr = root;
  let prev: TreeNode | null = null;
  let minDiff = Infinity;

  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    if (prev !== null) {
      minDiff = Math.min(minDiff, curr.val - prev.val);
    }
    prev = curr;
    curr = curr.right;
  }
  return minDiff;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 二叉搜索树节点最小距离 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForMinDiff(arr: (number | null)[]): TreeNode | null {
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

// 测试1: root = [4,2,6,1,3]
//       4
//      / \
//     2   6
//    / \
//   1   3
// 中序: [1,2,3,4,6]，相邻差最小为1
const tree1 = buildTreeForMinDiff([4, 2, 6, 1, 3]);
console.log("递归 - 最小差值:", minDiffInBST(tree1)); // 期望 1
console.log("迭代 - 最小差值:", minDiffInBSTIter(tree1)); // 期望 1

// 测试2: root = [1,0,48,null,null,12,49]
//      1
//     / \
//    0   48
//       /  \
//      12   49
// 中序: [0,1,12,48,49]，相邻差最小为1
const tree2 = buildTreeForMinDiff([1, 0, 48, null, null, 12, 49]);
console.log("递归 - 最小差值:", minDiffInBST(tree2)); // 期望 1
console.log("迭代 - 最小差值:", minDiffInBSTIter(tree2)); // 期望 1

// 测试3: root = [90,69,null,49,89,null,52]
//        90
//       /
//      69
//     /  \
//    49   89
//     \
//      52
// 中序: [49,52,69,89,90]，最小差为3（52-49）
const tree3 = buildTreeForMinDiff([90, 69, null, 49, 89, null, 52]);
console.log("递归 - 最小差值:", minDiffInBST(tree3)); // 期望 3

export {};
