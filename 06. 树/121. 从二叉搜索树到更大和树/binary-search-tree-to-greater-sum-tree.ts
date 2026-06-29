// ============================================================
// 121. 从二叉搜索树到更大和树
// ============================================================
// LeetCode 1038. Binary Search Tree to Greater Sum Tree
// 给定一个二叉搜索树 root，返回它的更大和树。
// 每个节点的值替换为原始树中大于或等于该节点值的所有节点值之和。
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

// 方法1：反序中序递归（推荐）
// BST 的中序遍历是升序，反序中序（右-根-左）是降序
// 维护一个累计和 sum，每次访问节点时 sum += node.val，然后 node.val = sum
let sum1: number;
function bstToGst(root: TreeNode | null): TreeNode | null {
  sum1 = 0;
  reverseInorder(root);
  return root;
}

function reverseInorder(node: TreeNode | null): void {
  if (node === null) return;
  reverseInorder(node.right);
  sum1 += node.val;
  node.val = sum1;
  reverseInorder(node.left);
}

// 方法2：反序中序迭代
// 使用栈模拟中序遍历，先一路向右压栈，然后弹栈处理，再转向左子树
function bstToGstIterative(root: TreeNode | null): TreeNode | null {
  let sum = 0;
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (stack.length > 0 || curr !== null) {
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
console.log("===== 121. 从二叉搜索树到更大和树 =====");

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

// 测试1:
//       4                  30
//      / \                /  \
//     1   6              36   21
//    / \ / \            / \  / \
//   0  2 5  7          36 35 26 15
//       \   \              \     \
//        3   8             33     8
console.log(
  "测试1 递归:",
  treeToArray(bstToGst(buildTree([4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8]))),
);
// 期望 [30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
console.log(
  "测试1 迭代:",
  treeToArray(
    bstToGstIterative(buildTree([4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8])),
  ),
);

// 测试2: 单节点 [5] -> [5]
console.log("测试2 递归:", treeToArray(bstToGst(buildTree([5]))));
console.log("测试2 迭代:", treeToArray(bstToGstIterative(buildTree([5]))));

export {};
