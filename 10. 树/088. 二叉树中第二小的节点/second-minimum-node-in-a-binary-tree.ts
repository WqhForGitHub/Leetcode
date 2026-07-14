// ============================================================
// 088. 二叉树中第二小的节点
// ============================================================
// LeetCode 671. Second Minimum Node In a Binary Tree
// 给定一个非空特殊的二叉树，每个节点都是正数，并且每个节点的子节点数量只能为 0 或 2。
// 性质：如果节点有两个子节点，那么该节点的值等于两个子节点中较小的值。
// 找出树中第二小的值（不存在则返回 -1）。
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

// 方法1：DFS遍历集合（推荐，易理解）
// 遍历所有节点，存入集合去重排序，取第二小
// 由性质：根节点是最小值
function findSecondMinimumValue(root: TreeNode | null): number {
  if (root === null) return -1;
  const values = new Set<number>();
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    values.add(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  if (values.size < 2) return -1;
  // 找第二小
  const sorted = Array.from(values).sort((a, b) => a - b);
  return sorted[1];
}

// 方法2：DFS剪枝（更优）
// 利用性质：根值就是最小值 minVal
// 只有节点值 > minVal 才可能是第二小的候选
// 又因为父节点 = min(左右)，所以当某节点值 > minVal 时，其子树所有值都 >= 该值，可剪枝
function findSecondMinimumValuePrune(root: TreeNode | null): number {
  if (root === null) return -1;
  const minVal = root.val;
  let second = Infinity;
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    // 当前节点值大于最小值，更新候选
    if (node.val > minVal && node.val < second) {
      second = node.val;
      // 剪枝：该节点子树所有值 >= node.val > second 不会更优，可不再深入
      // 但仍可能存在等于node.val的情况，所以可继续也可不继续
      // 为简化：更新后不再深入
      return;
    }
    // 当前节点值等于最小值，继续往子树找更大的候选
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return second === Infinity ? -1 : second;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 二叉树中第二小的节点 =====");

// 测试1: root = [2,2,5,null,null,5,7]
//     2
//    / \
//   2   5
//      / \
//     5   7
// 最小2，第二小5
const tree1 = new TreeNode(2);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(5);
tree1.right.left = new TreeNode(5);
tree1.right.right = new TreeNode(7);
console.log("集合方法:", findSecondMinimumValue(tree1)); // 期望 5
console.log("剪枝方法:", findSecondMinimumValuePrune(tree1)); // 期望 5

// 测试2: root = [2,2,2]
//     2
//    / \
//   2   2
// 只有2，无第二小
const tree2 = new TreeNode(2);
tree2.left = new TreeNode(2);
tree2.right = new TreeNode(2);
console.log("集合方法:", findSecondMinimumValue(tree2)); // 期望 -1
console.log("剪枝方法:", findSecondMinimumValuePrune(tree2)); // 期望 -1

// 测试3: root = [1,1,3,1,1,3,4]
//        1
//       / \
//      1   3
//     / \ / \
//    1  1 3  4
// 最小1，第二小3
const tree3 = new TreeNode(1);
tree3.left = new TreeNode(1);
tree3.right = new TreeNode(3);
tree3.left.left = new TreeNode(1);
tree3.left.right = new TreeNode(1);
tree3.right.left = new TreeNode(3);
tree3.right.right = new TreeNode(4);
console.log("集合方法:", findSecondMinimumValue(tree3)); // 期望 3
console.log("剪枝方法:", findSecondMinimumValuePrune(tree3)); // 期望 3

export {};
