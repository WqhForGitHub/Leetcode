// ============================================================
// 154. 克隆 N 叉树
// ============================================================
// LeetCode 1490. Clone N-ary Tree
// 给定一棵 N 叉树的根节点 root，返回其深拷贝。
// 时间复杂度：O(n)，空间复杂度：O(h)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：DFS递归（推荐）
function cloneTree(root: Node | null): Node | null {
  if (root === null) return null;
  const newChildren = root.children.map((child) => cloneTree(child)!);
  return new Node(root.val, newChildren);
}

// 方法2：BFS迭代
function cloneTreeBFS(root: Node | null): Node | null {
  if (root === null) return null;
  const map = new Map<Node, Node>();
  const newRoot = new Node(root.val);
  map.set(root, newRoot);

  const queue: Node[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    const copyNode = map.get(node)!;
    for (const child of node.children) {
      const copyChild = new Node(child.val);
      copyNode.children.push(copyChild);
      map.set(child, copyChild);
      queue.push(child);
    }
  }
  return newRoot;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 克隆 N 叉树 =====");

// 辅助：序列化 N 叉树为 [val, children-count] 列表（层序）
function serialize(root: Node | null): string {
  if (root === null) return "null";
  const result: [number, number][] = [];
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push([node.val, node.children.length]);
    for (const c of node.children) queue.push(c);
  }
  return JSON.stringify(result);
}

// 测试1:
//       1
//     / | \
//    2  3  4
//   / \
//  5   6
const t1 = new Node(1, [
  new Node(2, [new Node(5), new Node(6)]),
  new Node(3, []),
  new Node(4, []),
]);
console.log("测试1 DFS:", serialize(cloneTree(t1)));
console.log("测试1 BFS:", serialize(cloneTreeBFS(t1)));

// 测试2: null
console.log("测试2 DFS:", serialize(cloneTree(null)));
console.log("测试2 BFS:", serialize(cloneTreeBFS(null)));

// 测试3: 单节点
console.log("测试3 DFS:", serialize(cloneTree(new Node(7))));
console.log("测试3 BFS:", serialize(cloneTreeBFS(new Node(7))));

export {};
