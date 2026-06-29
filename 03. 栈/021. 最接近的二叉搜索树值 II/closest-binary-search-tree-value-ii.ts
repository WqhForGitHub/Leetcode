// ============================================================
// 021. 最接近的二叉搜索树值 II
// ============================================================
// LeetCode 272. Closest Binary Search Tree Value II
// 给定一棵非空二叉搜索树和一个目标值 target，找出 BST 中最接近 target 的 k 个值。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ------------------------------------------------------------
// 方法1：双栈（前驱 + 后继迭代器）
// ------------------------------------------------------------
// 用两个栈分别做中序「前驱」（从大到小）和「后继」（从小到大）迭代器，
// 像合并两个有序数组一样取最接近的 k 个。
// 时间 O(n) 最坏，平均 O(h + k)，空间 O(h)。
function closestKValues(root: TreeNode | null, target: number, k: number): number[] {
  const succStack: TreeNode[] = []; // 后继（升序）
  const predStack: TreeNode[] = []; // 前驱（降序）
  // 初始化：后继栈一路向左，前驱栈一路向右
  let cur = root;
  while (cur !== null) {
    succStack.push(cur);
    cur = cur.left;
  }
  cur = root;
  while (cur !== null) {
    predStack.push(cur);
    cur = cur.right;
  }

  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    if (succStack.length === 0 && predStack.length === 0) break;
    if (succStack.length === 0) {
      result.push(getPredecessor(predStack));
    } else if (predStack.length === 0) {
      result.push(getSuccessor(succStack));
    } else {
      const succDiff = Math.abs(succStack[succStack.length - 1].val - target);
      const predDiff = Math.abs(predStack[predStack.length - 1].val - target);
      if (succDiff <= predDiff) {
        result.push(getSuccessor(succStack));
      } else {
        result.push(getPredecessor(predStack));
      }
    }
  }
  return result;
}

// 后继迭代器：弹出栈顶，对其右子树一路向左压栈
function getSuccessor(stack: TreeNode[]): number {
  const node = stack.pop()!;
  let cur = node.right;
  while (cur !== null) {
    stack.push(cur);
    cur = cur.left;
  }
  return node.val;
}

// 前驱迭代器：弹出栈顶，对其左子树一路向右压栈
function getPredecessor(stack: TreeNode[]): number {
  const node = stack.pop()!;
  let cur = node.left;
  while (cur !== null) {
    stack.push(cur);
    cur = cur.right;
  }
  return node.val;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     4
  //    / \
  //   2   5
  //  / \
  // 1   3
  const root = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(5));
  console.log("测试1:", closestKValues(root, 3.714286, 2), "期望: [4,5]");
  console.log("测试2:", closestKValues(root, 2.0, 2), "期望: [2,1] 或 [2,3]");
}

test();

export {};
