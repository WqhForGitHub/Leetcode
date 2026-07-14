// ============================================================
// 177. 给定二叉搜索树的插入顺序求深度
// ============================================================
// LeetCode 1902. Depth of BST Given Insertion Order
// 给定一个插入顺序数组 order，按照 BST 插入规则依次插入节点，返回最终 BST 的最大深度。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：单调栈+有序集合（推荐）
// 用 TreeMap（这里用两个数组模拟）维护已插入节点的位置和深度
// 对于新节点 x，找到其在已排序节点中的左右邻居
// 新节点的深度 = max(左邻居深度, 右邻居深度) + 1
// 原理：BST 中，新节点的父节点必然是其值的前驱或后继中深度较大的那个
function maxDepthBST(order: number[]): number {
  // 用有序结构维护已插入的值及其深度
  // 这里用基于数组的有序映射（实际 LeetCode 中可用 TreeMap）
  // 为了效率，使用一种巧妙的实现：维护 keys 数组和 depths 数组（有序）

  // 使用简化的有序数组实现（二分查找 + 插入）
  const keys: number[] = []; // 有序的已插入值
  const depths: Map<number, number> = new Map(); // 值 -> 深度

  let maxDepth = 0;

  for (const x of order) {
    // 找 x 在有序数组中的插入位置
    const idx = binarySearchInsertPos(keys, x);
    // 左邻居深度
    const leftDepth = idx > 0 ? depths.get(keys[idx - 1])! : 0;
    // 右邻居深度
    const rightDepth = idx < keys.length ? depths.get(keys[idx])! : 0;

    const depth = Math.max(leftDepth, rightDepth) + 1;
    depths.set(x, depth);
    // 插入到有序数组
    keys.splice(idx, 0, x);

    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;

  function binarySearchInsertPos(arr: number[], target: number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}

// 方法2：直接模拟BST插入
// 逐个插入节点，构建BST，最后求深度
function maxDepthBSTSimulate(order: number[]): number {
  class TreeNode {
    val: number;
    left: TreeNode | null = null;
    right: TreeNode | null = null;
    constructor(val: number) {
      this.val = val;
    }
  }

  if (order.length === 0) return 0;
  const root = new TreeNode(order[0]);

  for (let i = 1; i < order.length; i++) {
    insert(root, order[i]);
  }

  return getDepth(root);

  function insert(node: TreeNode, val: number): void {
    if (val < node.val) {
      if (node.left === null) node.left = new TreeNode(val);
      else insert(node.left, val);
    } else {
      if (node.right === null) node.right = new TreeNode(val);
      else insert(node.right, val);
    }
  }

  function getDepth(node: TreeNode | null): number {
    if (node === null) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 177. 给定二叉搜索树的插入顺序求深度 =====");

// 测试1: order = [4,2,6,1,3,5,7]
// 构建的BST是完全平衡的，深度 3
//       4
//      / \
//     2   6
//    / \ / \
//   1  3 5  7
console.log("测试1 有序集合法:", maxDepthBST([4, 2, 6, 1, 3, 5, 7])); // 3
console.log("测试1 模拟法:", maxDepthBSTSimulate([4, 2, 6, 1, 3, 5, 7])); // 3

// 测试2: order = [4,2,1,3,6,5,7]
// 插入顺序不同但最终树形可能不同
console.log("测试2 有序集合法:", maxDepthBST([4, 2, 1, 3, 6, 5, 7])); // 3
console.log("测试2 模拟法:", maxDepthBSTSimulate([4, 2, 1, 3, 6, 5, 7])); // 3

// 测试3: order = [1,2,3,4,5]
// 退化为链，深度 5
console.log("测试3 有序集合法:", maxDepthBST([1, 2, 3, 4, 5])); // 5
console.log("测试3 模拟法:", maxDepthBSTSimulate([1, 2, 3, 4, 5])); // 5

// 测试4: order = [5,4,3,2,1]
// 退化为链，深度 5
console.log("测试4 有序集合法:", maxDepthBST([5, 4, 3, 2, 1])); // 5
console.log("测试4 模拟法:", maxDepthBSTSimulate([5, 4, 3, 2, 1])); // 5

// 测试5: 单节点
console.log("测试5 有序集合法:", maxDepthBST([1])); // 1

export {};
