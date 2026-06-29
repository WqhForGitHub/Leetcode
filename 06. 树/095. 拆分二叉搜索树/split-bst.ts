// ============================================================
// 095. 拆分二叉搜索树
// ============================================================
// LeetCode 776. Split BST
// 给定一棵二叉搜索树和一个目标值 V，将树拆分成两棵子树：
// 一棵中所有节点值 <= V，另一棵中所有节点值 > V。
// 返回 [小等于V的子树根, 大于V的子树根]。
// 时间复杂度：O(h)，空间复杂度：O(h)（h为树高）

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

// 方法1：递归
// 思路：递归处理左右子树。
// - 若 root.val <= V：root 及其左子树都属于"小等于"部分，
//   需要继续在右子树里拆分，右子树拆出来的"小等于"部分接到 root.right。
// - 若 root.val > V：root 及其右子树都属于"大于"部分，
//   需要继续在左子树里拆分，左子树拆出来的"大于"部分接到 root.left。
function splitBST(root: TreeNode | null, V: number): [TreeNode | null, TreeNode | null] {
  if (root === null) return [null, null];

  if (root.val <= V) {
    // root 归"小等于"侧，拆分右子树
    const [smallRight, largeRight] = splitBST(root.right, V);
    root.right = smallRight;
    return [root, largeRight];
  } else {
    // root 归"大于"侧，拆分左子树
    const [smallLeft, largeLeft] = splitBST(root.left, V);
    root.left = largeLeft;
    return [smallLeft, root];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 拆分二叉搜索树 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForSplit(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 辅助函数：中序遍历
function inorderForSplit(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// 测试1: root = [4,2,6,1,3,5,7], V = 2
//        4
//       / \
//      2   6
//     / \ / \
//    1  3 5  7
// 拆分后：小等于2 => [2,1]，大于2 => [4,3,6,5,7]
const tree1 = buildTreeForSplit([4, 2, 6, 1, 3, 5, 7]);
const [small1, large1] = splitBST(tree1, 2);
console.log("测试1 - 小等于2的中序:", inorderForSplit(small1)); // 期望 [1,2]
console.log("测试1 - 大于2的中序:", inorderForSplit(large1)); // 期望 [3,4,5,6,7]

// 测试2: root = [4,2,6,1,3,5,7], V = 4
const tree2 = buildTreeForSplit([4, 2, 6, 1, 3, 5, 7]);
const [small2, large2] = splitBST(tree2, 4);
console.log("测试2 - 小等于4的中序:", inorderForSplit(small2)); // 期望 [1,2,3,4]
console.log("测试2 - 大于4的中序:", inorderForSplit(large2)); // 期望 [5,6,7]

// 测试3: 空树
const [small3, large3] = splitBST(null, 1);
console.log("测试3 - 空树拆分:", small3, large3); // 期望 null null

// 测试4: V 小于所有节点
const tree4 = buildTreeForSplit([4, 2, 6]);
const [small4, large4] = splitBST(tree4, 0);
console.log("测试4 - 小等于0的中序:", inorderForSplit(small4)); // 期望 []
console.log("测试4 - 大于0的中序:", inorderForSplit(large4)); // 期望 [2,4,6]

export {};
