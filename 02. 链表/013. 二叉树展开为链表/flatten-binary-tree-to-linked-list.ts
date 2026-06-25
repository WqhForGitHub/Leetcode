// ============================================================
// 013. 二叉树展开为链表
// ============================================================
// LeetCode 114. Flatten Binary Tree to Linked List
// 给定二叉树根节点 root，将其展开为"右链"形式：前序遍历顺序，每个节点只有 right 子节点，left 为 null。
// 时间复杂度：O(n)，空间复杂度：O(1)（迭代法）/ O(n)（递归栈）

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

// 辅助函数：数组转二叉树（层序）
function arrayToTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
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

// 辅助函数：将展开后的右链转为数组
function flattenedTreeToArray(root: TreeNode | null): number[] {
  const result: number[] = [];
  while (root !== null) {
    result.push(root.val);
    root = root.right;
  }
  return result;
}

// ============================================================
// 方法1：递归（先展开左右子树，再拼接）（推荐）
// ============================================================
function flatten(root: TreeNode | null): void {
  if (root === null) return;

  // 递归展开左右子树
  flatten(root.left);
  flatten(root.right);

  // 将左子树接到右边，原右子树接到左子树末尾
  const left = root.left;
  const right = root.right;

  root.left = null;
  root.right = left;

  // 找到当前右链（原左子树）的末尾，接上原右子树
  let curr: TreeNode | null = root;
  while (curr.right !== null) {
    curr = curr.right;
  }
  curr.right = right;
}

// ============================================================
// 方法2：迭代（前驱节点法）O(1) 空间
// ============================================================
function flattenIterative(root: TreeNode | null): void {
  let curr = root;
  while (curr !== null) {
    if (curr.left !== null) {
      // 找到左子树的最右节点（前驱）
      let predecessor: TreeNode | null = curr.left;
      while (predecessor.right !== null) {
        predecessor = predecessor.right;
      }
      // 将原右子树接到前驱的右侧
      predecessor.right = curr.right;
      // 左子树移到右边
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 二叉树展开为链表 =====");

// 测试1: [1,2,5,3,4,null,6]
const tree1 = arrayToTree([1, 2, 5, 3, 4, null, 6]);
flatten(tree1);
console.log("测试1 (递归):", flattenedTreeToArray(tree1));
// 预期: [1,2,3,4,5,6]

// 测试2: 使用迭代法
const tree2 = arrayToTree([1, 2, 5, 3, 4, null, 6]);
flattenIterative(tree2);
console.log("测试2 (迭代):", flattenedTreeToArray(tree2));
// 预期: [1,2,3,4,5,6]

// 测试3: 空树
const tree3 = arrayToTree([]);
flatten(tree3);
console.log("测试3 (空树):", flattenedTreeToArray(tree3));
// 预期: []

// 测试4: 单节点
const tree4 = arrayToTree([0]);
flatten(tree4);
console.log("测试4 (单节点):", flattenedTreeToArray(tree4));
// 预期: [0]

export {};
