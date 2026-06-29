// ============================================================
// 137. 删除给定值的叶子节点
// ============================================================
// LeetCode 1325. Delete Leaves With a Given Value
// 给你一棵以 root 为根的二叉树和一个整数 target，
// 请删除所有值为 target 的叶子节点。删除后可能产生新的叶子节点，
// 若新叶子节点的值也为 target，也要删除，以此类推。
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

// 方法1：递归后序遍历（推荐）
// 后序遍历：先处理左右子树，再判断当前节点是否变成值为 target 的叶子节点
function removeLeafNodes(root: TreeNode | null, target: number): TreeNode | null {
  if (root === null) return null;

  root.left = removeLeafNodes(root.left, target);
  root.right = removeLeafNodes(root.right, target);

  // 当前节点变成叶子节点且值等于 target，删除
  if (root.left === null && root.right === null && root.val === target) {
    return null;
  }

  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. 删除给定值的叶子节点 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left!);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right!);
    }
    i++;
  }
  return root;
}

// 辅助函数：树转数组（层序）
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
//        1
//       / \
//      2   3
//     /   / \
//    2   2   4
// target=2
// 期望: [1, null, 3, null, 4]
const tree1 = buildTree([1, 2, 3, 2, null, 2, 4]);
console.log("测试1:", treeToArray(removeLeafNodes(tree1, 2))); // 期望 [1,null,3,null,4]

// 测试2:
//        1
//       / \
//      3   3
//     /   / \
//    3   2   4
// target=3
// 期望: [1, 3, null, null, 2, null, 4] -> [1,3,null,null,2,4]
const tree2 = buildTree([1, 3, 3, 3, null, 2, 4]);
console.log("测试2:", treeToArray(removeLeafNodes(tree2, 3)));

// 测试3: 单节点 target=1
const tree3 = buildTree([1]);
console.log("测试3:", treeToArray(removeLeafNodes(tree3, 1))); // 期望 []

export {};
