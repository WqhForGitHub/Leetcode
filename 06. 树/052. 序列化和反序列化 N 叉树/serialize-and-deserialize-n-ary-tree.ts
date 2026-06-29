// ============================================================
// 052. 序列化和反序列化 N 叉树
// ============================================================
// LeetCode 428. Serialize and Deserialize N-ary Tree
// 设计一个算法来序列化和反序列化一棵 N 叉树。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：BFS层序（推荐）
// 序列化格式：节点值后跟子节点数量，层序遍历
// 例如 [1,3,3,2,5,0,6,0,2,0,4,0] 表示:
// 节点1有3个子节点(3,2,4)，节点3有2个子节点(5,6)，节点2没有子节点...
function serialize(root: Node | null): string {
  if (root === null) return "";
  const result: string[] = [];
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(String(node.val));
    result.push(String(node.children.length));
    for (const child of node.children) {
      queue.push(child);
    }
  }
  return result.join(",");
}

function deserialize(data: string): Node | null {
  if (data === "") return null;
  const parts = data.split(",");
  let index = 0;
  const root = new Node(parseInt(parts[index++]));
  const childCount = parseInt(parts[index++]);
  root.children = [];
  const queue: { node: Node; count: number }[] = [
    { node: root, count: childCount },
  ];
  while (queue.length > 0) {
    const { node, count } = queue.shift()!;
    for (let i = 0; i < count; i++) {
      const child = new Node(parseInt(parts[index++]));
      const cc = parseInt(parts[index++]);
      child.children = [];
      node.children.push(child);
      queue.push({ node: child, count: cc });
    }
  }
  return root;
}

// 方法2：DFS前序
// 序列化格式：前序遍历，每个节点后跟子节点数量，用特殊符号分隔
function serializeDFS(root: Node | null): string {
  const result: string[] = [];
  function dfs(node: Node | null): void {
    if (node === null) return;
    result.push(String(node.val));
    result.push(String(node.children.length));
    for (const child of node.children) {
      dfs(child);
    }
  }
  dfs(root);
  return result.join(",");
}

function deserializeDFS(data: string): Node | null {
  if (data === "") return null;
  const parts = data.split(",");
  let index = 0;
  function build(): Node {
    const node = new Node(parseInt(parts[index++]));
    const count = parseInt(parts[index++]);
    node.children = [];
    for (let i = 0; i < count; i++) {
      node.children.push(build());
    }
    return node;
  }
  return build();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 序列化和反序列化 N 叉树 =====");
// 构造N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];

const serialized1 = serialize(tree1);
console.log("BFS序列化:", serialized1);
const deserialized1 = deserialize(serialized1);
console.log("BFS反序列化根值:", deserialized1?.val); // 期望 1
console.log("BFS反序列化子节点数:", deserialized1?.children.length); // 期望 3
console.log("BFS反序列化第一个子节点的子节点数:", deserialized1?.children[0].children.length); // 期望 2

const serializedDFS1 = serializeDFS(tree1);
console.log("DFS序列化:", serializedDFS1);
const deserializedDFS1 = deserializeDFS(serializedDFS1);
console.log("DFS反序列化根值:", deserializedDFS1?.val); // 期望 1
console.log("DFS反序列化子节点数:", deserializedDFS1?.children.length); // 期望 3

export {};
