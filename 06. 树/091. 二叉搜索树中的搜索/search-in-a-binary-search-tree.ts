// ============================================================
// 091. 二叉搜索树中的搜索
// ============================================================
// LeetCode 700. Search in a Binary Search Tree
// 给定二叉搜索树（BST）的根节点 root 和一个整数值 val。
// 在 BST 中找到节点值等于 val 的节点，并返回以该节点为根的子树；若不存在则返回 null。
// 时间复杂度：O(h)，空间复杂度：O(h) 递归 / O(1) 迭代（h为树高）

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

// 方法1：递归（推荐）
// 利用 BST 性质：左子树值 < 根值 < 右子树值
function searchBST(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return null;
  if (root.val === val) return root;
  // 目标值小于当前节点值，去左子树找
  if (val < root.val) return searchBST(root.left, val);
  // 目标值大于当前节点值，去右子树找
  return searchBST(root.right, val);
}

// 方法2：迭代
// 不断比较并向下走，直到找到或为空
function searchBSTIter(root: TreeNode | null, val: number): TreeNode | null {
  let curr = root;
  while (curr !== null) {
    if (curr.val === val) return curr;
    curr = val < curr.val ? curr.left : curr.right;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 二叉搜索树中的搜索 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeFromArray(arr: (number | null)[]): TreeNode | null {
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

// 测试1: BST = [4,2,7,1,3], val = 2
//       4
//      / \
//     2   7
//    / \
//   1   3
const tree1 = buildTreeFromArray([4, 2, 7, 1, 3]);
const res1 = searchBST(tree1, 2);
console.log("递归 - 搜索2:", res1?.val); // 期望 2
console.log("递归 - 搜索2的左孩子:", res1?.left?.val); // 期望 1
console.log("递归 - 搜索2的右孩子:", res1?.right?.val); // 期望 3

const res1Iter = searchBSTIter(tree1, 2);
console.log("迭代 - 搜索2:", res1Iter?.val); // 期望 2

// 测试2: 搜索不存在的值 val = 5
const res2 = searchBST(tree1, 5);
console.log("搜索5:", res2); // 期望 null

const res2Iter = searchBSTIter(tree1, 5);
console.log("迭代 - 搜索5:", res2Iter); // 期望 null

// 测试3: 搜索根节点 val = 4
const res3 = searchBST(tree1, 4);
console.log("搜索4（根）:", res3?.val); // 期望 4

// 测试4: 空树
const res4 = searchBST(null, 1);
console.log("空树搜索:", res4); // 期望 null

export {};
