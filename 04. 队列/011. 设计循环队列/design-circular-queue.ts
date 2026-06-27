// ============================================================
// 011. 设计循环队列
// ============================================================
// LeetCode 622. Design Circular Queue
// 设计你的循环队列实现，能容纳 k 个元素。

// ------------------------------------------------------------
// 方法1：数组 + 头尾指针
// ------------------------------------------------------------
// 用长度为 k 的数组，front 指向队首，rear 指向下一个入队位置。
// 用 count 记录当前元素个数，避免 front==rear 的二义性。
// 时间 O(1) 所有操作，空间 O(k)。
class MyCircularQueue1 {
  private data: number[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;
  private capacity: number;

  constructor(k: number) {
    this.data = new Array(k);
    this.capacity = k;
  }

  enQueue(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return true;
  }

  Front(): number {
    return this.isEmpty() ? -1 : this.data[this.front];
  }

  Rear(): number {
    if (this.isEmpty()) return -1;
    return this.data[(this.rear - 1 + this.capacity) % this.capacity];
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }
}

// ------------------------------------------------------------
// 方法2：多留一个空位
// ------------------------------------------------------------
// 开 k+1 的数组，通过 (rear+1)%cap==front 判满，front==rear 判空。
// 时间 O(1) 所有操作，空间 O(k)。
class MyCircularQueue2 {
  private data: number[];
  private front: number = 0;
  private rear: number = 0;
  private cap: number;

  constructor(k: number) {
    this.data = new Array(k + 1);
    this.cap = k + 1;
  }

  enQueue(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.cap;
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.cap;
    return true;
  }

  Front(): number {
    return this.isEmpty() ? -1 : this.data[this.front];
  }

  Rear(): number {
    return this.isEmpty()
      ? -1
      : this.data[(this.rear - 1 + this.cap) % this.cap];
  }

  isEmpty(): boolean {
    return this.front === this.rear;
  }

  isFull(): boolean {
    return (this.rear + 1) % this.cap === this.front;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const q1 = new MyCircularQueue1(3);
  console.log("测试1 enQueue(1):", q1.enQueue(1), "期望: true");
  console.log("测试2 enQueue(2):", q1.enQueue(2), "期望: true");
  console.log("测试3 enQueue(3):", q1.enQueue(3), "期望: true");
  console.log("测试4 enQueue(4):", q1.enQueue(4), "期望: false");
  console.log("测试5 Rear:", q1.Rear(), "期望: 3");
  console.log("测试6 isFull:", q1.isFull(), "期望: true");
  console.log("测试7 deQueue:", q1.deQueue(), "期望: true");
  console.log("测试8 Front:", q1.Front(), "期望: 2");

  const q2 = new MyCircularQueue2(3);
  console.log("测试9 enQueue(1):", q2.enQueue(1), "期望: true");
  console.log("测试10 Rear:", q2.Rear(), "期望: 1");
  console.log("测试11 enQueue(2):", q2.enQueue(2), "期望: true");
  console.log("测试12 Rear:", q2.Rear(), "期望: 2");
}

test();

export {};
