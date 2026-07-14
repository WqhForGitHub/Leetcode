// ============================================================
// 107. 翻转等价二叉树
// ============================================================
// LeetCode 951. Flip Equivalent Binary Trees
// 我们可以为二叉树 T 定义一个翻转操作：选择任意节点，然后交换它的左子树和右子树。
// 判断两棵二叉树是否翻转等价。
// 时间复杂度：O(min(n1, n2))，空间复杂度：O(min(h1, h2))

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
// 对于两个节点 root1 和 root2：
// 1. 都为空 -> true
// 2. 只有一个为空或值不同 -> false
// 3. 不翻转：left-left 配对，right-right 配对
// 4. 翻转：left-right 配对，right-left 配对
// 两者取或
function flipEquiv(root1: TreeNode | null, root2: TreeNode | null): boolean {
  // 都是空树，等价
  if (root1 === null && root2 === null) return true;
  // 只有一个为空，或值不同，不等价
  if (root1 === null || root2 === null) return false;
  if (root1.val !== root2.val) return false;

  // 不翻转：左右子树分别对应
  const noFlip = flipEquiv(root1.left, root2.left) && flipEquiv(root1.right, root2.right);
  // 翻转：左对右，右对左
  const flip = flipEquiv(root1.left, root2.right) && flipEquiv(root1.right, root2.left);

  return noFlip || flip;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 翻转等价二叉树 =====");

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

// 测试1: root1 = [1,2,3,4,5,6,null,null,null,7,8], root2 = [1,3,2,null,6,4,5,null,null,null,null,8,7]
// 翻转等价，期望 true
const tree1a = buildTree([1, 2, 3, 4, 5, 6, null, null, null, 7, 8]);
const tree1b = buildTree([1, 3, 2, null, 6, 4, 5, null, null, null, null, 8, 7]);
console.log("测试1:", flipEquiv(tree1a, tree1b)); // 期望 true

// 测试2: 两棵相同的树
const tree2a = buildTree([1, 2, 3]);
const tree2b = buildTree([1, 2, 3]);
console.log("测试2:", flipEquiv(tree2a, tree2b)); // 期望 true

// 测试3: 不等价
const tree3a = buildTree([1, 2, 3]);
const tree3b = buildTree([1, 2, 4]);
console.log("测试3:", flipEquiv(tree3a, tree3b)); // 期望 false

// 测试4: 都为空
console.log("测试4:", flipEquiv(null, null)); // 期望 true

// 测试5: 一空一非空
const tree5 = buildTree([1]);
console.log("测试5:", flipEquiv(null, tree5)); // 期望 false

export {};
