// ============================================================
// 038. 设计循环队列
// ============================================================
// LeetCode 622. Design Circular Queue
// 设计固定大小的循环队列，支持队尾入队、队首出队、取队首队尾元素等操作。
// 方法：数组实现，维护 front、rear、count、capacity。
// 时间复杂度：所有操作 O(1)，空间复杂度：O(k)

class MyCircularQueue {
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

  // 向队尾插入元素
  enQueue(value: number): boolean {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
    return true;
  }

  // 从队首删除元素
  deQueue(): boolean {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return true;
  }

  // 获取队首元素
  Front(): number {
    if (this.isEmpty()) return -1;
    return this.data[this.front];
  }

  // 获取队尾元素
  Rear(): number {
    if (this.isEmpty()) return -1;
    // rear 指向队尾下一位置，故回退一格
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
function testCircularQueue(): void {
  const q = new MyCircularQueue(3);
  console.log("enQueue(1) =>", q.enQueue(1)); // true
  console.log("enQueue(2) =>", q.enQueue(2)); // true
  console.log("enQueue(3) =>", q.enQueue(3)); // true
  console.log("enQueue(4) =>", q.enQueue(4)); // false
  console.log("Rear() =>", q.Rear()); // 3
  console.log("isFull() =>", q.isFull()); // true
  console.log("deQueue() =>", q.deQueue()); // true
  console.log("enQueue(4) =>", q.enQueue(4)); // true
  console.log("Rear() =>", q.Rear()); // 4
  console.log("Front() =>", q.Front()); // 2
}

testCircularQueue();

export {};
