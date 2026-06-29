// ============================================================
// 116. 最大二叉树 II
// ============================================================
// LeetCode 998. Maximum Binary Tree II
// 给定一个最大二叉树 root 和一个整数 val。将 val 插入最大二叉树中并返回新的根节点。
// 插入规则：将 val 追加到原数组末尾后构造最大二叉树。
// 最大二叉树：根是数组最大值，左右子树递归构造。
// 时间复杂度：O(h)，空间复杂度：O(h)

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

// 方法1：递归（推荐）
// val 加在数组末尾，所以它一定在根的右子树方向。
// 沿右子树向下，找到第一个比 val 小的节点（或 null）：
// - 若当前节点为 null：val 作为新节点
// - 若当前节点值 > val：递归插入到右子树
// - 若当前节点值 < val：val 替换当前节点，原节点作为 val 的左孩子
function insertIntoMaxTree(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return new TreeNode(val);

  if (root.val < val) {
    // val 比当前根大，val 成为新根，原树作为 val 的左子树
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }

  // root.val > val，递归插入到右子树
  root.right = insertIntoMaxTree(root.right, val);
  return root;
}

// 方法2：迭代
// 同样逻辑，迭代沿右子树向下
function insertIntoMaxTreeIterative(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return new TreeNode(val);

  // 若 val 比根大，val 成为新根
  if (root.val < val) {
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }

  // 沿右子树向下找到插入位置
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (curr.right === null) {
      // 右子树为空，直接插入
      curr.right = new TreeNode(val);
      break;
    } else if (curr.right.val < val) {
      // 右孩子比 val 小，val 替换右孩子，原右孩子作为 val 的左子树
      const newNode = new TreeNode(val);
      newNode.left = curr.right;
      curr.right = newNode;
      break;
    } else {
      // 右孩子比 val 大，继续向右
      curr = curr.right;
    }
  }

  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. 最大二叉树 II =====");

// 辅助函数：从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
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
  // 去除末尾的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: root = [4,1,3,null,null,2], val = 5
// 原数组 [2,1,3,4] -> 最大二叉树
// 加5后数组 [2,1,3,4,5]，5最大为新根，原树作为左子树
const tree1 = buildTree([4, 1, 3, null, null, 2]);
console.log("测试1 递归:", treeToArray(insertIntoMaxTree(tree1, 5))); // 期望 [5,4,null,2,1,3]
const tree1b = buildTree([4, 1, 3, null, null, 2]);
console.log("测试1 迭代:", treeToArray(insertIntoMaxTreeIterative(tree1b, 5))); // 期望 [5,4,null,2,1,3]

// 测试2: root = [5,2,4,null,1], val = 3
// 原数组 [1,2,5,4]
// 加3后数组 [1,2,5,4,3]，3插入到右子树方向
const tree2 = buildTree([5, 2, 4, null, 1]);
console.log("测试2 递归:", treeToArray(insertIntoMaxTree(tree2, 3))); // 期望 [5,2,4,null,1,null,null,3]
const tree2b = buildTree([5, 2, 4, null, 1]);
console.log("测试2 迭代:", treeToArray(insertIntoMaxTreeIterative(tree2b, 3)));

// 测试3: root = [5,2,3], val = 4
// 4比5小但比3大，替换3
const tree3 = buildTree([5, 2, 3]);
console.log("测试3 递归:", treeToArray(insertIntoMaxTree(tree3, 4))); // 期望 [5,2,4,null,null,3]

// 测试4: 空树插入
console.log("测试4 递归:", treeToArray(insertIntoMaxTree(null, 1))); // 期望 [1]

export {};
