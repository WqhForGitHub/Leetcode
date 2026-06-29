// ============================================================
// 054. 将 N 叉树编码为二叉树
// ============================================================
// LeetCode 431. Encode N-ary Tree to Binary Tree
// 设计一个算法将 N 叉树编码为二叉树，并能解码回来。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

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

// 方法1：左孩子右兄弟表示法（推荐）
// 编码规则：第一个子节点作为二叉树的左孩子，
// 其余兄弟节点通过 right 指针依次连接
// 即：left 指向第一个子节点，right 指向下一个兄弟节点

// 编码：N叉树 -> 二叉树
function encode(root: Node | null): TreeNode | null {
  if (root === null) return null;
  const binaryRoot = new TreeNode(root.val);
  if (root.children.length > 0) {
    // 第一个子节点作为左孩子
    binaryRoot.left = encode(root.children[0]);
    // 其余子节点作为兄弟节点，通过 right 指针连接
    let curr = binaryRoot.left;
    for (let i = 1; i < root.children.length; i++) {
      curr!.right = encode(root.children[i]);
      curr = curr!.right;
    }
  }
  return binaryRoot;
}

// 解码：二叉树 -> N叉树
function decode(root: TreeNode | null): Node | null {
  if (root === null) return null;
  const naryRoot = new Node(root.val);
  naryRoot.children = [];
  if (root.left !== null) {
    // 左孩子是第一个子节点
    naryRoot.children.push(decode(root.left)!);
    // right 指针连接的是兄弟节点
    let curr = root.left.right;
    while (curr !== null) {
      naryRoot.children.push(decode(curr)!);
      curr = curr.right;
    }
  }
  return naryRoot;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 将 N 叉树编码为二叉树 =====");
// 构造N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];

// 编码
const encoded = encode(tree1);
console.log("编码后二叉树根值:", encoded?.val); // 期望 1
console.log("编码后左孩子值(第一个子节点):", encoded?.left?.val); // 期望 3
console.log("编码后左孩子的右兄弟值:", encoded?.left?.right?.val); // 期望 2
console.log("编码后左孩子的右兄弟的右兄弟值:", encoded?.left?.right?.right?.val); // 期望 4

// 解码
const decoded = decode(encoded);
console.log("解码后根值:", decoded?.val); // 期望 1
console.log("解码后子节点数:", decoded?.children.length); // 期望 3
console.log("解码后第一个子节点的子节点数:", decoded?.children[0].children.length); // 期望 2
console.log("解码后子节点值:", decoded?.children.map((c) => c.val)); // 期望 [3, 2, 4]
console.log(
  "解码后第一个子节点的子节点值:",
  decoded?.children[0].children.map((c) => c.val)
); // 期望 [5, 6]

// 空树测试
console.log("空树编码:", encode(null)); // 期望 null
console.log("空树解码:", decode(null)); // 期望 null

export {};
