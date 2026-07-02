// ============================================================
// 033. 将二叉搜索树变平衡
// ============================================================
// LeetCode 1382. Balance a Binary Search Tree
// 给定一棵二叉搜索树（BST），返回一棵平衡后的 BST，节点值集合不变。
// 平衡 BST 指每个节点的左右子树高度差不超过 1。
// 时间复杂度：O(n), 空间复杂度：O(n)

// 二叉树节点定义
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 方法1：中序遍历得到有序数组，再分治构建平衡 BST（推荐）
// 中序遍历 BST 得到升序序列，分治取中间元素为根构建平衡 BST
// 时间复杂度 O(n)，空间复杂度 O(n)
function balanceBST(root: TreeNode | null): TreeNode | null {
  const sorted: number[] = [];
  // 中序遍历
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    sorted.push(node.val);
    inorder(node.right);
  }
  inorder(root);

  // 分治：在 [left, right] 区间构建平衡 BST
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const mid: number = left + Math.floor((right - left) / 2);
    const node: TreeNode = new TreeNode(sorted[mid]);
    node.left = build(left, mid - 1);
    node.right = build(mid + 1, right);
    return node;
  }

  return build(0, sorted.length - 1);
}

// 方法2：DSW 算法（vine to tree）
// 先将 BST 旋转成一条右斜链（vine），再通过左旋压缩为平衡树
// 时间复杂度 O(n)，空间复杂度 O(1)（不计递归/迭代栈）
function balanceBSTDSW(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // 第一步：将树旋转为右斜链（vine），使用虚拟根简化处理
  const dummy: TreeNode = new TreeNode(0);
  dummy.right = root;

  let tail: TreeNode = dummy;
  let rest: TreeNode | null = tail.right;
  while (rest !== null) {
    if (rest.left !== null) {
      // 右旋：把左孩子提上来
      const temp: TreeNode = rest.left;
      rest.left = temp.right;
      temp.right = rest;
      rest = temp;
      tail.right = rest;
    } else {
      tail = rest;
      rest = rest.right;
    }
  }

  // 计算 vine 节点数
  let count: number = 0;
  let p: TreeNode | null = dummy.right;
  while (p !== null) {
    count++;
    p = p.right;
  }

  // 第二步：将 vine 压缩为平衡树
  // 计算完美平衡树高度对应的节点数
  function compress(start: TreeNode, times: number): void {
    let curr: TreeNode = start;
    for (let i: number = 0; i < times; i++) {
      const child: TreeNode = curr.right!;
      curr.right = child.right;
      curr = curr.right!;
      child.right = curr.left;
      curr.left = child;
    }
  }

  // 完全二叉树节点数：2^h - 1，h 为叶子层
  let leafCount: number = count + 1;
  let h: number = 0;
  while (leafCount > 1) {
    leafCount = Math.floor(leafCount / 2);
    h++;
  }
  const leaves: number = (1 << h) - 1; // 满二叉树前 h 层节点数

  // 先做一轮压缩，处理多余节点
  compress(dummy, count - leaves);
  // 逐层压缩，直到变成平衡树
  let level: number = Math.floor(leaves / 2);
  while (level > 0) {
    compress(dummy, level);
    level = Math.floor(level / 2);
  }

  return dummy.right;
}

// 辅助函数：计算树高度
function getHeight(node: TreeNode | null): number {
  if (node === null) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// 辅助函数：判断是否平衡
function isBalanced(node: TreeNode | null): boolean {
  function check(node: TreeNode | null): number {
    if (node === null) return 0;
    const l: number = check(node.left);
    const r: number = check(node.right);
    if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return check(node) !== -1;
}

// 辅助函数：中序遍历
function inorderTraversal(node: TreeNode | null): number[] {
  const res: number[] = [];
  function traverse(n: TreeNode | null): void {
    if (n === null) return;
    traverse(n.left);
    res.push(n.val);
    traverse(n.right);
  }
  traverse(node);
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 将二叉搜索树变平衡 =====");
// 构造一条右斜链 BST: 1 -> 2 -> 3 -> 4
const bst1: TreeNode = new TreeNode(1);
bst1.right = new TreeNode(2);
bst1.right.right = new TreeNode(3);
bst1.right.right.right = new TreeNode(4);

const balanced1: TreeNode | null = balanceBST(bst1);
console.log(inorderTraversal(balanced1)); // 期望结果: [1,2,3,4]
console.log("平衡:", isBalanced(balanced1)); // 期望结果: true
console.log("高度:", getHeight(balanced1)); // 期望结果: 3

console.log("--- 方法2测试 ---");
const bst2: TreeNode = new TreeNode(1);
bst2.right = new TreeNode(2);
bst2.right.right = new TreeNode(3);
bst2.right.right.right = new TreeNode(4);

const balanced2: TreeNode | null = balanceBSTDSW(bst2);
console.log(inorderTraversal(balanced2)); // 期望结果: [1,2,3,4]
console.log("平衡:", isBalanced(balanced2)); // 期望结果: true

export {};
