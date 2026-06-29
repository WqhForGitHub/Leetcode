// ============================================================
// 012. 从中序与后序遍历序列构造二叉树
// ============================================================
// LeetCode 106. Construct Binary Tree from Inorder and Postorder Traversal
// 给定两个整数数组 inorder 和 postorder，构造二叉树并返回其根节点。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：递归 + 哈希表（推荐）
// 后序遍历最后一个元素是根节点，在中序遍历中找到根节点位置，
// 左边为左子树，右边为右子树
function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  // 用哈希表存储中序遍历中值到索引的映射
  const inorderMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }
  let postIndex = postorder.length - 1; // 后序遍历从后往前

  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 后序遍历当前元素（从右往左）即为根节点
    const rootVal = postorder[postIndex--];
    const root = new TreeNode(rootVal);
    // 在中序中找到根节点位置
    const rootIdx = inorderMap.get(rootVal)!;
    // 注意：后序顺序是左右根，从后往前是根右左
    // 所以先构造右子树，再构造左子树
    root.right = build(rootIdx + 1, right);
    root.left = build(left, rootIdx - 1);
    return root;
  }

  return build(0, inorder.length - 1);
}

// 方法2：迭代栈
// 使用栈从后序遍历末尾开始构造
function buildTreeIterative(
  inorder: number[],
  postorder: number[]
): TreeNode | null {
  if (postorder.length === 0) return null;
  const root = new TreeNode(postorder[postorder.length - 1]);
  const stack: TreeNode[] = [root];
  let inorderIndex = inorder.length - 1;
  for (let i = postorder.length - 2; i >= 0; i--) {
    let node = stack[stack.length - 1];
    // 当前后序值不等于栈顶对应的中序值，说明还是右子树
    if (node.val !== inorder[inorderIndex]) {
      node.right = new TreeNode(postorder[i]);
      stack.push(node.right);
    } else {
      // 弹出栈顶直到不匹配，确定左子树的父节点
      while (
        stack.length > 0 &&
        stack[stack.length - 1].val === inorder[inorderIndex]
      ) {
        node = stack.pop()!;
        inorderIndex--;
      }
      node.left = new TreeNode(postorder[i]);
      stack.push(node.left);
    }
  }
  return root;
}

// 辅助函数：层序遍历转数组（用于验证）
function treeToArray(root: TreeNode | null): (number | null)[] {
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

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 从中序与后序遍历序列构造二叉树 =====");
// 测试1: inorder=[9,3,15,20,7], postorder=[9,15,7,20,3] -> [3,9,20,null,null,15,7]
const tree1 = buildTree([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(
  "in=[9,3,15,20,7], post=[9,15,7,20,3] (递归):",
  JSON.stringify(treeToArray(tree1))
); // [3,9,20,null,null,15,7]

const tree1b = buildTreeIterative([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(
  "in=[9,3,15,20,7], post=[9,15,7,20,3] (迭代):",
  JSON.stringify(treeToArray(tree1b))
); // [3,9,20,null,null,15,7]

// 测试2: inorder=[-1], postorder=[-1] -> [-1]
const tree2 = buildTree([-1], [-1]);
console.log("in=[-1], post=[-1] (递归):", JSON.stringify(treeToArray(tree2))); // [-1]

export {};
