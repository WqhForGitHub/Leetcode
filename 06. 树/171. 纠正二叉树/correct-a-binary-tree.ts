// ============================================================
// 171. 纠正二叉树
// ============================================================
// LeetCode 1660. Correct a Binary Tree
// 给定一棵二叉树 root，其中有一个错误节点：它的右子节点指向同层右侧的另一个节点。
// 删除该错误节点（将其父节点指向它的引用置为 null）。
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

// 方法1：BFS层序+哈希集合检测（推荐）
// 按层从右到左 BFS，用集合记录已访问的节点
// 当某节点的右孩子已在集合中，说明该右孩子指向同层右侧节点，该节点就是错误节点
// 需要记录父节点以便删除
function correctBinaryTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // BFS 队列，存储 [节点, 父节点, 是左孩子还是右孩子]
  const queue: [TreeNode, TreeNode | null, "left" | "right"][] = [
    [root, null, "left"],
  ];
  const visited = new Set<TreeNode>();

  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [node, parent, side] = queue.shift()!;
      // 检查右孩子是否已被访问（指向同层右侧节点）
      if (node.right !== null && visited.has(node.right)) {
        // node 是错误节点，从父节点中删除
        if (parent !== null) {
          if (side === "left") parent.left = null;
          else parent.right = null;
        }
        return root;
      }
      visited.add(node);
      // 从右到左入队，保证同层中先访问右侧节点
      if (node.right !== null) {
        queue.push([node.right, node, "right"]);
      }
      if (node.left !== null) {
        queue.push([node.left, node, "left"]);
      }
    }
  }
  return root;
}

// 方法2：DFS + 哈希集合
// 用 DFS 遍历，记录访问过的节点
// 当发现某节点的孩子已在访问集合中，则为错误节点
function correctBinaryTreeDFS(root: TreeNode | null): TreeNode | null {
  const visited = new Set<TreeNode>();
  return dfs(root, null, false);

  function dfs(
    node: TreeNode | null,
    parent: TreeNode | null,
    isLeft: boolean
  ): TreeNode | null {
    if (node === null) return null;
    // 检查右孩子是否指向已访问节点
    if (node.right !== null && visited.has(node.right)) {
      // 删除错误节点
      if (parent !== null) {
        if (isLeft) parent.left = null;
        else parent.right = null;
      } else {
        return null; // 错误节点是根
      }
      return root;
    }
    visited.add(node);
    dfs(node.left, node, true);
    dfs(node.right, node, false);
    return root;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 171. 纠正二叉树 =====");

// 辅助函数：层序转数组
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

// 测试1:
//     1
//    / \
//   2   3
//  /   / \
// 4   5   6
//  \ /
//  7 8  (4 的 right 指向 5，这是错误)
// 错误节点是 4，删除后：
//     1
//    / \
//   2   3
//      / \
//     5   6
const t1 = new TreeNode(1);
const t1n2 = new TreeNode(2);
const t1n3 = new TreeNode(3);
const t1n4 = new TreeNode(4);
const t1n5 = new TreeNode(5);
const t1n6 = new TreeNode(6);
t1.left = t1n2;
t1.right = t1n3;
t1n2.left = t1n4;
t1n3.left = t1n5;
t1n3.right = t1n6;
// 错误：4 的右孩子指向同层的 5
t1n4.right = t1n5;
console.log("测试1 BFS法:", treeToArray(correctBinaryTree(t1)));
// 期望 [1,2,3,null,null,5,6]

export {};
