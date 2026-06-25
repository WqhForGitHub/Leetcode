// ============================================================
// 044. 最大栈
// ============================================================
// LeetCode 716. Max Stack
// 设计一个最大栈，支持 push、pop、top、peekMax、popMax。
//   - popMax 需要从栈中间删除最大元素（栈顶有多个相同最大值时取最靠近栈顶的）。
// 方法1：双栈（主栈 + 最大栈同步）。
// 方法2：双向链表 + TreeMap。
// 方法1 时间复杂度：push/pop/top/peekMax O(1)，popMax O(n)；空间 O(n)

// 方法1：双栈实现
// 主栈存储元素，最大栈同步维护当前最大值。
// popMax 时：用一个辅助栈把主栈元素弹出直到遇到最大值，删除后再依次回压，并同步最大栈。
class MaxStack {
  private stack: number[];
  private maxStack: number[];

  constructor() {
    this.stack = [];
    this.maxStack = [];
  }

  push(x: number): void {
    this.stack.push(x);
    if (this.maxStack.length === 0 || x >= this.maxStack[this.maxStack.length - 1]) {
      this.maxStack.push(x);
    } else {
      this.maxStack.push(this.maxStack[this.maxStack.length - 1]);
    }
  }

  pop(): number {
    this.maxStack.pop();
    return this.stack.pop()!;
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  peekMax(): number {
    return this.maxStack[this.maxStack.length - 1];
  }

  // 弹出栈中最大元素（靠近栈顶的那个）
  popMax(): number {
    const maxVal = this.peekMax();
    const buffer: number[] = [];
    // 把栈顶不是最大值的元素先暂存
    while (this.top() !== maxVal) {
      buffer.push(this.pop());
    }
    // 弹出最大值
    this.pop();
    // 回压
    while (buffer.length > 0) {
      this.push(buffer.pop()!);
    }
    return maxVal;
  }
}

// ===== 方法2：双向链表 + TreeMap =====
// 双向链表存储所有元素（便于 O(1) 删除已知节点），TreeMap<number, 节点列表> 按值降序组织。
// push: 链表头插 + TreeMap 添加；popMax: 取 TreeMap 最大值对应最末节点删除。
// 这里以简单实现为主，popMax/peekMax 为 O(log n)。

class DLNode {
  val: number;
  prev: DLNode | null = null;
  next: DLNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

class MaxStackDouble {
  private head: DLNode; // dummy 头
  private tail: DLNode; // dummy 尾
  // key: 值，value: 该值对应的节点数组（同值可能有多个，末尾为最靠近栈顶）
  private map: Map<number, DLNode[]>;

  constructor() {
    this.head = new DLNode(0);
    this.tail = new DLNode(0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.map = new Map();
  }

  // 在链表头部插入（栈顶 = 头部）
  private addHead(node: DLNode): void {
    const first = this.head.next!;
    node.prev = this.head;
    node.next = first;
    this.head.next = node;
    first.prev = node;
  }

  // 从链表中移除节点
  private removeNode(node: DLNode): void {
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
  }

  // 找到当前 map 中最大键
  private maxKey(): number {
    let max = -Infinity;
    for (const k of this.map.keys()) {
      if (k > max) max = k;
    }
    return max;
  }

  push(x: number): void {
    const node = new DLNode(x);
    this.addHead(node);
    if (!this.map.has(x)) this.map.set(x, []);
    this.map.get(x)!.push(node);
  }

  pop(): number {
    const node = this.head.next!;
    this.removeNode(node);
    const arr = this.map.get(node.val)!;
    arr.pop();
    if (arr.length === 0) this.map.delete(node.val);
    return node.val;
  }

  top(): number {
    return this.head.next!.val;
  }

  peekMax(): number {
    return this.maxKey();
  }

  popMax(): number {
    const key = this.maxKey();
    const arr = this.map.get(key)!;
    // 最靠近栈顶的节点 = 数组末尾
    const node = arr.pop()!;
    this.removeNode(node);
    if (arr.length === 0) this.map.delete(key);
    return node.val;
  }
}

// ----------------------- 测试 -----------------------
function testMaxStack(): void {
  console.log("--- 双栈法 ---");
  const stk = new MaxStack();
  stk.push(5);
  stk.push(1);
  stk.push(5);
  console.log("top() =>", stk.top()); // 5
  console.log("popMax() =>", stk.popMax()); // 5
  console.log("top() =>", stk.top()); // 1
  console.log("peekMax() =>", stk.peekMax()); // 5
  console.log("pop() =>", stk.pop()); // 1
  console.log("top() =>", stk.top()); // 5

  console.log("--- 双向链表 + Map ---");
  const stk2 = new MaxStackDouble();
  stk2.push(5);
  stk2.push(1);
  stk2.push(5);
  console.log("top() =>", stk2.top()); // 5
  console.log("popMax() =>", stk2.popMax()); // 5
  console.log("top() =>", stk2.top()); // 1
  console.log("peekMax() =>", stk2.peekMax()); // 5
  console.log("pop() =>", stk2.pop()); // 1
  console.log("top() =>", stk2.top()); // 5
}

testMaxStack();

export {};
