// ============================================================
// 109. 单值二叉树
// ============================================================
// LeetCode 965. Univalued Binary Tree
// 如果二叉树每个节点都具有相同的值，那么该二叉树就是单值二叉树。
// 判断给定二叉树是否为单值二叉树。
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
// 比较根节点值与左右子节点值，并递归判断左右子树是否单值
function isUnivalTree(root: TreeNode | null): boolean {
  if (root === null) return true;

  // 检查左孩子值是否与根相同
  if (root.left !== null && root.left.val !== root.val) return false;
  // 检查右孩子值是否与根相同
  if (root.right !== null && root.right.val !== root.val) return false;

  // 递归检查左右子树
  return isUnivalTree(root.left) && isUnivalTree(root.right);
}

// 方法2：迭代BFS
// 层序遍历，所有节点值都应与根节点值相同
function isUnivalTreeBFS(root: TreeNode | null): boolean {
  if (root === null) return true;
  const target = root.val;
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.val !== target) return false;
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }

  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 单值二叉树 =====");

// 辅助函数：从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 测试1: [1,1,1,1,1,null,1] 单值
const tree1 = buildTree([1, 1, 1, 1, 1, null, 1]);
console.log("测试1 递归:", isUnivalTree(tree1)); // 期望 true
console.log("测试1 BFS:", isUnivalTreeBFS(tree1)); // 期望 true

// 测试2: [2,2,2,5,2] 非单值
const tree2 = buildTree([2, 2, 2, 5, 2]);
console.log("测试2 递归:", isUnivalTree(tree2)); // 期望 false
console.log("测试2 BFS:", isUnivalTreeBFS(tree2)); // 期望 false

// 测试3: 单节点
const tree3 = buildTree([7]);
console.log("测试3 递归:", isUnivalTree(tree3)); // 期望 true
console.log("测试3 BFS:", isUnivalTreeBFS(tree3)); // 期望 true

// 测试4: [3,3,3,3,3,3,3] 全相同
const tree4 = buildTree([3, 3, 3, 3, 3, 3, 3]);
console.log("测试4 递归:", isUnivalTree(tree4)); // 期望 true

export {};
