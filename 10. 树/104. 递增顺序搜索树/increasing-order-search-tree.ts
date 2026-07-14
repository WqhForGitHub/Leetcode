// ============================================================
// 104. 递增顺序搜索树
// ============================================================
// LeetCode 897. Increasing Order Search Tree
// 给你一棵二叉搜索树的根节点 root，请你重新调整树，使最左边的节点成为树的根节点，
// 并且每个节点没有左子节点，只有一个右子节点。
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

// 方法1：中序遍历重构（推荐）
// 先中序遍历收集所有节点值，再按升序构造一个右斜链。
function increasingBST(root: TreeNode | null): TreeNode | null {
  const values: number[] = [];
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  }
  inorder(root);

  if (values.length === 0) return null;
  const newRoot = new TreeNode(values[0]);
  let curr = newRoot;
  for (let i = 1; i < values.length; i++) {
    curr.right = new TreeNode(values[i]);
    curr = curr.right;
  }
  return newRoot;
}

// 方法2：中序遍历原地修改
// 在中序遍历过程中直接修改指针，将当前节点接到 prev 的右孩子上，并清空左指针。
// 用 dummy 节点简化头节点处理。
function increasingBSTInPlace(root: TreeNode | null): TreeNode | null {
  const dummy = new TreeNode(-1);
  let prev: TreeNode = dummy;

  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    // 修改指针
    node.left = null;
    prev.right = node;
    prev = node;
    inorder(node.right);
  }
  inorder(root);

  return dummy.right;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 递增顺序搜索树 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForIncreasing(arr: (number | null)[]): TreeNode | null {
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

// 辅助函数：把右斜树转成数组（验证结果）
function rightSkewToArray(root: TreeNode | null): number[] {
  const result: number[] = [];
  let curr = root;
  while (curr !== null) {
    result.push(curr.val);
    if (curr.left !== null) {
      result.push(`有左孩子:${curr.left.val}` as any);
    }
    curr = curr.right;
  }
  return result;
}

// 测试1: root = [5,3,6,2,4,null,8,1,null,null,null,7,9]
//        5
//       / \
//      3   6
//     / \   \
//    2   4   8
//   /       / \
//  1       7   9
// 调整后应为右斜链：1->2->3->4->5->6->7->8->9
const tree1 = buildTreeForIncreasing([5, 3, 6, 2, 4, null, 8, 1, null, null, null, 7, 9]);
const res1 = increasingBST(tree1);
console.log("方法1 - 右斜链:", rightSkewToArray(res1)); // 期望 [1,2,3,4,5,6,7,8,9]

// 测试2: 原地修改
const tree2 = buildTreeForIncreasing([5, 3, 6, 2, 4, null, 8, 1, null, null, null, 7, 9]);
const res2 = increasingBSTInPlace(tree2);
console.log("方法2 - 右斜链:", rightSkewToArray(res2)); // 期望 [1,2,3,4,5,6,7,8,9]

// 测试3: 单节点
const tree3 = buildTreeForIncreasing([1]);
console.log("单节点:", rightSkewToArray(increasingBST(tree3))); // 期望 [1]

// 测试4: 空树
console.log("空树:", increasingBST(null)); // 期望 null

// 测试5: 已经是右斜链
const tree5 = buildTreeForIncreasing([1, null, 2, null, 3]);
console.log("已是右斜:", rightSkewToArray(increasingBST(tree5))); // 期望 [1,2,3]

export {};
