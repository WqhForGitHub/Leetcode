// ============================================================
// 039. 最接近的二叉搜索树值 II
// ============================================================
// LeetCode 272. Closest Binary Search Tree Value II
// 给定一个不为空的二叉搜索树和一个目标值 target，在该 BST 中找到最接近 target 的 k 个数值。
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

// 方法1：中序遍历 + 双指针（推荐）
// BST 中序遍历得到有序序列，再用双指针从中找到 k 个最接近 target 的值。
function closestKValues(root: TreeNode | null, target: number, k: number): number[] {
  const nums: number[] = [];
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    nums.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  // 双指针：从两边收缩窗口，直到窗口大小为 k
  let lo = 0;
  let hi = nums.length - 1;
  while (hi - lo + 1 > k) {
    if (Math.abs(nums[lo] - target) > Math.abs(nums[hi] - target)) {
      lo++;
    } else {
      hi--;
    }
  }
  return nums.slice(lo, hi + 1);
}

// 方法2：两个栈迭代中序（ predecessors 和 successors）
// 维护两个栈分别按中序给出小于等于 target 的前驱和大于 target 的后继，
// 每次比较两边哪个更接近 target，取较小者加入结果，共取 k 个。
function closestKValuesTwoStacks(
  root: TreeNode | null,
  target: number,
  k: number
): number[] {
  const predecessors: TreeNode[] = [];
  const successors: TreeNode[] = [];
  // 初始化两个栈
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (curr.val <= target) {
      predecessors.push(curr);
      curr = curr.right;
    } else {
      successors.push(curr);
      curr = curr.left;
    }
  }
  const result: number[] = [];
  while (k-- > 0) {
    if (predecessors.length === 0 && successors.length === 0) break;
    const pTop = predecessors[predecessors.length - 1]?.val;
    const sTop = successors[successors.length - 1]?.val;
    if (
      successors.length === 0 ||
      (predecessors.length > 0 &&
        Math.abs(pTop - target) <= Math.abs(sTop - target))
    ) {
      result.push(getNextPredecessor(predecessors));
    } else {
      result.push(getNextSuccessor(successors));
    }
  }
  return result;
}

// 取下一个前驱（即下一个 <= 已弹出的值的中序前驱）
function getNextPredecessor(stack: TreeNode[]): number {
  const node = stack.pop()!;
  let curr: TreeNode | null = node.left;
  while (curr !== null) {
    stack.push(curr);
    curr = curr.right;
  }
  return node.val;
}

// 取下一个后继
function getNextSuccessor(stack: TreeNode[]): number {
  const node = stack.pop()!;
  let curr: TreeNode | null = node.right;
  while (curr !== null) {
    stack.push(curr);
    curr = curr.left;
  }
  return node.val;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 最接近的二叉搜索树值 II =====");
// 构造 BST: [4,2,5,1,3]
const tree39 = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(5)
);
console.log("双指针 target=3.714 k=2:", closestKValues(tree39, 3.714, 2)); // 期望 [4,5] 或 [3,4]
console.log("双栈 target=3.714 k=2:", closestKValuesTwoStacks(tree39, 3.714, 2)); // 期望 [4,5] 或 [3,4]
console.log("双指针 target=2.0 k=2:", closestKValues(tree39, 2.0, 2)); // 期望 [2,1] 或 [2,3]
console.log("双栈 target=2.0 k=2:", closestKValuesTwoStacks(tree39, 2.0, 2)); // 期望 [2,1] 或 [2,3]

export {};
