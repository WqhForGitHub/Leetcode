// ============================================================
// 092. 二叉搜索树中的插入操作
// ============================================================
// LeetCode 701. Insert into a Binary Search Tree
// 给定二叉搜索树（BST）的根节点和要插入树中的值，将值插入 BST 中。
// 返回插入后 BST 的根节点。输入数据保证新值在原 BST 中不存在。
// 时间复杂度：O(h)，空间复杂度：O(h) 递归 / O(1) 迭代（h为树高）

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
// 若 val 小于当前节点值，递归插入左子树；否则递归插入右子树。
// 当走到 null 时，新建节点并返回。
function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return new TreeNode(val);
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  return root;
}

// 方法2：迭代
// 找到插入位置的父节点，然后根据大小挂到左或右
function insertIntoBSTIter(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return new TreeNode(val);
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (val < curr.val) {
      if (curr.left === null) {
        curr.left = new TreeNode(val);
        break;
      }
      curr = curr.left;
    } else {
      if (curr.right === null) {
        curr.right = new TreeNode(val);
        break;
      }
      curr = curr.right;
    }
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 二叉搜索树中的插入操作 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeFromArrayInsert(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 辅助函数：中序遍历打印（验证 BST 性质）
function inorderTraversalInsert(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// 测试1: BST = [4,2,7,1,3], val = 5
//       4                  4
//      / \                / \
//     2   7    =>        2   7
//    / \                / \  /
//   1   3              1   3 5
const tree1 = buildTreeFromArrayInsert([4, 2, 7, 1, 3]);
const newTree1 = insertIntoBST(tree1, 5);
console.log("递归 - 插入5后的中序:", inorderTraversalInsert(newTree1)); // 期望 [1,2,3,4,5,7]

// 测试2: 空树插入
const emptyTree = insertIntoBST(null, 10);
console.log("空树插入10:", emptyTree?.val); // 期望 10

// 测试3: 迭代插入
const tree2 = buildTreeFromArrayInsert([40, 20, 60, 10, 30, 50, 70]);
const newTree2 = insertIntoBSTIter(tree2, 25);
console.log("迭代 - 插入25后的中序:", inorderTraversalInsert(newTree2)); // 期望 [10,20,25,30,40,50,60,70]

// 测试4: 插入比所有节点都大的值
const tree3 = buildTreeFromArrayInsert([5, 3]);
const newTree3 = insertIntoBST(tree3, 8);
console.log("递归 - 插入8后的中序:", inorderTraversalInsert(newTree3)); // 期望 [3,5,8]

export {};
