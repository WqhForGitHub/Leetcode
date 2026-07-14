// ============================================================
// 073. LCR 124. 推理二叉树
// ============================================================
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
// 给定一棵树的前序遍历 preorder 与中序遍历 inorder，请构造二叉树并返回其根节点。
// 时间复杂度：O(n), 空间复杂度：O(n)

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

// 方法1：分治 + 哈希表加速中序索引（推荐）
// 前序第一个元素为根，在中序中定位根的位置划分左右子树，递归构造
// 时间复杂度 O(n)，空间复杂度 O(n)
function deduceTreeHashmap(preorder: number[], inorder: number[]): TreeNode | null {
  const indexMap: Map<number, number> = new Map();
  for (let i: number = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }

  let preIndex: number = 0;

  function build(inLeft: number, inRight: number): TreeNode | null {
    if (inLeft > inRight) {
      return null;
    }
    const rootVal: number = preorder[preIndex++];
    const root: TreeNode = new TreeNode(rootVal);
    const inRoot: number = indexMap.get(rootVal)!;
    root.left = build(inLeft, inRoot - 1);
    root.right = build(inRoot + 1, inRight);
    return root;
  }

  return build(0, inorder.length - 1);
}

// 方法2：分治 + 线性查找根在中序中的位置
// 同样思路，但每次线性扫描中序数组找根位置
// 时间复杂度 O(n^2) 最坏，空间复杂度 O(n)
function deduceTreeLinear(preorder: number[], inorder: number[]): TreeNode | null {
  function build(
    preStart: number,
    preEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (preStart > preEnd) {
      return null;
    }
    const rootVal: number = preorder[preStart];
    const root: TreeNode = new TreeNode(rootVal);
    // 线性查找根在中序的位置
    let inRoot: number = inStart;
    while (inorder[inRoot] !== rootVal) {
      inRoot++;
    }
    const leftSize: number = inRoot - inStart;
    root.left = build(preStart + 1, preStart + leftSize, inStart, inRoot - 1);
    root.right = build(preStart + leftSize + 1, preEnd, inRoot + 1, inEnd);
    return root;
  }

  return build(0, preorder.length - 1, 0, inorder.length - 1);
}

// 辅助：层序遍历转数组（用于测试输出，null 用 null 表示）
function treeToArray(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  const queue: Array<TreeNode | null> = [root];
  while (queue.length > 0) {
    const node: TreeNode | null = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去除尾部 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. LCR 124. 推理二叉树 =====");
console.log(treeToArray(deduceTreeHashmap([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))); // 期望结果: [3, 9, 20, null, null, 15, 7]
console.log(treeToArray(deduceTreeHashmap([-1], [-1]))); // 期望结果: [-1]
console.log("--- 方法2测试 ---");
console.log(treeToArray(deduceTreeLinear([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))); // 期望结果: [3, 9, 20, null, null, 15, 7]
console.log(treeToArray(deduceTreeLinear([-1], [-1]))); // 期望结果: [-1]

export {};
