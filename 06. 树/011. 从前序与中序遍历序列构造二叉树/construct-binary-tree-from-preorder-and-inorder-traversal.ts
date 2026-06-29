// ============================================================
// 011. 从前序与中序遍历序列构造二叉树
// ============================================================
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
// 给定两个整数数组 preorder 和 inorder，构造二叉树并返回其根节点。
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
// 前序遍历第一个元素是根节点，在中序遍历中找到根节点位置，
// 左边为左子树，右边为右子树
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // 用哈希表存储中序遍历中值到索引的映射，O(1) 查找
  const inorderMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }
  let preIndex = 0; // 前序遍历的当前索引

  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 前序遍历当前元素即为根节点
    const rootVal = preorder[preIndex++];
    const root = new TreeNode(rootVal);
    // 在中序中找到根节点位置
    const rootIdx = inorderMap.get(rootVal)!;
    // 先构造左子树（前序顺序：根左右）
    root.left = build(left, rootIdx - 1);
    // 再构造右子树
    root.right = build(rootIdx + 1, right);
    return root;
  }

  return build(0, inorder.length - 1);
}

// 方法2：迭代栈
// 使用栈模拟构造过程
function buildTreeIterative(
  preorder: number[],
  inorder: number[]
): TreeNode | null {
  if (preorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const stack: TreeNode[] = [root];
  let inorderIndex = 0;
  for (let i = 1; i < preorder.length; i++) {
    let node = stack[stack.length - 1];
    // 当前前序值不等于栈顶对应的中序值，说明还是左子树
    if (node.val !== inorder[inorderIndex]) {
      node.left = new TreeNode(preorder[i]);
      stack.push(node.left);
    } else {
      // 弹出栈顶直到不匹配，确定右子树的父节点
      while (
        stack.length > 0 &&
        stack[stack.length - 1].val === inorder[inorderIndex]
      ) {
        node = stack.pop()!;
        inorderIndex++;
      }
      node.right = new TreeNode(preorder[i]);
      stack.push(node.right);
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
console.log("===== 011. 从前序与中序遍历序列构造二叉树 =====");
// 测试1: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7] -> [3,9,20,null,null,15,7]
const tree1 = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log(
  "pre=[3,9,20,15,7], in=[9,3,15,20,7] (递归):",
  JSON.stringify(treeToArray(tree1))
); // [3,9,20,null,null,15,7]

const tree1b = buildTreeIterative([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log(
  "pre=[3,9,20,15,7], in=[9,3,15,20,7] (迭代):",
  JSON.stringify(treeToArray(tree1b))
); // [3,9,20,null,null,15,7]

// 测试2: preorder=[-1], inorder=[-1] -> [-1]
const tree2 = buildTree([-1], [-1]);
console.log("pre=[-1], in=[-1] (递归):", JSON.stringify(treeToArray(tree2))); // [-1]

export {};
