// ============================================================
// 090. 扁平化多级双向链表
// ============================================================
// LeetCode 430. Flatten a Multilevel Doubly Linked List
// 多级双向链表中，节点除了 next 和 prev，还有 child 指针指向另一双向链表。
// 请将链表扁平化，使所有子链表的节点插入到对应父节点之后，子指针置空。
// 时间复杂度：O(n)，空间复杂度：O(d) 递归栈（方法1）/ O(d) 栈（方法2），d 为深度

// 多级双向链表节点定义
class Node {
  val: number;
  prev: Node | null;
  next: Node | null;
  child: Node | null;
  constructor(
    val: number = 0,
    prev: Node | null = null,
    next: Node | null = null,
    child: Node | null = null
  ) {
    this.val = val;
    this.prev = prev;
    this.next = next;
    this.child = child;
  }
}

// 辅助函数：根据数组构建普通双向链表（无 child）
function buildDoublyList(arr: number[]): Node | null {
  if (arr.length === 0) return null;
  const nodes = arr.map((v) => new Node(v));
  for (let i = 0; i < nodes.length; i++) {
    if (i > 0) {
      nodes[i].prev = nodes[i - 1];
      nodes[i - 1].next = nodes[i];
    }
  }
  return nodes[0];
}

// 辅助函数：双向链表转数组
function doublyListToArray(head: Node | null): number[] {
  const arr: number[] = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  return arr;
}

// ------------------------------------------------------------
// 方法1：DFS 递归法
// ------------------------------------------------------------
// 遍历链表，当遇到有 child 的节点时，递归扁平化子链表，
// 然后将子链表插入到当前节点与下一节点之间。
function flatten(head: Node | null): Node | null {
  if (head === null) return head;
  flattenDFS(head);
  return head;
}

// 扁平化以 node 为头的链表，返回扁平化后的尾节点
function flattenDFS(node: Node): Node {
  let cur: Node | null = node;
  let tail: Node = node;

  while (cur !== null) {
    const next: Node | null = cur.next;
    // 当前节点有子链表，需要扁平化并插入
    if (cur.child !== null) {
      // 递归扁平化子链表，得到子链表的头和尾
      const childHead = cur.child;
      const childTail = flattenDFS(childHead);

      // 将子链表插入到 cur 与 next 之间
      cur.next = childHead;
      childHead.prev = cur;
      cur.child = null; // 清空 child 指针

      // 子链表尾部连接到 next
      if (next !== null) {
        childTail.next = next;
        next.prev = childTail;
      }
      tail = childTail;
      cur = next;
    } else {
      tail = cur;
      cur = next;
    }
  }

  return tail;
}

// ------------------------------------------------------------
// 方法2：迭代法（用栈模拟 DFS）
// ------------------------------------------------------------
// 使用栈保存有 child 的节点的 next，遇到 child 时优先处理 child。
// 维护 prev 指针连接前后节点。
function flattenIterative(head: Node | null): Node | null {
  if (head === null) return null;

  const stack: Node[] = [];
  let prev: Node | null = null;
  let curr: Node | null = head;

  while (curr !== null || stack.length > 0) {
    if (curr === null) {
      curr = stack.pop()!;
    }

    if (curr.child !== null) {
      // 当前节点有 child，将 next 压栈，转向 child
      if (curr.next !== null) {
        stack.push(curr.next);
      }
      // child 接到当前节点后面
      curr.next = curr.child;
      curr.child.prev = curr;
      curr.child = null;
    } else {
      // 没有 child，继续向后
    }

    // 维护 prev 双向连接
    curr.prev = prev;
    if (prev !== null) {
      prev.next = curr;
    }
    prev = curr;
    curr = curr.next;
  }

  // 重置 head 的 prev
  head.prev = null;
  return head;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：构建多级链表
  // 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6
  //           |
  //           7 <-> 8 <-> 9 <-> 10
  //                |
  //                11 <-> 12
  // 扁平化后应为：1,2,3,7,8,11,12,9,10,4,5,6
  const n1 = new Node(1);
  const n2 = new Node(2);
  const n3 = new Node(3);
  const n4 = new Node(4);
  const n5 = new Node(5);
  const n6 = new Node(6);
  const n7 = new Node(7);
  const n8 = new Node(8);
  const n9 = new Node(9);
  const n10 = new Node(10);
  const n11 = new Node(11);
  const n12 = new Node(12);

  // 第一层连接
  n1.next = n2;
  n2.prev = n1;
  n2.next = n3;
  n3.prev = n2;
  n3.next = n4;
  n4.prev = n3;
  n4.next = n5;
  n5.prev = n4;
  n5.next = n6;
  n6.prev = n5;

  // child 关系
  n3.child = n7;

  // 第二层连接
  n7.next = n8;
  n8.prev = n7;
  n8.next = n9;
  n9.prev = n8;
  n9.next = n10;
  n10.prev = n9;

  // child 关系
  n8.child = n11;

  // 第三层连接
  n11.next = n12;
  n12.prev = n11;

  console.log("测试1 - DFS 递归法:");
  const result1 = flatten(n1);
  console.log("  扁平化后:", doublyListToArray(result1));
  console.log("  期望:    [1, 2, 3, 7, 8, 11, 12, 9, 10, 4, 5, 6]");

  // 测试2：用迭代法构建同样的多级链表
  const m1 = new Node(1);
  const m2 = new Node(2);
  const m3 = new Node(3);
  const m4 = new Node(4);
  const m5 = new Node(5);
  const m6 = new Node(6);
  const m7 = new Node(7);
  const m8 = new Node(8);
  const m9 = new Node(9);
  const m10 = new Node(10);
  const m11 = new Node(11);
  const m12 = new Node(12);

  m1.next = m2;
  m2.prev = m1;
  m2.next = m3;
  m3.prev = m2;
  m3.next = m4;
  m4.prev = m3;
  m4.next = m5;
  m5.prev = m4;
  m5.next = m6;
  m6.prev = m5;
  m3.child = m7;
  m7.next = m8;
  m8.prev = m7;
  m8.next = m9;
  m9.prev = m8;
  m9.next = m10;
  m10.prev = m9;
  m8.child = m11;
  m11.next = m12;
  m12.prev = m11;

  console.log("测试2 - 迭代法:");
  const result2 = flattenIterative(m1);
  console.log("  扁平化后:", doublyListToArray(result2));
  console.log("  期望:    [1, 2, 3, 7, 8, 11, 12, 9, 10, 4, 5, 6]");

  // 测试3：无 child 的普通链表
  const list3 = buildDoublyList([1, 2, 3]);
  console.log("测试3 - 无 child:");
  const result3 = flatten(list3);
  console.log("  扁平化后:", doublyListToArray(result3));
  console.log("  期望:    [1, 2, 3]");

  // 测试4：空链表
  console.log("测试4 - 空链表:");
  const result4 = flatten(null);
  console.log("  扁平化后:", result4);
  console.log("  期望:    null");
}

test();

export {};
