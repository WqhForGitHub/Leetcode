// ============================================================
// 038. 最接近的二叉搜索树值
// ============================================================
// LeetCode 270. Closest Binary Search Tree Value
// 给定一个不为空的二叉搜索树和一个目标值 target，在该 BST 中找到最接近 target 的数值。
// 时间复杂度：O(H)，空间复杂度：O(1) 迭代 / O(H) 递归

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

// 方法1：迭代利用 BST 性质（推荐）
function closestValue(root: TreeNode | null, target: number): number {
  let closest = root!.val;
  let curr: TreeNode | null = root;
  while (curr !== null) {
    // 若当前节点更接近 target，则更新 closest
    if (
      Math.abs(curr.val - target) < Math.abs(closest - target) ||
      (Math.abs(curr.val - target) === Math.abs(closest - target) && curr.val < closest)
    ) {
      closest = curr.val;
    }
    // BST 决定搜索方向
    curr = target < curr.val ? curr.left : curr.right;
  }
  return closest;
}

// 方法2：中序遍历
function closestValueInorder(root: TreeNode | null, target: number): number {
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  let closest = root!.val;
  let minDiff = Infinity;
  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    const diff = Math.abs(curr.val - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = curr.val;
    }
    // 中序遍历是有序的，若当前差值已开始增大，可提前终止
    if (curr.val > target) break;
    curr = curr.right;
  }
  return closest;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 最接近的二叉搜索树值 =====");
// 构造 BST: [4,2,5,1,3]
const tree38 = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(5));
console.log("迭代 target=3.714:", closestValue(tree38, 3.714)); // 期望 4
console.log("中序 target=3.714:", closestValueInorder(tree38, 3.714)); // 期望 4
console.log("迭代 target=2.0:", closestValue(tree38, 2.0)); // 期望 2
console.log("中序 target=2.0:", closestValueInorder(tree38, 2.0)); // 期望 2
console.log("迭代 target=5.0:", closestValue(tree38, 5.0)); // 期望 5

export {};
