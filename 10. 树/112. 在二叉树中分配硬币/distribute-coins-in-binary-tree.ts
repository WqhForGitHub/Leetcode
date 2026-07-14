// ============================================================
// 112. 在二叉树中分配硬币
// ============================================================
// LeetCode 979. Distribute Coins in Binary Tree
// 给定一个有 N 个结点的二叉树的根节点 root，树中的每个结点上都对应有 node.val 枚硬币。
// 返回使每个结点上只有一枚硬币所需的移动次数（一次移动指将一枚硬币从一节点移到相邻节点）。
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

// 方法1：DFS后序递归（推荐）
// 对每个节点，计算其子树（含自身）的"过剩/不足"金币数：
//   flow = node.val - 1 + leftFlow + rightFlow
// 该 flow 的绝对值就是该节点与父节点之间必须发生的移动次数。
// 累加所有 |flow| 即为答案。
let moves: number;

function distributeCoins(root: TreeNode | null): number {
  moves = 0;
  dfs(root);
  return moves;
}

function dfs(node: TreeNode | null): number {
  if (node === null) return 0;
  const leftFlow = dfs(node.left);
  const rightFlow = dfs(node.right);
  // 当前节点的过剩金币数（正数表示要向上送出，负数表示要从父节点获得）
  const flow = node.val - 1 + leftFlow + rightFlow;
  // 累加移动次数（与父节点之间的流量）
  moves += Math.abs(flow);
  return flow;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. 在二叉树中分配硬币 =====");

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

// 测试1: root = [3,0,0]
//     3
//    / \
//   0   0
// 根节点有3枚硬币，需要分别给左右孩子各1枚，共2次移动
const tree1 = buildTree([3, 0, 0]);
console.log("测试1:", distributeCoins(tree1)); // 期望 2

// 测试2: root = [0,3,0]
//     0
//    / \
//   3   0
// 左孩子3枚，1枚给根，1枚从根给右孩子，共3次移动
const tree2 = buildTree([0, 3, 0]);
console.log("测试2:", distributeCoins(tree2)); // 期望 3

// 测试3: root = [1,0,2]
//     1
//    / \
//   0   2
// 右孩子2枚，1枚给根，根给左孩子1枚，共2次移动
const tree3 = buildTree([1, 0, 2]);
console.log("测试3:", distributeCoins(tree3)); // 期望 2

// 测试4: 单节点1枚硬币
const tree4 = buildTree([1]);
console.log("测试4:", distributeCoins(tree4)); // 期望 0

// 测试5: root = [1,0,0,null,3]
//       1
//      / \
//     0   0
//      \
//       3
const tree5 = buildTree([1, 0, 0, null, 3]);
console.log("测试5:", distributeCoins(tree5)); // 期望 4

export {};
