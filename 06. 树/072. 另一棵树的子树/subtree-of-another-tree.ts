// ============================================================
// 072. 另一棵树的子树
// ============================================================
// LeetCode 572. Subtree of Another Tree
// 给你两棵二叉树 root 和 subRoot。检验 root 中是否包含和 subRoot
// 具有相同结构和节点值的子树。
// 时间复杂度：O(m*n)（方法1）/ O(m+n)（方法2）

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

// 方法1：递归匹配（推荐）
// 对 root 中每个节点，检查以它为根的子树是否与 subRoot 相同
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (root === null) return subRoot === null;
  // 检查以当前节点为根是否匹配，或左右子树中是否存在匹配
  return (
    isSameTree(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)
  );
}

// 判断两棵树是否完全相同
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// 方法2：树序列化 + KMP
// 将两棵树序列化为字符串，用 KMP 算法判断 subRoot 是否为 root 的子串
function isSubtreeKMP(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  function serialize(node: TreeNode | null, sb: string[]): void {
    if (node === null) {
      sb.push("#");
      return;
    }
    sb.push("," + node.val.toString() + ",");
    serialize(node.left, sb);
    serialize(node.right, sb);
  }
  const rootStr: string[] = [];
  const subStr: string[] = [];
  serialize(root, rootStr);
  serialize(subRoot, subStr);
  const text = rootStr.join("");
  const pattern = subStr.join("");
  return kmpSearch(text, pattern);
}

// KMP 字符串匹配
function kmpSearch(text: string, pattern: string): boolean {
  if (pattern.length === 0) return true;
  // 构建 next 数组
  const next: number[] = new Array(pattern.length).fill(0);
  let k = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) {
      k = next[k - 1];
    }
    if (pattern[i] === pattern[k]) k++;
    next[i] = k;
  }
  // 匹配
  k = 0;
  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pattern[k]) {
      k = next[k - 1];
    }
    if (text[i] === pattern[k]) k++;
    if (k === pattern.length) return true;
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 另一棵树的子树 =====");
// root:
//        3
//       / \
//      4   5
//     / \
//    1   2
// subRoot:
//      4
//     / \
//    1   2
// 是子树
const root1 = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
const sub1 = new TreeNode(4, new TreeNode(1), new TreeNode(2));
console.log("递归 是子树:", isSubtree(root1, sub1)); // true
console.log("KMP  是子树:", isSubtreeKMP(root1, sub1)); // true

// root:
//        3
//       / \
//      4   5
//     / \
//    1   2
//       /
//      0
// subRoot:
//      4
//     / \
//    1   2
// 不是子树（因为 root 中的 4 有额外的左孩子 0）
const root2 = new TreeNode(
  3,
  new TreeNode(4, new TreeNode(1), new TreeNode(2, new TreeNode(0), null)),
  new TreeNode(5),
);
const sub2 = new TreeNode(4, new TreeNode(1), new TreeNode(2));
console.log("递归 不是子树:", isSubtree(root2, sub2)); // false
console.log("KMP  不是子树:", isSubtreeKMP(root2, sub2)); // false

// 相同两棵树
const root3 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const sub3 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("递归 相同树:", isSubtree(root3, sub3)); // true
console.log("KMP  相同树:", isSubtreeKMP(root3, sub3)); // true

// 空子树
console.log("递归 空子树:", isSubtree(root1, null)); // true
console.log("KMP  空子树:", isSubtreeKMP(root1, null)); // true

export {};
