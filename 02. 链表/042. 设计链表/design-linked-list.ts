// ============================================================
// 042. 设计链表
// ============================================================
// LeetCode 707. Design Linked List
// 设计单链表 / 双向链表，支持 get、addAtHead、addAtTail、addAtIndex、deleteAtIndex。
// 方法1：单链表 + dummy 头节点 + size 计数。
// 方法2：双向链表 + dummy 头尾节点。
// 时间复杂度：get/addAtIndex/deleteAtIndex O(index)，addAtHead/addAtTail O(1)；空间 O(n)

// ===== 单链表节点 =====
class SListNode {
  val: number;
  next: SListNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

// 方法1：单链表实现
class MyLinkedList {
  private head: SListNode; // dummy 头节点
  private size: number;

  constructor() {
    this.head = new SListNode(0);
    this.size = 0;
  }

  // 获取第 index 个节点的值，若无效返回 -1
  get(index: number): number {
    if (index < 0 || index >= this.size) return -1;
    let cur: SListNode | null = this.head.next;
    for (let i = 0; i < index; i++) {
      cur = cur!.next;
    }
    return cur ? cur.val : -1;
  }

  // 在头部添加节点
  addAtHead(val: number): void {
    this.addAtIndex(0, val);
  }

  // 在尾部添加节点
  addAtTail(val: number): void {
    this.addAtIndex(this.size, val);
  }

  // 在第 index 个节点前插入；若 index 等于链表长度则插入到尾部；index > 长度时不插入；index < 0 时插入头部
  addAtIndex(index: number, val: number): void {
    if (index > this.size) return;
    if (index < 0) index = 0;
    // 找到要插入位置的前驱
    let prev: SListNode = this.head;
    for (let i = 0; i < index; i++) {
      prev = prev.next as SListNode;
    }
    const node = new SListNode(val);
    node.next = prev.next;
    prev.next = node;
    this.size++;
  }

  // 删除第 index 个节点
  deleteAtIndex(index: number): void {
    if (index < 0 || index >= this.size) return;
    let prev: SListNode = this.head;
    for (let i = 0; i < index; i++) {
      prev = prev.next as SListNode;
    }
    if (prev.next) {
      prev.next = prev.next.next;
    }
    this.size--;
  }
}

// ===== 双向链表节点 =====
class DNode {
  val: number;
  prev: DNode | null = null;
  next: DNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

// 方法2：双向链表实现（dummy 头尾节点）
class MyLinkedListDouble {
  private head: DNode; // dummy 头
  private tail: DNode; // dummy 尾
  private size: number;

  constructor() {
    this.head = new DNode(0);
    this.tail = new DNode(0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  get(index: number): number {
    if (index < 0 || index >= this.size) return -1;
    let cur = this.head.next!;
    for (let i = 0; i < index; i++) {
      cur = cur.next!;
    }
    return cur.val;
  }

  addAtHead(val: number): void {
    const node = new DNode(val);
    const first = this.head.next!;
    node.prev = this.head;
    node.next = first;
    this.head.next = node;
    first.prev = node;
    this.size++;
  }

  addAtTail(val: number): void {
    const node = new DNode(val);
    const last = this.tail.prev!;
    node.next = this.tail;
    node.prev = last;
    last.next = node;
    this.tail.prev = node;
    this.size++;
  }

  addAtIndex(index: number, val: number): void {
    if (index > this.size) return;
    if (index < 0) index = 0;
    if (index === this.size) {
      this.addAtTail(val);
      return;
    }
    // 找到原 index 位置的节点 cur，在其前面插入
    let cur = this.head.next!;
    for (let i = 0; i < index; i++) {
      cur = cur.next!;
    }
    const node = new DNode(val);
    const prev = cur.prev!;
    node.prev = prev;
    node.next = cur;
    prev.next = node;
    cur.prev = node;
    this.size++;
  }

  deleteAtIndex(index: number): void {
    if (index < 0 || index >= this.size) return;
    let cur = this.head.next!;
    for (let i = 0; i < index; i++) {
      cur = cur.next!;
    }
    const prev = cur.prev!;
    const next = cur.next!;
    prev.next = next;
    next.prev = prev;
    this.size--;
  }
}

// ----------------------- 测试 -----------------------
function testLinkedList(): void {
  const list = new MyLinkedList();
  list.addAtHead(1);
  list.addAtTail(3);
  list.addAtIndex(1, 2); // 1 -> 2 -> 3
  console.log("get(1) =>", list.get(1)); // 2
  list.deleteAtIndex(1); // 1 -> 3
  console.log("get(1) =>", list.get(1)); // 3

  console.log("--- 双向链表 ---");
  const dl = new MyLinkedListDouble();
  dl.addAtHead(1);
  dl.addAtTail(3);
  dl.addAtIndex(1, 2);
  console.log("get(1) =>", dl.get(1)); // 2
  dl.deleteAtIndex(0);
  console.log("get(0) =>", dl.get(0)); // 2
}

testLinkedList();

export {};
