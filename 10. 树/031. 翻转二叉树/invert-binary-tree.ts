// ============================================================
// 031. 翻转二叉树
// ============================================================
// LeetCode 226. Invert Binary Tree
// 给你一棵二叉树的根节点 root，翻转这棵二叉树，并返回其根节点。
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

// 方法1：递归（推荐）
function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}

// 方法2：迭代 BFS
function invertTreeBFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return root;
}

// 辅助函数：层序遍历输出（用于测试）
function levelOrder(root: TreeNode | null): (number | null)[] {
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
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 翻转二叉树 =====");
// 构造树: [4,2,7,1,3,6,9]
const tree31 = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(7, new TreeNode(6), new TreeNode(9)),
);
const inverted31 = invertTree(tree31);
console.log("递归翻转:", levelOrder(inverted31)); // 期望 [4,7,2,9,6,3,1]

const tree31b = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(7, new TreeNode(6), new TreeNode(9)),
);
const inverted31b = invertTreeBFS(tree31b);
console.log("BFS翻转:", levelOrder(inverted31b)); // 期望 [4,7,2,9,6,3,1]

export {};
