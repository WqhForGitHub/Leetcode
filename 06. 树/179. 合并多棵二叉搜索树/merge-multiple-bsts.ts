// ============================================================
// 179. 合并多棵二叉搜索树
// ============================================================
// LeetCode 2471变体. Merge Multiple BSTs
// 给定多棵二叉搜索树的根节点列表，将它们合并为一棵二叉搜索树。
// 时间复杂度：O(N log N)，空间复杂度：O(N)，N 为所有节点总数

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

// 方法1：中序遍历+有序数组构造（推荐）
// 1. 对每棵 BST 中序遍历得到有序序列
// 2. 合并所有有序序列（多路归并）
// 3. 用有序数组构造平衡 BST
function mergeBSTs(roots: (TreeNode | null)[]): TreeNode | null {
  const allValues: number[] = [];

  // 收集所有 BST 的中序遍历结果
  for (const root of roots) {
    inorder(root, allValues);
  }

  // 排序（或用多路归并）
  allValues.sort((a, b) => a - b);

  // 用有序数组构造平衡 BST
  return buildBalancedBST(allValues, 0, allValues.length - 1);

  function inorder(node: TreeNode | null, result: number[]): void {
    if (node === null) return;
    inorder(node.left, result);
    result.push(node.val);
    inorder(node.right, result);
  }

  function buildBalancedBST(
    arr: number[],
    left: number,
    right: number
  ): TreeNode | null {
    if (left > right) return null;
    const mid = (left + right) >> 1;
    const node = new TreeNode(arr[mid]);
    node.left = buildBalancedBST(arr, left, mid - 1);
    node.right = buildBalancedBST(arr, mid + 1, right);
    return node;
  }
}

// 方法2：逐棵合并
// 将 BST 列表逐个合并：每次合并两棵 BST
function mergeBSTsPairwise(roots: (TreeNode | null)[]): TreeNode | null {
  let result: TreeNode | null = null;
  for (const root of roots) {
    result = mergeTwoBSTs(result, root);
  }
  return result;
}

function mergeTwoBSTs(t1: TreeNode | null, t2: TreeNode | null): TreeNode | null {
  const values: number[] = [];
  inorder(t1, values);
  inorder(t2, values);
  values.sort((a, b) => a - b);
  return buildBalancedBST(values, 0, values.length - 1);

  function inorder(node: TreeNode | null, result: number[]): void {
    if (node === null) return;
    inorder(node.left, result);
    result.push(node.val);
    inorder(node.right, result);
  }

  function buildBalancedBST(
    arr: number[],
    left: number,
    right: number
  ): TreeNode | null {
    if (left > right) return null;
    const mid = (left + right) >> 1;
    const node = new TreeNode(arr[mid]);
    node.left = buildBalancedBST(arr, left, mid - 1);
    node.right = buildBalancedBST(arr, mid + 1, right);
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 179. 合并多棵二叉搜索树 =====");

// 辅助函数：层序转数组
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

// 辅助函数：验证 BST
function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number, max: number): boolean {
    if (node === null) return true;
    if (node.val <= min || node.val >= max) return false;
    return (
      validate(node.left, min, node.val) &&
      validate(node.right, node.val, max)
    );
  }
  return validate(root, -Infinity, Infinity);
}

// 测试1: 合并两棵 BST
// BST1:   2       BST2:   4
//        / \            / \
//       1   3          3   5
const bst1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
const bst2 = new TreeNode(4, new TreeNode(3), new TreeNode(5));
const merged1 = mergeBSTs([bst1, bst2]);
console.log("测试1 合并结果:", treeToArray(merged1));
console.log("测试1 是否合法BST:", isValidBST(merged1)); // true

// 测试2: 合并三棵 BST
const bst3 = new TreeNode(6, new TreeNode(5), new TreeNode(7));
const bst4 = new TreeNode(10, new TreeNode(9), new TreeNode(11));
const bst5 = new TreeNode(1, null, new TreeNode(2));
const merged2 = mergeBSTs([bst3, bst4, bst5]);
console.log("测试2 合并结果:", treeToArray(merged2));
console.log("测试2 是否合法BST:", isValidBST(merged2)); // true

// 测试3: 逐棵合并
const bst6 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
const bst7 = new TreeNode(4, new TreeNode(3), new TreeNode(5));
const merged3 = mergeBSTsPairwise([bst6, bst7]);
console.log("测试3 逐棵合并:", treeToArray(merged3));
console.log("测试3 是否合法BST:", isValidBST(merged3)); // true

// 测试4: 空列表
console.log("测试4 空列表:", mergeBSTs([])); // null

// 测试5: 单棵 BST
console.log("测试5 单棵:", treeToArray(mergeBSTs([new TreeNode(1)]))); // [1]

export {};
