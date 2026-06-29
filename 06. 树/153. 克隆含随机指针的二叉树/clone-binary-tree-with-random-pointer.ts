// ============================================================
// 153. 克隆含随机指针的二叉树
// ============================================================
// LeetCode 1485. Clone Binary Tree With Random Pointer
// 给定一棵二叉树，其中每个节点都包含一个随机指针。
// 返回该树的深拷贝。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  random: Node | null;
  constructor(val?: number, left?: Node | null, right?: Node | null, random?: Node | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
    this.random = random ?? null;
  }
}

class NodeCopy {
  val: number;
  left: NodeCopy | null;
  right: NodeCopy | null;
  random: NodeCopy | null;
  constructor(
    val?: number,
    left?: NodeCopy | null,
    right?: NodeCopy | null,
    random?: NodeCopy | null,
  ) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
    this.random = random ?? null;
  }
}

// 方法1：DFS递归 + 哈希映射（推荐）
// 用 Map 记录原节点到新节点的映射，避免重复克隆
function copyRandomBinaryTree(root: Node | null): NodeCopy | null {
  const map = new Map<Node, NodeCopy>();

  function clone(node: Node | null): NodeCopy | null {
    if (node === null) return null;
    if (map.has(node)) return map.get(node)!;

    const newNode = new NodeCopy(node.val);
    map.set(node, newNode); // 先放入 map，防止递归环
    newNode.left = clone(node.left);
    newNode.right = clone(node.right);
    newNode.random = clone(node.random);
    return newNode;
  }

  return clone(root);
}

// 方法2：BFS迭代 + 哈希映射
function copyRandomBinaryTreeBFS(root: Node | null): NodeCopy | null {
  if (root === null) return null;
  const map = new Map<Node, NodeCopy>();
  const newRoot = new NodeCopy(root.val);
  map.set(root, newRoot);

  const queue: Node[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    const copyNode = map.get(node)!;

    if (node.left !== null) {
      if (!map.has(node.left)) {
        map.set(node.left, new NodeCopy(node.left.val));
        queue.push(node.left);
      }
      copyNode.left = map.get(node.left)!;
    }
    if (node.right !== null) {
      if (!map.has(node.right)) {
        map.set(node.right, new NodeCopy(node.right.val));
        queue.push(node.right);
      }
      copyNode.right = map.get(node.right)!;
    }
    if (node.random !== null) {
      if (!map.has(node.random)) {
        map.set(node.random, new NodeCopy(node.random.val));
        queue.push(node.random);
      }
      copyNode.random = map.get(node.random)!;
    }
  }
  return newRoot;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 克隆含随机指针的二叉树 =====");

// 辅助：序列化克隆后的树
function serialize(root: NodeCopy | null): string {
  if (root === null) return "null";
  const map = new Map<NodeCopy, number>();
  const list: NodeCopy[] = [];
  // 收集所有节点
  function collect(n: NodeCopy | null): void {
    if (n === null || map.has(n)) return;
    map.set(n, list.length);
    list.push(n);
    collect(n.left);
    collect(n.right);
    collect(n.random);
  }
  collect(root);

  const vals: string[] = [];
  const lefts: (number | null)[] = [];
  const rights: (number | null)[] = [];
  const randoms: (number | null)[] = [];
  for (const n of list) {
    vals.push(String(n.val));
    lefts.push(n.left ? map.get(n.left)! : null);
    rights.push(n.right ? map.get(n.right)! : null);
    randoms.push(n.random ? map.get(n.random)! : null);
  }
  return JSON.stringify({ vals, lefts, rights, randoms });
}

// 测试1:
//   1
//  / \
// 2   3
// 节点1.random = 3, 节点2.random = 1
const n1 = new Node(1);
const n2 = new Node(2);
const n3 = new Node(3);
n1.left = n2;
n1.right = n3;
n1.random = n3;
n2.random = n1;
console.log("测试1 DFS:", serialize(copyRandomBinaryTree(n1)));
console.log("测试1 BFS:", serialize(copyRandomBinaryTreeBFS(n1)));

// 测试2: null
console.log("测试2 DFS:", serialize(copyRandomBinaryTree(null)));
console.log("测试2 BFS:", serialize(copyRandomBinaryTreeBFS(null)));

// 测试3: 单节点
const single = new Node(5);
console.log("测试3 DFS:", serialize(copyRandomBinaryTree(single)));
console.log("测试3 BFS:", serialize(copyRandomBinaryTreeBFS(single)));

export {};
