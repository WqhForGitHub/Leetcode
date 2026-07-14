// ============================================================
// 118. 寻找重复的子树
// ============================================================
// LeetCode 652. Find Duplicate Subtrees
// 给定二叉树根，返回所有重复子树（结构、节点值相同）的根节点列表。
// 每种重复子树只需返回任意一个根节点。
// 时间复杂度：O(n)，序列化每个子树 O(n)；空间复杂度：O(n)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function findDuplicateSubtrees(root: TreeNode | null): TreeNode[] {
  // 序列化字符串 -> 出现次数
  const count = new Map<string, number>();
  const result: TreeNode[] = [];

  // 后序遍历：序列化子树
  const serialize = (node: TreeNode | null): string => {
    if (node === null) return "#";
    const left = serialize(node.left);
    const right = serialize(node.right);
    const key = node.val + "," + left + "," + right;
    count.set(key, (count.get(key) || 0) + 1);
    // 仅在第二次出现时加入结果（避免重复加入）
    if (count.get(key) === 2) {
      result.push(node);
    }
    return key;
  };

  serialize(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 寻找重复的子树 =====");
// 测试 1: [1,2,3,4,null,2,4,null,null,4]
//        1
//       / \
//      2   3
//     /   / \
//    4   2   4
//       /
//      4
const root1 = new TreeNode(1);
root1.left = new TreeNode(2, new TreeNode(4), null);
root1.right = new TreeNode(3, new TreeNode(2, new TreeNode(4), null), new TreeNode(4));
const dup1 = findDuplicateSubtrees(root1);
console.log("重复子树根节点值:", dup1.map((n) => n.val).sort()); // 期望: [2, 4]

// 测试 2: [0,0,0,0,null,null,0,null,null,null,null]
const root2 = new TreeNode(0);
root2.left = new TreeNode(0, new TreeNode(0), null);
root2.right = new TreeNode(0, null, new TreeNode(0));
const dup2 = findDuplicateSubtrees(root2);
console.log("重复子树根节点值:", dup2.map((n) => n.val).sort());

export {};
