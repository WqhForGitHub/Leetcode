// ============================================================
// 078. 在二叉树中增加一行
// ============================================================
// LeetCode 623. Add One Row to Tree
// 给定一个二叉树的根 root 和两个整数 val 和 depth，
// 在给定的深度 depth 处添加一个值为 val 的节点行。
// 新节点会作为原来该层节点的父节点，原节点变为新节点的左右孩子。
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

// 方法1：BFS（推荐）
// 层序遍历到 depth-1 层，对该层每个节点插入新行
function addOneRow(
  root: TreeNode | null,
  val: number,
  depth: number
): TreeNode | null {
  // 特殊情况：在根层插入
  if (depth === 1) {
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }
  // BFS 找到第 depth-1 层
  const queue: TreeNode[] = [root!];
  let currentDepth = 1;
  while (queue.length > 0 && currentDepth < depth - 1) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    currentDepth++;
  }
  // 此时 queue 中是第 depth-1 层的所有节点
  for (const node of queue) {
    const oldLeft = node.left;
    const oldRight = node.right;
    node.left = new TreeNode(val);
    node.left.left = oldLeft;
    node.right = new TreeNode(val);
    node.right.right = oldRight;
  }
  return root;
}

// 方法2：DFS递归
// 当到达目标层 depth-1 时插入新节点
function addOneRowDFS(
  root: TreeNode | null,
  val: number,
  depth: number
): TreeNode | null {
  if (depth === 1) {
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }
  function dfs(node: TreeNode | null, currentDepth: number): void {
    if (node === null) return;
    if (currentDepth === depth - 1) {
      const oldLeft = node.left;
      const oldRight = node.right;
      node.left = new TreeNode(val);
      node.left.left = oldLeft;
      node.right = new TreeNode(val);
      node.right.right = oldRight;
      return;
    }
    dfs(node.left, currentDepth + 1);
    dfs(node.right, currentDepth + 1);
  }
  dfs(root, 1);
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 在二叉树中增加一行 =====");

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

// 测试1: root = [4,2,6,3,1,5], val = 1, depth = 2
//     4            4
//    / \         /   \
//   2   6  =>   1     1
//  /\  /        /     /
// 3 1 5        2     6
//             / \   /
//            3   1 5
const tree1 = new TreeNode(4);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(6);
tree1.left.left = new TreeNode(3);
tree1.left.right = new TreeNode(1);
tree1.right.left = new TreeNode(5);
console.log("BFS:", treeToArray(addOneRow(tree1, 1, 2))); // 期望 [4,1,1,2,null,null,6,3,1,5]

// 测试2: depth = 3
const tree2 = new TreeNode(4);
tree2.left = new TreeNode(2);
tree2.left.left = new TreeNode(3);
tree2.left.right = new TreeNode(1);
console.log("BFS:", treeToArray(addOneRow(tree2, 1, 3))); // 期望 [4,2,null,1,1,3,null,null,1]

// 测试3: depth = 1
const tree3 = new TreeNode(4);
tree3.left = new TreeNode(2);
console.log("BFS depth=1:", treeToArray(addOneRow(tree3, 1, 1))); // 期望 [1,4,null,2]

export {};
