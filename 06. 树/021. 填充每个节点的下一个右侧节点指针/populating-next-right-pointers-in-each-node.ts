// ============================================================
// 021. 填充每个节点的下一个右侧节点指针
// ============================================================
// LeetCode 116. Populating Next Right Pointers in Each Node
// 给定一个完美二叉树，填充每个节点的 next 指针，使其指向同一层的右侧节点。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法2）

class NodeNext {
  val: number;
  left: NodeNext | null;
  right: NodeNext | null;
  next: NodeNext | null;
  constructor(val?: number, left?: NodeNext | null, right?: NodeNext | null, next?: NodeNext | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
    this.next = next ?? null;
  }
}

// 方法1：层序遍历 BFS
function connect(root: NodeNext | null): NodeNext | null {
  if (root === null) return null;
  const queue: NodeNext[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      // 当前层最后一个节点 next 保持 null
      if (i < size - 1) {
        node.next = queue[0];
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return root;
}

// 方法2：利用已建立的 next 指针递归（推荐，空间 O(1)）
function connectOptimized(root: NodeNext | null): NodeNext | null {
  if (root === null) return null;
  // 从当前层最左节点开始
  let leftmost = root;
  // 还有下一层
  while (leftmost.left !== null) {
    let curr: NodeNext | null = leftmost;
    while (curr !== null) {
      // 连接左孩子 -> 右孩子
      curr.left!.next = curr.right;
      // 连接右孩子 -> 兄弟节点的左孩子
      if (curr.next !== null) {
        curr.right!.next = curr.next.left;
      }
      curr = curr.next;
    }
    // 移到下一层最左
    leftmost = leftmost.left;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 填充每个节点的下一个右侧节点指针 =====");
// 构造完美二叉树: [1,2,3,4,5,6,7]
function buildPerfectTree(): NodeNext {
  const n4 = new NodeNext(4);
  const n5 = new NodeNext(5);
  const n6 = new NodeNext(6);
  const n7 = new NodeNext(7);
  const n2 = new NodeNext(2, n4, n5);
  const n3 = new NodeNext(3, n6, n7);
  return new NodeNext(1, n2, n3);
}

function printNextPointers(root: NodeNext | null): string[] {
  const result: string[] = [];
  let leftmost = root;
  while (leftmost !== null) {
    const level: string[] = [];
    let curr: NodeNext | null = leftmost;
    while (curr !== null) {
      level.push(`${curr.val}->${curr.next ? curr.next.val : "#"}`);
      curr = curr.next;
    }
    result.push(level.join(" | "));
    leftmost = leftmost.left;
  }
  return result;
}

const tree021a = buildPerfectTree();
connect(tree021a);
console.log("BFS:", printNextPointers(tree021a));
// 1-># | 2->3 | 3-># | 4->5 | 5->6 | 6->7 | 7->#

const tree021b = buildPerfectTree();
connectOptimized(tree021b);
console.log("优化:", printNextPointers(tree021b));

console.log("空树 BFS:", connect(null)); // null
console.log("空树 优化:", connectOptimized(null)); // null

export {};
