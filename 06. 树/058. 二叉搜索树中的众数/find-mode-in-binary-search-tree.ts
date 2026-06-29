// ============================================================
// 058. 二叉搜索树中的众数
// ============================================================
// LeetCode 501. Find Mode in Binary Search Tree
// 给你一个含重复值的二叉搜索树的根节点 root，找出并返回 BST 中的所有众数。
// 众数即出现频率最高的元素值。BST中序遍历是递增序列。
// 时间复杂度：O(n)，空间复杂度：O(1)（Morris）或 O(h)（递归）

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

// 方法1：中序遍历递归（推荐）
// BST中序遍历是递增序列，相同元素会连续出现
// 维护当前元素值、当前计数、最大计数
function findMode(root: TreeNode | null): number[] {
  let currentVal = 0;
  let currentCount = 0;
  let maxCount = 0;
  const result: number[] = [];

  function handle(val: number): void {
    if (val === currentVal) {
      currentCount++;
    } else {
      currentVal = val;
      currentCount = 1;
    }
    if (currentCount > maxCount) {
      maxCount = currentCount;
      result.length = 0;
      result.push(val);
    } else if (currentCount === maxCount) {
      result.push(val);
    }
  }

  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    handle(node.val);
    inorder(node.right);
  }

  inorder(root);
  return result;
}

// 方法2：Morris中序遍历
// 使用Morris遍历实现O(1)空间复杂度的中序遍历
function findModeMorris(root: TreeNode | null): number[] {
  let currentVal = 0;
  let currentCount = 0;
  let maxCount = 0;
  const result: number[] = [];

  function handle(val: number): void {
    if (val === currentVal) {
      currentCount++;
    } else {
      currentVal = val;
      currentCount = 1;
    }
    if (currentCount > maxCount) {
      maxCount = currentCount;
      result.length = 0;
      result.push(val);
    } else if (currentCount === maxCount) {
      result.push(val);
    }
  }

  let curr: TreeNode | null = root;
  let prev: TreeNode | null = null;

  while (curr !== null) {
    if (curr.left === null) {
      handle(curr.val);
      curr = curr.right;
    } else {
      // 找到前驱节点
      prev = curr.left;
      while (prev.right !== null && prev.right !== curr) {
        prev = prev.right;
      }
      if (prev.right === null) {
        prev.right = curr;
        curr = curr.left;
      } else {
        prev.right = null;
        handle(curr.val);
        curr = curr.right;
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 二叉搜索树中的众数 =====");
// 构造BST: [1,null,2,2]
//     1
//      \
//       2
//      /
//     2
const tree1 = new TreeNode(1);
tree1.right = new TreeNode(2);
tree1.right.left = new TreeNode(2);
console.log("中序递归:", findMode(tree1)); // 期望结果 [2]
console.log("Morris:", findModeMorris(tree1)); // 期望结果 [2]

// 构造BST: [0]
const tree2 = new TreeNode(0);
console.log("中序递归:", findMode(tree2)); // 期望结果 [0]
console.log("Morris:", findModeMorris(tree2)); // 期望结果 [0]

// 构造BST: [1,null,2,null,null,2]
// 多个众数测试
const tree3 = new TreeNode(1);
tree3.right = new TreeNode(2);
console.log("中序递归:", findMode(tree3)); // 期望结果 [1,2]
console.log("Morris:", findModeMorris(tree3)); // 期望结果 [1,2]

export {};
