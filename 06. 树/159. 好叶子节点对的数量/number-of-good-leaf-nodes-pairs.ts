// ============================================================
// 159. 好叶子节点对的数量
// ============================================================
// LeetCode 1530. Number of Good Leaf Nodes Pairs
// 给定一棵二叉树 root 和一个整数 distance，
// 返回好叶子节点对的数量。
// 好叶子节点对是指两个叶子节点之间最短路径长度 <= distance。
// 时间复杂度：O(n * distance^2)，空间复杂度：O(n * distance)

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

// 方法1：DFS后序返回距离数组
// 每个节点返回一个数组 ret，ret[d] 表示从该节点子树内叶子节点到该节点距离为 d 的个数
// 在每个节点处合并左右子树的距离数组，计算路径经过该节点的叶子对数
function countPairs(root: TreeNode | null, distance: number): number {
  let ans = 0;

  function dfs(node: TreeNode | null): number[] {
    // ret[d] 表示子树内叶子到该节点距离为 d 的个数
    const ret = new Array(distance + 1).fill(0);
    if (node === null) return ret;
    if (node.left === null && node.right === null) {
      ret[0] = 1; // 自己是叶子，距离 0
      return ret;
    }
    const left = dfs(node.left);
    const right = dfs(node.right);

    // 统计跨越当前节点的叶子对
    for (let i = 0; i <= distance; i++) {
      for (let j = 0; j <= distance; j++) {
        // 左叶子距离 i + 1 + 右叶子距离 j + 1 <= distance
        if (i + j + 2 <= distance) {
          ans += left[i] * right[j];
        }
      }
    }

    // 合并：从子节点上移一层，距离 +1
    for (let d = 0; d < distance; d++) {
      ret[d + 1] = left[d] + right[d];
    }
    return ret;
  }

  dfs(root);
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 好叶子节点对的数量 =====");

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

// 测试1: root=[1,2,3,null,4], distance=3
//    1
//   / \
//  2   3
//   \
//    4
// 叶子: 4, 3
// 4到3路径长度 = 3 (4-2-1-3) <= 3 -> 好对
console.log("测试1:", countPairs(buildTree([1, 2, 3, null, 4]), 3)); // 期望 1

// 测试2: root=[1,2,3,4,5,6,7], distance=3
//        1
//       / \
//      2   3
//     / \ / \
//    4  5 6  7
// 叶子: 4,5,6,7
// 4-5: 2, 6-7: 2, 4-6: 4 (>3), 4-7: 4, 5-6: 4, 5-7: 4 -> 2 对
console.log("测试2:", countPairs(buildTree([1, 2, 3, 4, 5, 6, 7]), 3)); // 期望 2

// 测试3: root=[7,1,4,6,null,5,3,null,null,null,null,null,2], distance=3
console.log("测试3:", countPairs(buildTree([7, 1, 4, 6, null, 5, 3, null, null, null, null, null, 2]), 3)); // 期望 1

export {};
