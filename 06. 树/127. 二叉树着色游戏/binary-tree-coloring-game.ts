// ============================================================
// 127. 二叉树着色游戏
// ============================================================
// LeetCode 1145. Binary Tree Coloring Game
// 有两位玩家参与二叉树着色游戏，第一位玩家给一个节点着蓝色，
// 第二位玩家给相邻节点着红色。判断第二位玩家是否能赢。
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

// 方法1：计算三棵子树的节点数
// 第二个玩家可选的相邻节点有三个：x 的左子树、x 的右子树、x 的父节点所在子树
// 第二个玩家应选择节点数最多的那个，若该数量 > n/2，则能赢
// 因为：第一个玩家选了 x，把树分成三个连通块（左、右、父方向）
// 第二个玩家选其中最大的，剩下两个连通块给第一个玩家
// 由于第二个玩家先手选最大块，他能染的节点数 >= 那一块的大小
// 若该块 > n/2，则第二个玩家染的节点数严格大于第一个玩家
function btreeGameWinningMove(
  root: TreeNode | null,
  n: number,
  x: number
): boolean {
  // 先找到值为 x 的节点
  const xNode = findNode(root, x);
  if (xNode === null) return false;

  // 计算 x 的左子树、右子树节点数
  const leftCount = countNodes(xNode.left);
  const rightCount = countNodes(xNode.right);
  // 父节点方向的节点数 = n - leftCount - rightCount - 1
  const parentCount = n - leftCount - rightCount - 1;

  const maxCount = Math.max(leftCount, rightCount, parentCount);
  return maxCount > n / 2;
}

function findNode(node: TreeNode | null, x: number): TreeNode | null {
  if (node === null) return null;
  if (node.val === x) return node;
  return findNode(node.left, x) ?? findNode(node.right, x);
}

function countNodes(node: TreeNode | null): number {
  if (node === null) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 二叉树着色游戏 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(leftVal) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(rightVal) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: root = [1,2,3,4,5,6,7,8,9,10,11], n = 11, x = 3
// x=3 的左子树 [6,12,13] 不存在；这里只测试结构
console.log(
  "测试1:",
  btreeGameWinningMove(
    buildTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    11,
    3
  )
); // 期望 true

// 测试2: root = [1,2,3], n = 3, x = 1
// x=1 为根，左子树大小1，右子树大小1，父方向大小0
// max=1, n/2=1.5, 1 > 1.5 为 false
console.log("测试2:", btreeGameWinningMove(buildTree([1, 2, 3]), 3, 1)); // 期望 false

export {};
