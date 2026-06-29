// ============================================================
// 027. 上下翻转二叉树
// ============================================================
// LeetCode 156. Binary Tree Upside Down
// 给定一个二叉树，其中所有的右节点要么是具有兄弟节点的叶节点，要么为空，
// 将其上下翻转：原左子节点变为新根，原根变为新右子节点，原右子节点变为新左子节点。
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

// 方法1：递归（推荐）
// 思路：先递归翻转左子树，得到新根；然后将当前节点接到其左孩子的右孩子，
// 当前节点的右孩子接到左孩子的左孩子，最后断开当前节点的左右指针。
function upsideDownBinaryTree(root: TreeNode | null): TreeNode | null {
  if (root === null || root.left === null) {
    return root;
  }
  // 递归翻转左子树，新根为原最左叶子
  const newRoot = upsideDownBinaryTree(root.left);
  // root.left 是新根所在子树的根
  root.left!.left = root.right;
  root.left!.right = root;
  // 断开当前节点的左右指针
  root.left = null;
  root.right = null;
  return newRoot;
}

// 方法2：迭代（空间 O(1)）
// 自顶向下逐步翻转，保存 prev（上一个根）、temp（当前右孩子，作为下一层左孩子）
function upsideDownBinaryTreeIterative(root: TreeNode | null): TreeNode | null {
  let curr = root;
  let prev: TreeNode | null = null;
  let temp: TreeNode | null = null; // 保存当前节点的右孩子，作为下一层的左孩子
  while (curr !== null) {
    const next = curr.left; // 下一层要处理的节点
    // 翻转：curr 的左指向上一层原右孩子，右指向上一层原根
    curr.left = temp;
    const oldRight = curr.right;
    curr.right = prev;
    // 向下移动
    temp = oldRight;
    prev = curr;
    curr = next;
  }
  return prev;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 上下翻转二叉树 =====");
// 树: [1,2,3,4,5]
//       1
//      / \
//     2   3
//    / \
//   4   5
// 翻转后:
//       4
//      / \
//     5   2
//        / \
//       3   1
function buildTree027(): TreeNode {
  return new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
}

function treeToList(root: TreeNode | null): (number | null)[] {
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
  // 去除末尾 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

const tree027a = buildTree027();
const result027a = upsideDownBinaryTree(tree027a);
console.log("递归 [1,2,3,4,5]:", JSON.stringify(treeToList(result027a))); // [4,5,2,3,1]

const tree027b = buildTree027();
const result027b = upsideDownBinaryTreeIterative(tree027b);
console.log("迭代 [1,2,3,4,5]:", JSON.stringify(treeToList(result027b))); // [4,5,2,3,1]

// 单节点
const single027 = new TreeNode(1);
console.log("单节点:", JSON.stringify(treeToList(upsideDownBinaryTree(single027)))); // [1]

// 空树
console.log("空树:", upsideDownBinaryTree(null)); // null

export {};
