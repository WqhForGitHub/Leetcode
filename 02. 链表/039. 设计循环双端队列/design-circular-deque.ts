// ============================================================
// 039. 设计循环双端队列
// ============================================================
// LeetCode 641. Design Circular Deque
// 设计固定大小的循环双端队列，支持两端插入和删除操作。
// 方法：数组实现，维护 front、rear、count、capacity。
// 时间复杂度：所有操作 O(1)，空间复杂度：O(k)

class MyCircularDeque {
  private data: number[];
  private front: number; // 队首元素下标
  private rear: number; // 队尾元素的下一插入位置下标
  private count: number; // 当前元素个数
  private capacity: number;

  constructor(k: number) {
    this.data = new Array(k).fill(0);
    this.front = 0;
    this.rear = 0;
    this.count = 0;
    this.capacity = k;
  }

  // 头部插入：front 往前移动一格
  insertFront(value: number): boolean {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.capacity) % this.capacity;
    this.data[this.front] = value;
    this.count++;
    return true;
  }

  // 尾部插入：rear 位置写入后往后移动一格
  insertLast(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
    return true;
  }

  // 头部删除：front 往后移动一格
  deleteFront(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return true;
  }

  // 尾部删除：rear 往前移动一格
  deleteLast(): boolean {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    this.count--;
    return true;
  }

  getFront(): number {
    if (this.isEmpty()) return -1;
    return this.data[this.front];
  }

  getRear(): number {
    if (this.isEmpty()) return -1;
    const tailIndex = (this.rear - 1 + this.capacity) % this.capacity;
    return this.data[tailIndex];
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }
}

// ----------------------- 测试 -----------------------
function testCircularDeque(): void {
  const dq = new MyCircularDeque(3);
  console.log("insertLast(1) =>", dq.insertLast(1)); // true
  console.log("insertLast(2) =>", dq.insertLast(2)); // true
  console.log("insertFront(3) =>", dq.insertFront(3)); // true
  console.log("insertFront(4) =>", dq.insertFront(4)); // false (满)
  console.log("getRear() =>", dq.getRear()); // 2
  console.log("isFull() =>", dq.isFull()); // true
  console.log("deleteLast() =>", dq.deleteLast()); // true
  console.log("insertFront(4) =>", dq.insertFront(4)); // true
  console.log("getFront() =>", dq.getFront()); // 4
}

testCircularDeque();

export {};
