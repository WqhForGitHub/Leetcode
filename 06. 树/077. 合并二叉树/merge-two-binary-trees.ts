// ============================================================
// 077. 合并二叉树
// ============================================================
// LeetCode 617. Merge Two Binary Trees
// 给你两棵二叉树 root1 和 root2，将这两棵树合并。合并规则是
// 如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的值。
// 否则不为 null 的节点将直接作为新二叉树的节点。
// 时间复杂度：O(min(m, n))，空间复杂度：O(min(m, n))

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

// 方法1：递归（推荐）
// 同时遍历两棵树：
// - 都为空返回 null
// - 一个为空返回另一个的副本子树
// - 都非空相加，递归合并左右子树
function mergeTrees(
  root1: TreeNode | null,
  root2: TreeNode | null
): TreeNode | null {
  if (root1 === null) return root2;
  if (root2 === null) return root1;
  // 两个节点都存在，值相加
  const merged = new TreeNode(root1.val + root2.val);
  merged.left = mergeTrees(root1.left, root2.left);
  merged.right = mergeTrees(root1.right, root2.right);
  return merged;
}

// 方法2：迭代BFS
// 使用队列同时遍历两棵树，逐节点合并
function mergeTreesBFS(
  root1: TreeNode | null,
  root2: TreeNode | null
): TreeNode | null {
  if (root1 === null) return root2;
  if (root2 === null) return root1;
  const root = new TreeNode(root1.val + root2.val);
  const queue: [TreeNode, TreeNode, TreeNode][] = [
    [root, root1, root2],
  ];
  while (queue.length > 0) {
    const [node, n1, n2] = queue.shift()!;
    // 处理左孩子
    if (n1.left !== null || n2.left !== null) {
      if (n1.left !== null && n2.left !== null) {
        node.left = new TreeNode(n1.left.val + n2.left.val);
        queue.push([node.left, n1.left, n2.left]);
      } else if (n1.left !== null) {
        node.left = n1.left;
      } else {
        node.left = n2.left;
      }
    }
    // 处理右孩子
    if (n1.right !== null || n2.right !== null) {
      if (n1.right !== null && n2.right !== null) {
        node.right = new TreeNode(n1.right.val + n2.right.val);
        queue.push([node.right, n1.right, n2.right]);
      } else if (n1.right !== null) {
        node.right = n1.right;
      } else {
        node.right = n2.right;
      }
    }
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 合并二叉树 =====");

// 辅助：层序遍历转数组（用于打印）
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
  // 去掉末尾的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
//   tree1:       tree2:        merged:
//     1            2             3
//    / \          / \           / \
//   3   2        1   3         4   5
//  /              \   \       / \   \
// 5               4   7      5  4    7
const root1 = new TreeNode(1);
root1.left = new TreeNode(3);
root1.right = new TreeNode(2);
root1.left.left = new TreeNode(5);

const root2 = new TreeNode(2);
root2.left = new TreeNode(1);
root2.right = new TreeNode(3);
root2.left.right = new TreeNode(4);
root2.right.right = new TreeNode(7);

console.log("递归:", treeToArray(mergeTrees(root1, root2))); // 期望 [3,4,5,5,4,7]
console.log("BFS:", treeToArray(mergeTreesBFS(root1, root2))); // 期望 [3,4,5,5,4,7]

// 测试2: root1 = [1], root2 = [1,2]
const r1 = new TreeNode(1);
const r2 = new TreeNode(1);
r2.left = new TreeNode(2);
console.log("递归:", treeToArray(mergeTrees(r1, r2))); // 期望 [2,2]
console.log("BFS:", treeToArray(mergeTreesBFS(r1, r2))); // 期望 [2,2]

export {};
