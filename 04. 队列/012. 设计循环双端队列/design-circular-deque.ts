// ============================================================
// 012. 设计循环双端队列
// ============================================================
// LeetCode 641. Design Circular Deque
// 设计实现双端循环队列，支持从队首和队尾插入/删除。

// ------------------------------------------------------------
// 方法1：数组 + count 计数
// ------------------------------------------------------------
// 用长度为 k 的数组，front/rear 指针和 count 记录元素个数。
// 时间 O(1) 所有操作，空间 O(k)。
class MyCircularDeque1 {
  private data: number[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;
  private capacity: number;

  constructor(k: number) {
    this.data = new Array(k);
    this.capacity = k;
  }

  insertFront(value: number): boolean {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.capacity) % this.capacity;
    this.data[this.front] = value;
    this.count++;
    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    this.count--;
    return true;
  }

  getFront(): number {
    return this.isEmpty() ? -1 : this.data[this.front];
  }

  getRear(): number {
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
// 开 k+1 数组，用指针关系判空判满，无需额外计数。
// 时间 O(1) 所有操作，空间 O(k)。
class MyCircularDeque2 {
  private data: number[];
  private front: number = 0;
  private rear: number = 0;
  private cap: number;

  constructor(k: number) {
    this.data = new Array(k + 1);
    this.cap = k + 1;
  }

  insertFront(value: number): boolean {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.cap) % this.cap;
    this.data[this.front] = value;
    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.cap;
    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.cap;
    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.cap) % this.cap;
    return true;
  }

  getFront(): number {
    return this.isEmpty() ? -1 : this.data[this.front];
  }

  getRear(): number {
    return this.isEmpty() ? -1 : this.data[(this.rear - 1 + this.cap) % this.cap];
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
  const d1 = new MyCircularDeque1(3);
  console.log("测试1 insertLast(1):", d1.insertLast(1), "期望: true");
  console.log("测试2 insertLast(2):", d1.insertLast(2), "期望: true");
  console.log("测试3 insertFront(3):", d1.insertFront(3), "期望: true");
  console.log("测试4 getFront:", d1.getFront(), "期望: 3");
  console.log("测试5 isFull:", d1.isFull(), "期望: true");
  console.log("测试6 deleteLast:", d1.deleteLast(), "期望: true");
  console.log("测试7 insertFront(4):", d1.insertFront(4), "期望: true");
  console.log("测试8 getFront:", d1.getFront(), "期望: 4");

  const d2 = new MyCircularDeque2(3);
  console.log("测试9 insertFront(1):", d2.insertFront(1), "期望: true");
  console.log("测试10 getRear:", d2.getRear(), "期望: 1");
}

test();

export {};
