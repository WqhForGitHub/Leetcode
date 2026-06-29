// ============================================================
// 114. 从叶结点开始的最小字符串
// ============================================================
// LeetCode 988. Smallest String Starting From Leaf
// 给定一棵根结点为 root 的二叉树，树中的每个结点都有一个从 0 到 25 的值，分别代表字母 'a' 到 'z'。
// 找出按字典序最小的从叶子到根的字符串。
// 时间复杂度：O(n * L)，空间复杂度：O(h) （L为最长路径长度）

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

// 方法1：DFS递归（推荐）
// 维护当前路径（从根到当前节点），到叶子时构造从叶到根的字符串与答案比较
let best: string;

function smallestFromLeaf(root: TreeNode | null): string {
  best = "";
  dfs(root, "");
  return best;
}

function dfs(node: TreeNode | null, path: string): void {
  if (node === null) return;

  // 当前节点字符加到路径头部（实现从叶到根的顺序）
  const currentPath = String.fromCharCode(node.val + 97) + path;

  // 叶子节点：与当前最优比较
  if (node.left === null && node.right === null) {
    if (best === "" || currentPath < best) {
      best = currentPath;
    }
    return;
  }

  dfs(node.left, currentPath);
  dfs(node.right, currentPath);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 从叶结点开始的最小字符串 =====");

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

// 测试1: root = [0,1,2,3,4,3,4]
//         a(0)
//        /    \
//      b(1)   c(2)
//      / \    / \
//    d(3)e(4)d(3)e(4)
// 叶到根的字符串：
//  d-b-a: "dba"
//  e-b-a: "eba"
//  d-c-a: "dca"
//  e-c-a: "eca"
// 最小: "dba"
const tree1 = buildTree([0, 1, 2, 3, 4, 3, 4]);
console.log("测试1:", smallestFromLeaf(tree1)); // 期望 "dba"

// 测试2: root = [25,1,3,1,3,0,2]
//         z(25)
//        /    \
//      b(1)   d(3)
//      / \    / \
//    b(1)d(3)a(0)c(2)
// 叶到根字符串：
//  b-b-z: "bbz"
//  d-b-z: "dbz"
//  a-d-z: "adz"
//  c-d-z: "cdz"
// 最小: "adz"
const tree2 = buildTree([25, 1, 3, 1, 3, 0, 2]);
console.log("测试2:", smallestFromLeaf(tree2)); // 期望 "adz"

// 测试3: 单节点
const tree3 = buildTree([0]);
console.log("测试3:", smallestFromLeaf(tree3)); // 期望 "a"

// 测试4: root = [2,2,1,null,1,0,null,0]
//         c(2)
//        /    \
//      c(2)   b(1)
//        \    /
//        b(1)a(0)
//        /
//       a(0)
// 字符串：
//  a-b-c-c: "abcc"
//  a-b-c: "abc"
// 最小: "abcc" vs "abc" -> "abcc" < "abc"? 不，"abc"更短且前缀相同
// 实际比较: "abc" < "abcc"，所以最小是 "abc"
const tree4 = buildTree([2, 2, 1, null, 1, 0, null, 0]);
console.log("测试4:", smallestFromLeaf(tree4)); // 期望 "abc"

export {};
