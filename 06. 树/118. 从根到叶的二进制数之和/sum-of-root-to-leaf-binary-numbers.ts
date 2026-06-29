// ============================================================
// 118. 从根到叶的二进制数之和
// ============================================================
// LeetCode 1022. Sum of Root To Leaf Binary Numbers
// 给出一棵二叉树，其上每个结点的值都是 0 或 1。每一条从根到叶的路径都代表一个从最高有效位开始的二进制数。
// 返回这些数字之和（对 10^9 + 7 取模）。
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

const MOD = 1e9 + 7;

// 方法1：DFS递归（推荐）
// 维护从根到当前节点构成的二进制值，到叶子时累加
function sumRootToLeaf(root: TreeNode | null): number {
  return dfs(root, 0);
}

function dfs(node: TreeNode | null, currentVal: number): number {
  if (node === null) return 0;

  // 更新当前路径的二进制值：左移一位并加上当前位
  const newVal = (currentVal * 2 + node.val) % MOD;

  // 叶子节点：返回当前路径的值
  if (node.left === null && node.right === null) {
    return newVal;
  }

  // 非叶子：递归左右子树并求和
  return (dfs(node.left, newVal) + dfs(node.right, newVal)) % MOD;
}

// 方法2：迭代BFS
// 使用队列存储节点和对应的路径值
function sumRootToLeafBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let sum = 0;
  const queue: { node: TreeNode; val: number }[] = [{ node: root, val: root.val }];

  while (queue.length > 0) {
    const { node, val } = queue.shift()!;

    // 叶子节点：累加
    if (node.left === null && node.right === null) {
      sum = (sum + val) % MOD;
      continue;
    }

    if (node.left !== null) {
      queue.push({ node: node.left, val: (val * 2 + node.left.val) % MOD });
    }
    if (node.right !== null) {
      queue.push({ node: node.right, val: (val * 2 + node.right.val) % MOD });
    }
  }

  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 从根到叶的二进制数之和 =====");

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

// 测试1: root = [1,0,1,0,1,0,1]
//        1
//       / \
//      0   1
//     / \  / \
//    0  1 0  1
// 路径: 100=4, 101=5, 100=4, 101=5 -> 和=22
const tree1 = buildTree([1, 0, 1, 0, 1, 0, 1]);
console.log("测试1 递归:", sumRootToLeaf(tree1)); // 期望 22
const tree1b = buildTree([1, 0, 1, 0, 1, 0, 1]);
console.log("测试1 BFS:", sumRootToLeafBFS(tree1b)); // 期望 22

// 测试2: root = [0]
const tree2 = buildTree([0]);
console.log("测试2 递归:", sumRootToLeaf(tree2)); // 期望 0
const tree2b = buildTree([0]);
console.log("测试2 BFS:", sumRootToLeafBFS(tree2b)); // 期望 0

// 测试3: root = [1]
const tree3 = buildTree([1]);
console.log("测试3 递归:", sumRootToLeaf(tree3)); // 期望 1

// 测试4: root = [1,1]
//   1
//  /
// 1
// 路径: 11 = 3
const tree4 = buildTree([1, 1]);
console.log("测试4 递归:", sumRootToLeaf(tree4)); // 期望 3

export {};
