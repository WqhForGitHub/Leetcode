// ============================================================
// 020. LRU 缓存
// ============================================================
// LeetCode 146. LRU Cache
// 设计并实现 LRU 缓存结构，get 和 put 操作均为 O(1)。
// 使用哈希表 + 双向链表实现：哈希表用于 O(1) 查找，双向链表维护访问顺序。
// 时间复杂度：get/put 均 O(1)，空间复杂度：O(capacity)

// 双向链表节点定义
class DLinkedNode {
  key: number;
  value: number;
  prev: DLinkedNode | null;
  next: DLinkedNode | null;
  constructor(key?: number, value?: number) {
    this.key = key === undefined ? 0 : key;
    this.value = value === undefined ? 0 : value;
    this.prev = null;
    this.next = null;
  }
}

// ============================================================
// LRUCache 类实现
// ============================================================
class LRUCache {
  private capacity: number;
  private size: number;
  private cache: Map<number, DLinkedNode>;
  private head: DLinkedNode; // 虚拟头节点
  private tail: DLinkedNode; // 虚拟尾节点

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map<number, DLinkedNode>();
    // 使用虚拟头尾节点简化边界处理
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 获取元素：存在则移到头部并返回值，不存在返回 -1
  get(key: number): number {
    const node = this.cache.get(key);
    if (node === undefined) return -1;
    this.moveToHead(node);
    return node.value;
  }

  // 插入/更新元素
  put(key: number, value: number): void {
    const node = this.cache.get(key);
    if (node !== undefined) {
      // key 已存在，更新值并移到头部
      node.value = value;
      this.moveToHead(node);
    } else {
      // key 不存在，创建新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.size++;
      // 超出容量，移除尾部节点（最久未使用）
      if (this.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
        this.size--;
      }
    }
  }

  // 在头部添加节点
  private addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // 移除节点
  private removeNode(node: DLinkedNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // 将节点移到头部
  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除尾部节点（最久未使用）
  private removeTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. LRU 缓存 =====");

// 测试1: 基本操作
const lru1 = new LRUCache(2);
lru1.put(1, 1);
lru1.put(2, 2);
console.log("测试1 - get(1):", lru1.get(1)); // 预期: 1
lru1.put(3, 3); // 淘汰 key 2
console.log("测试1 - get(2):", lru1.get(2)); // 预期: -1
lru1.put(4, 4); // 淘汰 key 1
console.log("测试1 - get(1):", lru1.get(1)); // 预期: -1
console.log("测试1 - get(3):", lru1.get(3)); // 预期: 3
console.log("测试1 - get(4):", lru1.get(4)); // 预期: 4

// 测试2: 更新已存在的 key
const lru2 = new LRUCache(2);
lru2.put(1, 1);
lru2.put(2, 2);
console.log("测试2 - get(1):", lru2.get(1)); // 预期: 1
lru2.put(3, 3); // 淘汰 key 2
console.log("测试2 - get(2):", lru2.get(2)); // 预期: -1
lru2.put(4, 4); // 淘汰 key 1
console.log("测试2 - get(1):", lru2.get(1)); // 预期: -1
console.log("测试2 - get(3):", lru2.get(3)); // 预期: 3
console.log("测试2 - get(4):", lru2.get(4)); // 预期: 4

// 测试3: 容量为 1
const lru3 = new LRUCache(1);
lru3.put(1, 1);
console.log("测试3 - get(1):", lru3.get(1)); // 预期: 1
lru3.put(2, 2); // 淘汰 key 1
console.log("测试3 - get(1):", lru3.get(1)); // 预期: -1
console.log("测试3 - get(2):", lru3.get(2)); // 预期: 2

export {};
