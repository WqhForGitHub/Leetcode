// ============================================================
// 037. LFU 缓存
// ============================================================
// LeetCode 460. LFU Cache
// 设计并实现最不经常使用（LFU）缓存的数据结构，满足 O(1) 时间复杂度的 get 和 put 操作。
// 方法：哈希表 + 按频率分桶的双向链表，minFreq 记录当前最小频率。
// 时间复杂度：get/put 均 O(1)，空间复杂度：O(capacity)

// 双向链表节点
class DLinkedNode {
  key: number;
  val: number;
  freq: number;
  prev: DLinkedNode | null = null;
  next: DLinkedNode | null = null;

  constructor(key: number, val: number, freq: number) {
    this.key = key;
    this.val = val;
    this.freq = freq;
  }
}

// 双向链表：维护同一频率下的所有节点，最近访问的在头部
class DLinkedList {
  // 使用 dummy 头尾节点简化边界处理
  private head: DLinkedNode;
  private tail: DLinkedNode;

  constructor() {
    this.head = new DLinkedNode(0, 0, 0);
    this.tail = new DLinkedNode(0, 0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 在头部插入节点（表示最近使用）
  addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  // 移除某个节点
  removeNode(node: DLinkedNode): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  // 弹出尾部节点（最久未使用），返回它
  popTail(): DLinkedNode | null {
    if (this.isEmpty()) return null;
    const node = this.tail.prev as DLinkedNode;
    this.removeNode(node);
    return node;
  }

  isEmpty(): boolean {
    return this.head.next === this.tail;
  }
}

class LFUCache {
  private capacity: number;
  private size: number;
  private minFreq: number;
  // key -> 节点
  private keyTable: Map<number, DLinkedNode>;
  // freq -> 双向链表
  private freqTable: Map<number, DLinkedList>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.minFreq = 0;
    this.keyTable = new Map();
    this.freqTable = new Map();
  }

  // 增加节点访问频率：从当前频率桶移除，加入下一频率桶头部
  private increaseFreq(node: DLinkedNode): void {
    const freq = node.freq;
    // 从旧频率桶中移除
    const oldList = this.freqTable.get(freq)!;
    oldList.removeNode(node);
    // 更新 minFreq
    if (freq === this.minFreq && oldList.isEmpty()) {
      this.minFreq = freq + 1;
    }
    // 加入新频率桶
    node.freq = freq + 1;
    let newList = this.freqTable.get(freq + 1);
    if (!newList) {
      newList = new DLinkedList();
      this.freqTable.set(freq + 1, newList);
    }
    newList.addToHead(node);
  }

  get(key: number): number {
    const node = this.keyTable.get(key);
    if (!node) return -1;
    // 访问后频率 +1
    this.increaseFreq(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.capacity === 0) return;
    const node = this.keyTable.get(key);
    if (node) {
      // 已存在：更新值并增加频率
      node.val = value;
      this.increaseFreq(node);
      return;
    }
    // 不存在：可能需要淘汰
    if (this.size === this.capacity) {
      // 淘汰 minFreq 桶中最久未使用的节点（尾部）
      const minList = this.freqTable.get(this.minFreq)!;
      const removed = minList.popTail()!;
      this.keyTable.delete(removed.key);
      this.size--;
    }
    // 新节点频率为 1
    const newNode = new DLinkedNode(key, value, 1);
    this.keyTable.set(key, newNode);
    let list = this.freqTable.get(1);
    if (!list) {
      list = new DLinkedList();
      this.freqTable.set(1, list);
    }
    list.addToHead(newNode);
    this.size++;
    this.minFreq = 1; // 新插入后最小频率必然为 1
  }
}

// ----------------------- 测试 -----------------------
function testLFU(): void {
  const cache = new LFUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  console.log("get(1) =>", cache.get(1)); // 1
  cache.put(3, 3); // 淘汰 key=2
  console.log("get(2) =>", cache.get(2)); // -1
  console.log("get(3) =>", cache.get(3)); // 3
  cache.put(4, 4); // 淘汰 key=1
  console.log("get(1) =>", cache.get(1)); // -1
  console.log("get(3) =>", cache.get(3)); // 3
  console.log("get(4) =>", cache.get(4)); // 4
}

testLFU();

export {};
