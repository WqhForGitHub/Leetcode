// ============================================================
// 040. 二叉搜索树中的中序后继
// ============================================================
// LeetCode 285. Inorder Successor in BST
// 给定一棵二叉搜索树和其中的一个节点 p，找到该节点在树中的中序后继。
// 时间复杂度：O(H)，空间复杂度：O(1) 迭代 / O(n) 中序

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

// 方法1：利用 BST 性质迭代（推荐）
// 若 p 有右子树，则后继为右子树的最左节点；
// 否则后继为从根搜索 p 时，最后一个向左转的祖先节点。
function inorderSuccessor(root: TreeNode | null, p: TreeNode | null): TreeNode | null {
  if (root === null || p === null) return null;
  // 情况1：p 有右子树，找右子树的最左节点
  if (p.right !== null) {
    let curr: TreeNode | null = p.right;
    while (curr !== null && curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }
  // 情况2：无右子树，从根向下寻找 p，记录最后一个向左转的节点
  let successor: TreeNode | null = null;
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (p.val < curr.val) {
      successor = curr;
      curr = curr.left;
    } else if (p.val > curr.val) {
      curr = curr.right;
    } else {
      break;
    }
  }
  return successor;
}

// 方法2：中序遍历
// 中序遍历 BST，记录前一个访问的节点，若前一个等于 p，则当前即为后继。
function inorderSuccessorInorder(root: TreeNode | null, p: TreeNode | null): TreeNode | null {
  if (root === null || p === null) return null;
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  let prev: TreeNode | null = null;
  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    if (prev === p) return curr;
    prev = curr;
    curr = curr.right;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 二叉搜索树中的中序后继 =====");
// 构造 BST: [2,1,3]
const tree40 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
const p40 = tree40.left!; // 1
console.log("迭代 后继(1):", inorderSuccessor(tree40, p40)?.val); // 期望 2
console.log("中序 后继(1):", inorderSuccessorInorder(tree40, p40)?.val); // 期望 2

const p40b = tree40; // 2
console.log("迭代 后继(2):", inorderSuccessor(tree40, p40b)?.val); // 期望 3
console.log("中序 后继(2):", inorderSuccessorInorder(tree40, p40b)?.val); // 期望 3

const p40c = tree40.right!; // 3 (无后继)
console.log("迭代 后继(3):", inorderSuccessor(tree40, p40c)); // 期望 null
console.log("中序 后继(3):", inorderSuccessorInorder(tree40, p40c)); // 期望 null

// 更复杂的树: [5,3,6,2,4,null,null,1]
const tree40b = new TreeNode(
  5,
  new TreeNode(3, new TreeNode(2, new TreeNode(1)), new TreeNode(4)),
  new TreeNode(6),
);
const p40d = tree40b.left!.right!; // 4
console.log("迭代 后继(4):", inorderSuccessor(tree40b, p40d)?.val); // 期望 5
console.log("中序 后继(4):", inorderSuccessorInorder(tree40b, p40d)?.val); // 期望 5

export {};
