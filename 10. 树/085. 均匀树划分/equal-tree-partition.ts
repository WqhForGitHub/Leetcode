// ============================================================
// 085. 均匀树划分
// ============================================================
// LeetCode 663. Equal Tree Partition
// 给定一个二叉树，判断是否可以移除一条边将其分成两棵子树，
// 且这两棵子树的节点值之和相等。
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

// 方法1：DFS+哈希集合（推荐）
// 思路：若总树和为 total，则要找一个子树其和为 total/2（且该子树不能是整棵树本身）
// 用后序遍历计算每个子树的和并存入集合，最后检查 total/2 是否在集合中
// 注意：必须排除"整棵树"的情况（即只能切边，不能不切），所以要先记录子树和再处理根
function checkEqualTree(root: TreeNode | null): boolean {
  if (root === null) return false;
  const subtreeSums = new Set<number>();
  // 先计算总树和，同时记录所有子树（不含整棵树）的和
  function sum(node: TreeNode | null, isRoot: boolean): number {
    if (node === null) return 0;
    const left = sum(node.left, false);
    const right = sum(node.right, false);
    const s = node.val + left + right;
    // 根节点的总和不加入集合（因为切边后必须有非空两半）
    if (!isRoot) {
      subtreeSums.add(s);
    }
    return s;
  }
  const total = sum(root, true);
  // 总和必须为偶数才能均分
  if (total % 2 !== 0) return false;
  return subtreeSums.has(total / 2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 均匀树划分 =====");

// 测试1: [5,10,10,null,null,2,3]
//        5
//       / \
//      10  10
//         / \
//        2   3
// 总和 = 5+10+10+2+3 = 30，子树10(left=10)和=10，子树10(right=2,3)和=15
// 子树 10+2+3=15 在集合中，30/2=15，true
const tree1 = new TreeNode(5);
tree1.left = new TreeNode(10);
tree1.right = new TreeNode(10);
tree1.right.left = new TreeNode(2);
tree1.right.right = new TreeNode(3);
console.log("测试1:", checkEqualTree(tree1)); // 期望 true

// 测试2: [1,2,10,null,null,2,20]
//        1
//       / \
//      2  10
//         / \
//        2  20
// 总和 = 35，奇数，无法均分
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(2);
tree2.right = new TreeNode(10);
tree2.right.left = new TreeNode(2);
tree2.right.right = new TreeNode(20);
console.log("测试2:", checkEqualTree(tree2)); // 期望 false

// 测试3: [0,-1,1]
// 总和 0，子树 -1 和 1，0/2=0，但只有根为0，不能切
const tree3 = new TreeNode(0);
tree3.left = new TreeNode(-1);
tree3.right = new TreeNode(1);
console.log("测试3:", checkEqualTree(tree3)); // 期望 false

// 测试4: [2,1,1]
// 总和 4，4/2=2，但子树和为1，不在集合，false
const tree4 = new TreeNode(2);
tree4.left = new TreeNode(1);
tree4.right = new TreeNode(1);
console.log("测试4:", checkEqualTree(tree4)); // 期望 false

export {};
