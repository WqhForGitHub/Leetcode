// ============================================================
// 007. 对称二叉树
// ============================================================
// LeetCode 101. Symmetric Tree
// 给你一个二叉树的根节点 root，检查它是否轴对称。
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

// 方法1：递归（推荐）
// 检查左子树和右子树是否互为镜像
function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true;
  return isMirror(root.left, root.right);
}

function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
  // 都为空则对称
  if (left === null && right === null) return true;
  // 只有一个为空则不对称
  if (left === null || right === null) return false;
  // 值相同，且 left.left 与 right.right 镜像，left.right 与 right.left 镜像
  return (
    left.val === right.val && isMirror(left.left, right.right) && isMirror(left.right, right.left)
  );
}

// 方法2：迭代队列
// 使用队列成对入队比较
function isSymmetricIterative(root: TreeNode | null): boolean {
  if (root === null) return true;
  const queue: (TreeNode | null)[] = [root.left, root.right];
  while (queue.length > 0) {
    const left = queue.shift()!;
    const right = queue.shift()!;
    // 都为空，继续
    if (left === null && right === null) continue;
    // 一个为空或值不同
    if (left === null || right === null) return false;
    if (left.val !== right.val) return false;
    // 对称位置成对入队
    queue.push(left.left);
    queue.push(right.right);
    queue.push(left.right);
    queue.push(right.left);
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 对称二叉树 =====");
// 测试1: [1,2,2,3,4,4,3] -> true
const tree1 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(3), new TreeNode(4)),
  new TreeNode(2, new TreeNode(4), new TreeNode(3)),
);
console.log("[1,2,2,3,4,4,3] (递归):", isSymmetric(tree1)); // true
console.log("[1,2,2,3,4,4,3] (迭代):", isSymmetricIterative(tree1)); // true

// 测试2: [1,2,2,null,3,null,3] -> false
const tree2 = new TreeNode(
  1,
  new TreeNode(2, null, new TreeNode(3)),
  new TreeNode(2, null, new TreeNode(3)),
);
console.log("[1,2,2,null,3,null,3] (递归):", isSymmetric(tree2)); // false
console.log("[1,2,2,null,3,null,3] (迭代):", isSymmetricIterative(tree2)); // false

// 测试3: 空树 -> true
console.log("null (递归):", isSymmetric(null)); // true

export {};
