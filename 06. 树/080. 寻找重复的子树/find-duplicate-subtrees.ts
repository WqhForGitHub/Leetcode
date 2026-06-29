// ============================================================
// 080. 寻找重复的子树
// ============================================================
// LeetCode 652. Find Duplicate Subtrees
// 给定一棵二叉树的根节点 root，返回所有重复的子树。
// 重复的子树是指具有相同结构和相同节点值的两棵子树。
// 时间复杂度：O(n^2) 序列化 / O(n) ID编号，空间复杂度：O(n)

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

// 方法1：序列化+哈希表（推荐，易理解）
// 对每个子树进行后序序列化（结构+值），用哈希表统计出现次数
// 当某序列出现第2次时，将该节点加入结果
function findDuplicateSubtrees(root: TreeNode | null): TreeNode[] {
  const count = new Map<string, number>();
  const result: TreeNode[] = [];
  function serialize(node: TreeNode | null): string {
    if (node === null) return "#";
    const left = serialize(node.left);
    const right = serialize(node.right);
    const key = node.val + "," + left + "," + right;
    const c = (count.get(key) ?? 0) + 1;
    count.set(key, c);
    // 仅在第二次出现时加入结果，避免重复
    if (c === 2) {
      result.push(node);
    }
    return key;
  }
  serialize(root);
  return result;
}

// 方法2：树ID编号+哈希表（效率更高）
// 为每种子树结构分配唯一ID，序列化用三元组 (左ID, 值, 右ID) 表示
// 避免了字符串拼接的 O(n) 开销
function findDuplicateSubtreesID(root: TreeNode | null): TreeNode[] {
  const count = new Map<string, [number, number]>(); // key -> [id, count]
  const result: TreeNode[] = [];
  let nextId = 1;
  function lookup(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = lookup(node.left);
    const right = lookup(node.right);
    const key = left + "," + node.val + "," + right;
    const entry = count.get(key);
    if (entry === undefined) {
      const id = nextId++;
      count.set(key, [id, 1]);
      return id;
    } else {
      entry[1]++;
      if (entry[1] === 2) {
        result.push(node);
      }
      return entry[0];
    }
  }
  lookup(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 寻找重复的子树 =====");

// 测试1: root = [1,2,3,4,null,2,4,null,null,4]
//         1
//        / \
//       2   3
//      /   / \
//     4   2   4
//        /
//       4
// 重复：[2,4]（左下和右子树左孩子）、[4]（叶子4有三处）
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(3);
tree1.left.left = new TreeNode(4);
tree1.right.left = new TreeNode(2);
tree1.right.right = new TreeNode(4);
tree1.right.left.left = new TreeNode(4);
const res1 = findDuplicateSubtrees(tree1).map((n) => n.val);
console.log("序列化方法重复根值:", res1); // 期望 [2, 4]
const res1b = findDuplicateSubtreesID(tree1).map((n) => n.val);
console.log("ID方法重复根值:", res1b); // 期望 [2, 4]

// 测试2: root = [2,1,1]
const tree2 = new TreeNode(2);
tree2.left = new TreeNode(1);
tree2.right = new TreeNode(1);
const res2 = findDuplicateSubtrees(tree2).map((n) => n.val);
console.log("序列化方法:", res2); // 期望 [1]
const res2b = findDuplicateSubtreesID(tree2).map((n) => n.val);
console.log("ID方法:", res2b); // 期望 [1]

// 测试3: root = [2,2,2,3,null,3,null]
//       2
//      / \
//     2   2
//    /   /
//   3   3
const tree3 = new TreeNode(2);
tree3.left = new TreeNode(2);
tree3.right = new TreeNode(2);
tree3.left.left = new TreeNode(3);
tree3.right.left = new TreeNode(3);
const res3 = findDuplicateSubtrees(tree3).map((n) => n.val);
console.log("序列化方法:", res3); // 期望 [2, 3] 或 [3]
const res3b = findDuplicateSubtreesID(tree3).map((n) => n.val);
console.log("ID方法:", res3b);

export {};
