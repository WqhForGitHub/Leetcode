// ============================================================
// 060. 二叉搜索树中的中序后继 II
// ============================================================
// LeetCode 510. Inorder Successor in BST II
// 给定一棵二叉搜索树和其中的一个节点 node，找到该节点在树中的中序后继。
// 节点有 parent 指针。中序后继是中序遍历中位于该节点之后的节点。
// 时间复杂度：O(h)，空间复杂度：O(1) （h为树高）

class NodeParent {
  val: number;
  left: NodeParent | null;
  right: NodeParent | null;
  parent: NodeParent | null;
  constructor(val?: number) {
    this.val = val ?? 0;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// 方法1：利用parent指针（推荐）
// 分两种情况：
// 1. 节点有右子树：后继是右子树的最左节点
// 2. 节点无右子树：沿 parent 指针向上找，直到找到一个是其父节点的左孩子的节点，
//    该父节点即为后继
function inorderSuccessor(node: NodeParent | null): NodeParent | null {
  if (node === null) return null;

  // 情况1：节点有右子树，后继是右子树的最左节点
  if (node.right !== null) {
    let curr = node.right;
    while (curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }

  // 情况2：节点无右子树，沿 parent 向上找
  // 找到第一个是其父节点左孩子的节点，该父节点即为后继
  let curr = node;
  let parent = curr.parent;
  while (parent !== null && curr === parent.right) {
    curr = parent;
    parent = parent.parent;
  }
  return parent;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 二叉搜索树中的中序后继 II =====");

// 辅助函数：构建带 parent 指针的 BST
function buildBST(values: number[]): { root: NodeParent; nodes: Map<number, NodeParent> } {
  if (values.length === 0) return { root: null as any, nodes: new Map() };
  const root = new NodeParent(values[0]);
  const nodes = new Map<number, NodeParent>();
  nodes.set(values[0], root);

  function insert(root: NodeParent, val: number): void {
    const node = new NodeParent(val);
    nodes.set(val, node);
    let curr = root;
    while (true) {
      if (val < curr.val) {
        if (curr.left === null) {
          curr.left = node;
          node.parent = curr;
          break;
        }
        curr = curr.left;
      } else {
        if (curr.right === null) {
          curr.right = node;
          node.parent = curr;
          break;
        }
        curr = curr.right;
      }
    }
  }

  for (let i = 1; i < values.length; i++) {
    insert(root, values[i]);
  }
  return { root, nodes };
}

// 测试1: BST = [2,1,3], node = 1
//     2
//    / \
//   1   3
const { root: tree1, nodes: nodes1 } = buildBST([2, 1, 3]);
const node1 = nodes1.get(1)!;
const succ1 = inorderSuccessor(node1);
console.log("节点1的后继:", succ1?.val); // 期望 2

// 测试2: BST = [5,3,6,2,4,null,null,1], node = 6
//       5
//      / \
//     3   6
//    / \
//   2   4
//  /
// 1
const { root: tree2, nodes: nodes2 } = buildBST([5, 3, 6, 2, 4, 1]);
const node6 = nodes2.get(6)!;
const succ6 = inorderSuccessor(node6);
console.log("节点6的后继:", succ6?.val ?? "null"); // 期望 null（6是最大节点，无后继）

// 测试3: node = 4
const node4 = nodes2.get(4)!;
const succ4 = inorderSuccessor(node4);
console.log("节点4的后继:", succ4?.val); // 期望 5

// 测试4: node = 1
const nodeOne = nodes2.get(1)!;
const succOne = inorderSuccessor(nodeOne);
console.log("节点1的后继:", succOne?.val); // 期望 2

// 测试5: node = 2
const node2 = nodes2.get(2)!;
const succ2 = inorderSuccessor(node2);
console.log("节点2的后继:", succ2?.val); // 期望 3

export {};
