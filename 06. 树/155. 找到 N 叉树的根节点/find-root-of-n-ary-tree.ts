// ============================================================
// 155. 找到 N 叉树的根节点
// ============================================================
// LeetCode 1506. Find Root of N-Ary Tree
// 给定一个 N 叉树的所有节点列表，找到该树的根节点。
// 所有节点的值唯一。
// 时间复杂度：O(n)，空间复杂度：O(1) 或 O(n)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：哈希集合找入度为 0 的节点（推荐）
// 根节点不会作为任何节点的孩子出现（入度为 0）
function findRoot(tree: Node[]): Node | null {
  const childrenSet = new Set<Node>();
  for (const node of tree) {
    for (const child of node.children) {
      childrenSet.add(child);
    }
  }
  for (const node of tree) {
    if (!childrenSet.has(node)) return node;
  }
  return null;
}

// 方法2：异或所有值
// 所有节点的值异或一次，所有孩子的值再异或一次，剩下的就是根
// 因为根只作为节点出现一次，其他节点都作为孩子出现一次
function findRootXOR(tree: Node[]): Node | null {
  let xorSum = 0;
  for (const node of tree) {
    xorSum ^= node.val;
    for (const child of node.children) {
      xorSum ^= child.val;
    }
  }
  for (const node of tree) {
    if (node.val === xorSum) return node;
  }
  return null;
}

// 方法3：求和差
// 根值 = (所有节点值之和) - (所有孩子值之和)
function findRootSum(tree: Node[]): Node | null {
  let sum = 0;
  for (const node of tree) {
    sum += node.val;
    for (const child of node.children) {
      sum -= child.val;
    }
  }
  for (const node of tree) {
    if (node.val === sum) return node;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 155. 找到 N 叉树的根节点 =====");

//       1
//     / | \
//    2  3  4
//   / \
//  5   6
const n1 = new Node(1);
const n2 = new Node(2);
const n3 = new Node(3);
const n4 = new Node(4);
const n5 = new Node(5);
const n6 = new Node(6);
n1.children = [n2, n3, n4];
n2.children = [n5, n6];
const allNodes = [n1, n2, n3, n4, n5, n6];

console.log("测试1 Set:", findRoot(allNodes)?.val); // 期望 1
console.log("测试1 XOR:", findRootXOR(allNodes)?.val); // 期望 1
console.log("测试1 Sum:", findRootSum(allNodes)?.val); // 期望 1

// 测试2: 单节点
const single = new Node(42);
console.log("测试2 Set:", findRoot([single])?.val); // 期望 42
console.log("测试2 XOR:", findRootXOR([single])?.val);
console.log("测试2 Sum:", findRootSum([single])?.val);

export {};
