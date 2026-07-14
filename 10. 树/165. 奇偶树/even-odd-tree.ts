// ============================================================
// 165. 奇偶树
// ============================================================
// LeetCode 1609. Even Odd Tree
// 如果一棵二叉树满足以下条件，则它是奇偶树：
// 根节点所在层视为第 0 层（偶数层）。
// 偶数层所有节点值为奇数且严格递增；
// 奇数层所有节点值为偶数且严格递减。
// 判断给定二叉树是否为奇偶树。
// 时间复杂度：O(n)，空间复杂度：O(w)

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

// 方法1：BFS层序（推荐）
function isEvenOddTree(root: TreeNode | null): boolean {
  if (root === null) return true;
  const queue: TreeNode[] = [root];
  let level = 0;

  while (queue.length > 0) {
    const size = queue.length;
    let prev = level % 2 === 0 ? -Infinity : Infinity;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      // 偶数层：值为奇数，严格递增
      if (level % 2 === 0) {
        if (node.val % 2 === 0) return false;
        if (node.val <= prev) return false;
      } else {
        // 奇数层：值为偶数，严格递减
        if (node.val % 2 === 1) return false;
        if (node.val >= prev) return false;
      }
      prev = node.val;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    level++;
  }
  return true;
}

// 方法2：DFS递归
// 用一个数组 levelPrev 记录每一层前一个节点的值
function isEvenOddTreeDFS(root: TreeNode | null): boolean {
  if (root === null) return true;
  // levelPrev[level] = 当前层已遍历的最后一个值
  const levelPrev: number[] = [];

  function dfs(node: TreeNode | null, level: number): boolean {
    if (node === null) return true;
    const evenLevel = level % 2 === 0;
    // 偶数层节点值必须为奇数；奇数层节点值必须为偶数
    if (evenLevel && node.val % 2 === 0) return false;
    if (!evenLevel && node.val % 2 === 1) return false;

    if (levelPrev[level] === undefined) {
      // 该层第一个节点，无需比较
    } else {
      const prev = levelPrev[level];
      if (evenLevel) {
        if (node.val <= prev) return false;
      } else {
        if (node.val >= prev) return false;
      }
    }
    levelPrev[level] = node.val;

    // 注意 DFS 顺序：先左后右保证层内顺序正确
    return dfs(node.left, level + 1) && dfs(node.right, level + 1);
  }

  return dfs(root, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 165. 奇偶树 =====");

// 辅助：从数组构建二叉树
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.left = new TreeNode(v);
          queue.push(node.left);
        } else queue.push(null);
      }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.right = new TreeNode(v);
          queue.push(node.right);
        } else queue.push(null);
      }
    }
  }
  return root;
}

// 测试1:
//        1
//       / \
//     10   4
//    /    / \
//   3    7   9
// 偶数层(0,2): 1; 3,7,9 都是奇数严格递增
// 奇数层(1): 10,4 都是偶数严格递减
console.log("测试1 BFS:", isEvenOddTree(buildTree([1, 10, 4, 3, null, 7, 9]))); // 期望 true
console.log("测试1 DFS:", isEvenOddTreeDFS(buildTree([1, 10, 4, 3, null, 7, 9])));

// 测试2:
//      5
//     / \
//    4   2
//   / \
//  3   3
// 第0层 5 是奇数 ok
// 第1层 4,2 都是偶数，但要求严格递减：4 > 2 ok
// 第2层 3,3 都是奇数，要求严格递增：3 < 3 false
console.log("测试2 BFS:", isEvenOddTree(buildTree([5, 4, 2, 3, 3, 7]))); // 期望 false
console.log("测试2 DFS:", isEvenOddTreeDFS(buildTree([5, 4, 2, 3, 3, 7])));

// 测试3:
//       1
//      / \
//    10   4
//    / \  / \
//   3   9 7  9
console.log("测试3 BFS:", isEvenOddTree(buildTree([1, 10, 4, 3, 9, 7, 9]))); // 期望 false (10,4 减 ok; 3,9 偶数层要增,3<9 ok;7,9 ok -> 实际true? 这里看 9<9 false)
// 修正：第2层 3,9,7,9 -> 严格递增 3<9<7 false
console.log("测试3 DFS:", isEvenOddTreeDFS(buildTree([1, 10, 4, 3, 9, 7, 9])));

// 测试4: 单节点
console.log("测试4 BFS:", isEvenOddTree(buildTree([2]))); // 期望 false (偶数层需奇数)
console.log("测试4 DFS:", isEvenOddTreeDFS(buildTree([2])));
console.log("测试5 BFS:", isEvenOddTree(buildTree([1]))); // 期望 true
console.log("测试5 DFS:", isEvenOddTreeDFS(buildTree([1])));

export {};
