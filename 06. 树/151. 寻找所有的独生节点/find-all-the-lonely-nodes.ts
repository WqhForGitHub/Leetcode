// ============================================================
// 151. 寻找所有的独生节点
// ============================================================
// LeetCode 1469. Find All The Lonely Nodes
// 在二叉树中，独生节点是只有一个子节点的节点。
// 返回所有独生节点的值。
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

// 方法1：DFS递归（推荐）
// 遍历每个节点，判断其是否只有一个孩子，若是则把那个孩子加入结果
function getLonelyNodes(root: TreeNode | null): number[] {
  const result: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    // 当前节点只有一个孩子 -> 那个孩子是独生节点
    if (node.left !== null && node.right === null) {
      result.push(node.left.val);
    } else if (node.left === null && node.right !== null) {
      result.push(node.right.val);
    }
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// 方法2：BFS迭代
function getLonelyNodesBFS(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.left !== null && node.right === null) {
      result.push(node.left.val);
    } else if (node.left === null && node.right !== null) {
      result.push(node.right.val);
    }
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 寻找所有的独生节点 =====");

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
        } else {
          queue.push(null);
        }
      }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.right = new TreeNode(v);
          queue.push(node.right);
        } else {
          queue.push(null);
        }
      }
    }
  }
  return root;
}

// 测试1:
//     1
//    /
//   2
//  /
// 3
console.log("测试1 DFS:", getLonelyNodes(buildTree([1, 2, null, 3]))); // 期望 [2]
console.log("测试1 BFS:", getLonelyNodesBFS(buildTree([1, 2, null, 3])));

// 测试2:
//      7
//     / \
//    1   4
//   /   / \
//  6   5   3
//         /
//        2
console.log(
  "测试2 DFS:",
  getLonelyNodes(buildTree([7, 1, 4, 6, null, 5, 3, null, null, null, null, 2])),
); // 期望 [6,2]
console.log(
  "测试2 BFS:",
  getLonelyNodesBFS(buildTree([7, 1, 4, 6, null, 5, 3, null, null, null, null, 2])),
);

// 测试3: 单节点
console.log("测试3 DFS:", getLonelyNodes(buildTree([11]))); // 期望 []
console.log("测试3 BFS:", getLonelyNodesBFS(buildTree([11])));

export {};
