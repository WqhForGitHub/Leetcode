// ============================================================
// 147. 判断给定的序列是否是二叉树从根到叶的路径
// ============================================================
// LeetCode 1430. Check If a String Is a Valid Sequence From Root to Leaves Path in a Binary Tree
// 给定一个二叉树和一个整数数组 arr，判断 arr 是否是从根到叶节点的有效路径。
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
// 逐个匹配数组元素，到达数组末尾时检查当前节点是否为叶子节点
function isValidSequence(root: TreeNode | null, arr: number[]): boolean {
  function dfs(node: TreeNode | null, index: number): boolean {
    if (node === null) return false;
    // 当前节点值不匹配
    if (node.val !== arr[index]) return false;
    // 到达数组末尾，必须是叶子节点
    if (index === arr.length - 1) {
      return node.left === null && node.right === null;
    }
    // 继续向左右子树匹配下一个元素
    return dfs(node.left, index + 1) || dfs(node.right, index + 1);
  }

  return dfs(root, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 147. 判断给定的序列是否是二叉树从根到叶的路径 =====");

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

// 测试1:
//        0
//       / \
//      1   0
//     / \ /
//    0  1 0
//   /  / \
//  1  0   0
// arr=[0,1,0,1] 路径 0->1->0->1 有效
const tree1 = buildTree([0, 1, 0, 0, 1, 0, null, null, 1, 0, 0, null, null, null, null]);
console.log("测试1 [0,1,0,1]:", isValidSequence(tree1, [0, 1, 0, 1])); // 期望 true
console.log("测试1 [0,0,1]:", isValidSequence(tree1, [0, 0, 1])); // 期望 false
console.log("测试1 [0,1,1]:", isValidSequence(tree1, [0, 1, 1])); // 期望 false

// 测试2: arr=[0] 树只有根0
const tree2 = buildTree([0]);
console.log("测试2 [0]:", isValidSequence(tree2, [0])); // 期望 true

// 测试3: arr=[0,1] 树=[0,null,1]
//        0
//         \
//          1
const tree3 = buildTree([0, null, 1]);
console.log("测试3 [0,1]:", isValidSequence(tree3, [0, 1])); // 期望 true

export {};
