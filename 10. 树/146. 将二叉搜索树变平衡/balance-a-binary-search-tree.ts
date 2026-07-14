// ============================================================
// 146. 将二叉搜索树变平衡
// ============================================================
// LeetCode 1382. Balance a Binary Search Tree
// 给你一棵二叉搜索树，请你返回一棵平衡后的二叉搜索树。
// 平衡二叉树是指每个节点的两个子树的高度差不超过 1。
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

// 方法1：中序遍历+递归构造（推荐）
// 中序遍历得到有序数组，再递归取中点作为根构造平衡BST
function balanceBST(root: TreeNode | null): TreeNode | null {
  const sorted: number[] = [];

  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    sorted.push(node.val);
    inorder(node.right);
  }

  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const mid = Math.floor((left + right) / 2);
    const node = new TreeNode(sorted[mid]);
    node.left = build(left, mid - 1);
    node.right = build(mid + 1, right);
    return node;
  }

  inorder(root);
  return build(0, sorted.length - 1);
}

// 方法2：中序遍历+DSW算法
// DSW算法：1) 旋转成右链(藤蔓)；2) 再旋转成平衡树
function balanceBSTDSW(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // 第一步：创建伪根，方便处理
  const grand = new TreeNode(0);
  grand.right = root;

  // 第二步：树转右链（ vine ）
  let vineTail = grand;
  let rest = vineTail.right;
  let count = 0;
  while (rest !== null) {
    if (rest.left !== null) {
      // 右旋：把左孩子提上来
      const temp = rest.left;
      rest.left = temp.right;
      temp.right = rest;
      rest = temp;
      vineTail.right = temp;
    } else {
      vineTail = rest;
      rest = rest.right;
      count++;
    }
  }

  // 第三步：右链折成平衡树
  const leaves = count + 1 - Math.pow(2, Math.floor(Math.log2(count + 1)));
  compress(grand, leaves);
  count = count - leaves;
  while (count > 1) {
    count = Math.floor(count / 2);
    compress(grand, count);
  }

  return grand.right;
}

// DSW压缩操作：对以 grand 为伪根的右链进行 n 次左旋
function compress(grand: TreeNode, n: number): void {
  let node = grand;
  for (let i = 0; i < n; i++) {
    const child = node.right!;
    const grandChild = child.right!;
    child.right = grandChild.left;
    grandChild.left = child;
    node.right = grandChild;
    node = grandChild;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 146. 将二叉搜索树变平衡 =====");

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left!);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right!);
    }
    i++;
  }
  return root;
}

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

function height(node: TreeNode | null): number {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function isBalanced(node: TreeNode | null): boolean {
  if (node === null) return true;
  return (
    Math.abs(height(node.left) - height(node.right)) <= 1 &&
    isBalanced(node.left) &&
    isBalanced(node.right)
  );
}

// 测试1: 退化为右链 [1,null,2,null,3,null,4]
const tree1 = buildTree([1, null, 2, null, 3, null, 4]);
const balanced1 = balanceBST(tree1);
console.log("测试1 中序构造:", treeToArray(balanced1), "是否平衡:", isBalanced(balanced1));

// 测试2: 退化为左链 [4,3,null,2,null,1,null]
const tree2 = buildTree([4, 3, null, 2, null, 1, null]);
const balanced2 = balanceBST(tree2);
console.log("测试2 中序构造:", treeToArray(balanced2), "是否平衡:", isBalanced(balanced2));

// 测试3: DSW算法
const tree3 = buildTree([1, null, 2, null, 3, null, 4]);
const balanced3 = balanceBSTDSW(tree3);
console.log("测试3 DSW:", treeToArray(balanced3), "是否平衡:", isBalanced(balanced3));

// 测试4: 单节点
const tree4 = buildTree([1]);
console.log("测试4:", treeToArray(balanceBST(tree4))); // 期望 [1]

export {};
