// ============================================================
// 065. 把二叉搜索树转换为累加树
// ============================================================
// LeetCode 538. Convert BST to Greater Tree
// 给出二叉搜索树的根节点，该树的节点值各不相同，将其转换为累加树，
// 使每个节点的新值等于原树中大于或等于该节点的值之和。
// 时间复杂度：O(n)，空间复杂度：O(n)（方法1）/ O(1)（方法2）

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

// 方法1：反序中序递归（推荐）
// BST 反序中序遍历（右-根-左）得到降序序列，累加和更新节点值
function convertBST(root: TreeNode | null): TreeNode | null {
  let sum = 0;
  function reverseInorder(node: TreeNode | null): void {
    if (node === null) return;
    reverseInorder(node.right);
    sum += node.val;
    node.val = sum;
    reverseInorder(node.left);
  }
  reverseInorder(root);
  return root;
}

// 方法2：反序中序迭代
// 使用栈模拟反序中序遍历
function convertBSTIterative(root: TreeNode | null): TreeNode | null {
  let sum = 0;
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (curr !== null || stack.length > 0) {
    // 先走到最右下
    while (curr !== null) {
      stack.push(curr);
      curr = curr.right;
    }
    curr = stack.pop()!;
    sum += curr.val;
    curr.val = sum;
    curr = curr.left;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 把二叉搜索树转换为累加树 =====");
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() ?? null;
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

// BST:
//        4
//       / \
//      1   6
//     / \ / \
//    0  2 5  7
//         \    \
//          3    8
// 转换后累加树: [36,36,24,36,26,30,21,null,null,null,27,null,null,null,22]
const tree1 = new TreeNode(
  4,
  new TreeNode(1, new TreeNode(0), new TreeNode(2, null, new TreeNode(3))),
  new TreeNode(6, new TreeNode(5), new TreeNode(7, null, new TreeNode(8))),
);
console.log("递归 累加树:", treeToArray(convertBST(tree1)));
// [36,36,24,36,26,30,21,null,null,null,27,null,null,null,22]

const tree2 = new TreeNode(
  4,
  new TreeNode(1, new TreeNode(0), new TreeNode(2, null, new TreeNode(3))),
  new TreeNode(6, new TreeNode(5), new TreeNode(7, null, new TreeNode(8))),
);
console.log("迭代 累加树:", treeToArray(convertBSTIterative(tree2)));
// [36,36,24,36,26,30,21,null,null,null,27,null,null,null,22]

// 单节点
const single1 = new TreeNode(1);
console.log("递归 单节点:", treeToArray(convertBST(single1))); // [1]
const single2 = new TreeNode(1);
console.log("迭代 单节点:", treeToArray(convertBSTIterative(single2))); // [1]

// 空树
console.log("递归 空树:", treeToArray(convertBST(null))); // []
console.log("迭代 空树:", treeToArray(convertBSTIterative(null))); // []

export {};
