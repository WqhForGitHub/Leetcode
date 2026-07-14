// ============================================================
// 087. LFU 缓存
// ============================================================
// LeetCode 460. LFU Cache
// 设计最不经常使用（LFU）缓存，get 和 put 操作均为 O(1)
// 思路：哈希表 key->节点 + 哈希表 频率->双向链表，同频率按 LRU 排序
// 时间复杂度：O(1)，空间复杂度：O(capacity)

// 双向链表节点
class DLinkedNode {
  key: number;
  value: number;
  freq: number;
  prev: DLinkedNode | null = null;
  next: DLinkedNode | null = null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.freq = 1;
  }
}

// 双向链表（带头尾哨兵节点），表头为最新访问，表尾为最久未访问
class DLinkedList {
  private head: DLinkedNode;
  private tail: DLinkedNode;

  constructor() {
    this.head = new DLinkedNode(0, 0);
    this.tail = new DLinkedNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 在链表头部插入节点
  addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // 移除指定节点
  removeNode(node: DLinkedNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // 移除尾部节点（最久未使用）并返回
  removeTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  // 判断链表是否为空
  isEmpty(): boolean {
    return this.head.next === this.tail;
  }
}

class LFUCache {
  private capacity: number;
  private minFreq: number;
  private keyMap: Map<number, DLinkedNode>; // key -> 节点
  private freqMap: Map<number, DLinkedList>; // 频率 -> 双向链表

  constructor(capacity: number) {
    this.capacity = capacity;
    this.minFreq = 0;
    this.keyMap = new Map();
    this.freqMap = new Map();
  }

  get(key: number): number {
    if (!this.keyMap.has(key)) {
      return -1;
    }
    const node = this.keyMap.get(key)!;
    this.increaseFreq(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.capacity === 0) return;

    if (this.keyMap.has(key)) {
      // 已存在，更新值并增加频率
      const node = this.keyMap.get(key)!;
      node.value = value;
      this.increaseFreq(node);
      return;
    }

    // 新节点，若超出容量则淘汰最小频率链表中最久未使用的
    if (this.keyMap.size >= this.capacity) {
      const minFreqList = this.freqMap.get(this.minFreq)!;
      const removedNode = minFreqList.removeTail();
      this.keyMap.delete(removedNode.key);
    }

    // 创建新节点，频率为 1
    const newNode = new DLinkedNode(key, value);
    this.keyMap.set(key, newNode);
    if (!this.freqMap.has(1)) {
      this.freqMap.set(1, new DLinkedList());
    }
    this.freqMap.get(1)!.addToHead(newNode);
    this.minFreq = 1;
  }

  // 增加节点频率：从旧频率链表移除，加入新频率链表头部
  private increaseFreq(node: DLinkedNode): void {
    const oldFreq = node.freq;
    const oldList = this.freqMap.get(oldFreq)!;
    oldList.removeNode(node);

    // 若旧频率链表为空且是最小频率，更新最小频率
    if (oldList.isEmpty() && this.minFreq === oldFreq) {
      this.minFreq = oldFreq + 1;
    }

    node.freq = oldFreq + 1;
    const newFreq = node.freq;
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new DLinkedList());
    }
    this.freqMap.get(newFreq)!.addToHead(node);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. LFU 缓存 =====");

// 测试1：基本操作
const lfu1 = new LFUCache(2);
lfu1.put(1, 1); // 缓存 {1=1}
lfu1.put(2, 2); // 缓存 {1=1, 2=2}
console.log(lfu1.get(1)); // 1，缓存 {2=2(频1), 1=1(频2)}
lfu1.put(3, 3); // 淘汰 key 2，缓存 {1=1(频2), 3=3(频1)}
console.log(lfu1.get(2)); // -1（已淘汰）
console.log(lfu1.get(3)); // 3，缓存 {1=1(频2), 3=3(频2)}
lfu1.put(4, 4); // 淘汰 key 1，缓存 {3=3(频2), 4=4(频1)}
console.log(lfu1.get(1)); // -1（已淘汰）
console.log(lfu1.get(3)); // 3
console.log(lfu1.get(4)); // 4

// 测试2：容量为 0
const lfu2 = new LFUCache(0);
lfu2.put(0, 0);
console.log(lfu2.get(0)); // -1

export {};
