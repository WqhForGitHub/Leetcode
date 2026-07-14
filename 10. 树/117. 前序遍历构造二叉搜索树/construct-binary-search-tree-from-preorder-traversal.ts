// ============================================================
// 117. 前序遍历构造二叉搜索树
// ============================================================
// LeetCode 1008. Construct Binary Search Tree from Preorder Traversal
// 给定一个整数数组 preorder，它表示二叉搜索树的前序遍历，构造该树并返回其根节点。
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

let preOrder: number[];
let preIdx: number;

// 方法1：递归利用上下界（推荐）
// 前序遍历第一个是根，后续元素中比根小的属于左子树，比根大的属于右子树
// 用上下界约束递归，按 preIdx 顺序消费元素
function bstFromPreorder(preorder: number[]): TreeNode | null {
  preOrder = preorder;
  preIdx = 0;
  return build(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}

function build(lower: number, upper: number): TreeNode | null {
  if (preIdx >= preOrder.length) return null;
  const val = preOrder[preIdx];
  // 值不在 (lower, upper) 范围内，不属于当前子树
  if (val < lower || val > upper) return null;

  preIdx++;
  const node = new TreeNode(val);
  node.left = build(lower, val); // 左子树上界为当前值
  node.right = build(val, upper); // 右子树下界为当前值
  return node;
}

// 方法2：迭代栈
// 用栈模拟：新节点若比栈顶小，是栈顶的左孩子；否则弹出栈顶直到栈顶比新节点大，作为最后一个弹出节点的右孩子
function bstFromPreorderIterative(preorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const stack: TreeNode[] = [root];

  for (let i = 1; i < preorder.length; i++) {
    const node = new TreeNode(preorder[i]);
    let parent: TreeNode | null = null;

    // 找到合适的父节点
    if (preorder[i] < stack[stack.length - 1].val) {
      // 比栈顶小，是栈顶的左孩子
      parent = stack[stack.length - 1];
      parent.left = node;
    } else {
      // 比栈顶大，弹出栈顶直到栈顶比新节点大
      while (stack.length > 0 && stack[stack.length - 1].val < preorder[i]) {
        parent = stack.pop()!;
      }
      // parent 是最后一个弹出的节点，新节点是其右孩子
      parent!.right = node;
    }
    stack.push(node);
  }

  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 前序遍历构造二叉搜索树 =====");

// 辅助函数：树转数组（层序）
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

// 测试1: preorder = [8,5,1,7,10,12]
//       8
//      / \
//     5  10
//    / \   \
//   1   7   12
console.log("测试1 递归:", treeToArray(bstFromPreorder([8, 5, 1, 7, 10, 12])));
// 期望 [8,5,10,1,7,null,12]
console.log("测试1 迭代:", treeToArray(bstFromPreorderIterative([8, 5, 1, 7, 10, 12])));

// 测试2: preorder = [1,3]
//   1
//    \
//     3
console.log("测试2 递归:", treeToArray(bstFromPreorder([1, 3]))); // 期望 [1,null,3]
console.log("测试2 迭代:", treeToArray(bstFromPreorderIterative([1, 3])));

// 测试3: preorder = [5]
console.log("测试3 递归:", treeToArray(bstFromPreorder([5]))); // 期望 [5]

// 测试4: preorder = [4,2]
//   4
//  /
// 2
console.log("测试4 递归:", treeToArray(bstFromPreorder([4, 2]))); // 期望 [4,2]

export {};
