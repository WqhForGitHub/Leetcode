// ============================================================
// 128. 二叉树中和为目标值的路径
// ============================================================
// 面试金典 CCI 04.12. 求和路径
// 给定一棵二叉树和一个目标和，计算从任意节点向下（父到子方向）出发、
// 到任意节点结束的路径中，节点值之和等于目标和的路径数量。
// 时间复杂度：O(N), 空间复杂度：O(N)

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

// 方法1：DFS回溯+前缀和 (推荐)
// 利用前缀和与哈希表，在遍历时记录从根到当前节点路径上各前缀和的出现次数。
// 若 currentSum - target 在哈希表中存在，说明存在若干路径终点使和为 target。
// 回溯时删除当前节点贡献的前缀和。
// 时间复杂度 O(N), 空间复杂度 O(N)
function pathSum(root: TreeNode | null, target: number): number {
  // 前缀和 -> 出现次数
  const prefix: Map<number, number> = new Map();
  // 前缀和 0 出现一次，表示从根出发的路径
  prefix.set(0, 1);

  const dfs = (node: TreeNode | null, currentSum: number): number => {
    if (node === null) {
      return 0;
    }
    currentSum += node.val;
    // 查找是否存在前缀和使 currentSum - 前缀和 = target
    let count: number = prefix.get(currentSum - target) ?? 0;
    // 记录当前前缀和
    prefix.set(currentSum, (prefix.get(currentSum) ?? 0) + 1);
    // 递归左右子树
    count += dfs(node.left, currentSum);
    count += dfs(node.right, currentSum);
    // 回溯：撤销当前前缀和
    prefix.set(currentSum, (prefix.get(currentSum) ?? 0) - 1);
    return count;
  };

  return dfs(root, 0);
}

// 方法2：递归(每个节点为起点)
// 对每个节点，统计以该节点为起点的满足和为 target 的向下路径数，
// 再递归处理左右子树。
// 时间复杂度 O(N^2) 最坏（退化链），空间复杂度 O(N)
function pathSumBrute(root: TreeNode | null, target: number): number {
  if (root === null) {
    return 0;
  }
  // 以当前节点为起点统计路径数，加上左右子树结果
  return (
    countPathsFrom(root, target) +
    pathSumBrute(root.left, target) +
    pathSumBrute(root.right, target)
  );
}

// 统计从 node 出发向下、和为 target 的路径数量
function countPathsFrom(node: TreeNode | null, target: number): number {
  if (node === null) {
    return 0;
  }
  let count: number = 0;
  if (node.val === target) {
    count = 1;
  }
  count += countPathsFrom(node.left, target - node.val);
  count += countPathsFrom(node.right, target - node.val);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 二叉树中和为目标值的路径 =====");
// 构造树:
//        10
//       /  \
//      5   -3
//     / \    \
//    3   2    11
//   / \   \
//  3  -2   1
// 路径和为 8 的有: 5->3, 5->2->1, -3->11 共 3 条
const tree: TreeNode = new TreeNode(10);
tree.left = new TreeNode(5);
tree.right = new TreeNode(-3);
tree.left.left = new TreeNode(3);
tree.left.right = new TreeNode(2);
tree.right.right = new TreeNode(11);
tree.left.left.left = new TreeNode(3);
tree.left.left.right = new TreeNode(-2);
tree.left.right.right = new TreeNode(1);
console.log(pathSum(tree, 8)); // 期望结果: 3
console.log(pathSumBrute(tree, 8)); // 期望结果: 3
console.log(pathSum(tree, 10)); // 期望结果: 1
console.log(pathSumBrute(tree, 10)); // 期望结果: 1

export {};
