// ============================================================
// 083. 输出二叉树
// ============================================================
// LeetCode 655. Print Binary Tree
// 在一个 m x n 的二维字符串数组中打印出二叉树。
// 规则：根节点居中；每层节点位置由父节点位置二分确定；空位用 "" 填充。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)

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
// 先求树高 height，则列数 cols = 2^(height+1) - 1
// 根节点放在第0行中间列，左右孩子位置二分递归
function printTree(root: TreeNode | null): string[][] {
  function getHeight(node: TreeNode | null): number {
    if (node === null) return -1;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }
  const height = getHeight(root);
  const rows = height + 1;
  const cols = Math.pow(2, height + 1) - 1;
  const result: string[][] = Array.from({ length: rows }, () => new Array(cols).fill(""));

  function fill(node: TreeNode | null, row: number, left: number, right: number): void {
    if (node === null) return;
    const mid = Math.floor((left + right) / 2);
    result[row][mid] = node.val.toString();
    fill(node.left, row + 1, left, mid - 1);
    fill(node.right, row + 1, mid + 1, right);
  }
  fill(root, 0, 0, cols - 1);
  return result;
}

// 方法2：BFS
// 层序遍历，记录每个节点的行、列、父列范围
function printTreeBFS(root: TreeNode | null): string[][] {
  if (root === null) return [];
  function getHeight(node: TreeNode | null): number {
    if (node === null) return -1;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }
  const height = getHeight(root);
  const rows = height + 1;
  const cols = Math.pow(2, height + 1) - 1;
  const result: string[][] = Array.from({ length: rows }, () => new Array(cols).fill(""));
  // 队列存储 [节点, 行, 左边界, 右边界]
  const queue: [TreeNode, number, number, number][] = [[root, 0, 0, cols - 1]];
  while (queue.length > 0) {
    const [node, row, left, right] = queue.shift()!;
    const mid = Math.floor((left + right) / 2);
    result[row][mid] = node.val.toString();
    if (node.left) queue.push([node.left, row + 1, left, mid - 1]);
    if (node.right) queue.push([node.right, row + 1, mid + 1, right]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 输出二叉树 =====");

// 测试1: root = [1,2]
// 树高1，列数 3
// ["", "1", ""]
// ["2", "", ""]
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(2);
console.log("DFS:", JSON.stringify(printTree(tree1)));
console.log("BFS:", JSON.stringify(printTreeBFS(tree1)));
// 期望 [["","1",""],["2","",""]]

// 测试2: root = [1,2,3,null,4]
//       1
//      / \
//     2   3
//      \
//       4
// 树高2，列数 7
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(2);
tree2.right = new TreeNode(3);
tree2.left.right = new TreeNode(4);
console.log("DFS:", JSON.stringify(printTree(tree2)));
console.log("BFS:", JSON.stringify(printTreeBFS(tree2)));
// 期望 [["","1","","","","",""],["","2","","","3","",""],["","","","4","","",""]]

// 测试3: 单节点
const tree3 = new TreeNode(1);
console.log("DFS:", JSON.stringify(printTree(tree3))); // 期望 [["1"]]
console.log("BFS:", JSON.stringify(printTreeBFS(tree3))); // 期望 [["1"]]

export {};
