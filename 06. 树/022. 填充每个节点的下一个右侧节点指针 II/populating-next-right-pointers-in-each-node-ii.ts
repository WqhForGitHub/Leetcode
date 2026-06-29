// ============================================================
// 022. 填充每个节点的下一个右侧节点指针 II
// ============================================================
// LeetCode 117. Populating Next Right Pointers in Each Node II
// 给定一个普通二叉树（非完美），填充每个节点的 next 指针，使其指向同一层的右侧节点。
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
function connect2(root: NodeNext | null): NodeNext | null {
  if (root === null) return null;
  const queue: NodeNext[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (i < size - 1) {
        node.next = queue[0];
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return root;
}

// 方法2：利用 next 指针迭代（推荐，空间 O(1)）
function connect2Optimized(root: NodeNext | null): NodeNext | null {
  if (root === null) return null;
  let leftmost: NodeNext | null = root;
  while (leftmost !== null) {
    // dummy 作为下一层的虚拟头节点
    const dummy = new NodeNext(0);
    let tail = dummy;
    let curr: NodeNext | null = leftmost;
    while (curr !== null) {
      // 处理左孩子
      if (curr.left !== null) {
        tail.next = curr.left;
        tail = tail.next;
      }
      // 处理右孩子
      if (curr.right !== null) {
        tail.next = curr.right;
        tail = tail.next;
      }
      curr = curr.next;
    }
    // 移到下一层最左节点
    leftmost = dummy.next;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 填充每个节点的下一个右侧节点指针 II =====");
// 构造普通二叉树: [1,2,3,4,5,null,7]
function buildTree022(): NodeNext {
  const n4 = new NodeNext(4);
  const n5 = new NodeNext(5);
  const n7 = new NodeNext(7);
  const n2 = new NodeNext(2, n4, n5);
  const n3 = new NodeNext(3, null, n7);
  return new NodeNext(1, n2, n3);
}

function printNextPointers2(root: NodeNext | null): string[] {
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
    // 找下一层最左节点
    let nextLeft: NodeNext | null = null;
    let c: NodeNext | null = leftmost;
    while (c !== null && nextLeft === null) {
      nextLeft = c.left ?? c.right;
      c = c.next;
    }
    leftmost = nextLeft;
  }
  return result;
}

const tree022a = buildTree022();
connect2(tree022a);
console.log("BFS:", printNextPointers2(tree022a));
// 1-># | 2->3 | 3-># | 4->5 | 5->7 | 7->#

const tree022b = buildTree022();
connect2Optimized(tree022b);
console.log("优化:", printNextPointers2(tree022b));

console.log("空树 BFS:", connect2(null)); // null
console.log("空树 优化:", connect2Optimized(null)); // null

export {};
