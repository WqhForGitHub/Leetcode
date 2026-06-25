// ============================================================
// 113. LRU 缓存
// ============================================================
// 面试题 16.25 / LeetCode 146. LRU 缓存
// 设计和构建一个 "最近最少使用 (LRU)" 缓存数据结构，它应该支持 get 和 put 操作。
// get(key)：若 key 存在，返回对应值，并标记为最近使用；不存在返回 -1。
// put(key, value)：设置值，若 key 已存在则更新。
//   当缓存达到容量上限时，淘汰最久未使用的项。
// 时间复杂度：get O(1)（摊还），put O(1)（摊还）

// ============================================================
// 方法1：利用 Map 的有序性实现简洁版 LRU 缓存
// ============================================================
// JavaScript/TypeScript 中的 Map 会按插入顺序遍历元素。
// 利用这一特性：
// - get/put 时先 delete 再 set，使该 key 成为最新插入（排在末尾）。
// - 淘汰时取 Map 第一个 key（最旧）删除即可。
// 时间复杂度：get O(1)，put O(1)（淘汰时 map.keys().next() 为 O(1)）
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<number, number>();
  }

  // 获取值：若存在，先删除再重新插入以更新为最近使用，然后返回值
  get(key: number): number {
    if (this.cache.has(key)) {
      const val = this.cache.get(key)!;
      // 删除后重新插入，使其成为最新的（排在 Map 末尾）
      this.cache.delete(key);
      this.cache.set(key, val);
      return val;
    }
    return -1;
  }

  // 设置值：若 key 已存在，先删除旧记录。
  // 插入新记录后，若超出容量，淘汰最旧的（Map 第一个 key）。
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 淘汰最久未使用的（Map 中第一个 key）
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, value);
  }
}

// ============================================================
// 方法2：双向链表 + Map 实现（经典解法，更通用）
// ============================================================
// 手动维护双向链表，Map 存储 key -> 链表节点的映射。
// 链表头部为最近使用，尾部为最久未使用。
// 时间复杂度：get O(1)，put O(1)

// 双向链表节点
class DLinkedNode {
  key: number;
  value: number;
  prev: DLinkedNode | null;
  next: DLinkedNode | null;

  constructor(
    key: number = 0,
    value: number = 0,
    prev: DLinkedNode | null = null,
    next: DLinkedNode | null = null
  ) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class LRUCacheLinkedList {
  private capacity: number;
  private size: number;
  private cache: Map<number, DLinkedNode>;
  // 虚拟头尾节点，简化边界处理
  private head: DLinkedNode;
  private tail: DLinkedNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map<number, DLinkedNode>();
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 将节点添加到链表头部（head 之后）
  private addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // 从链表中移除节点
  private removeNode(node: DLinkedNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // 将节点移到链表头部
  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除链表尾部节点（tail 之前），返回被移除的节点
  private removeTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  get(key: number): number {
    const node = this.cache.get(key);
    if (!node) return -1;
    // 标记为最近使用
    this.moveToHead(node);
    return node.value;
  }

  put(key: number, value: number): void {
    const node = this.cache.get(key);
    if (node) {
      // key 已存在，更新值并移到头部
      node.value = value;
      this.moveToHead(node);
    } else {
      // 新 key，创建新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.size++;

      // 超出容量，淘汰尾部节点
      if (this.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
        this.size--;
      }
    }
  }
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 113. LRU 缓存 测试 =====\n");

  // 测试1：基本操作
  console.log("测试1: 基本 put/get 操作 (Map版)");
  const lru1 = new LRUCache(2);
  lru1.put(1, 1); // 缓存: {1=1}
  lru1.put(2, 2); // 缓存: {1=1, 2=2}
  console.log("  get(1):", lru1.get(1), "(期望: 1)"); // 返回 1，缓存变为 {2=2, 1=1}
  lru1.put(3, 3); // 淘汰 key 2，缓存: {1=1, 3=3}
  console.log("  get(2):", lru1.get(2), "(期望: -1)"); // 返回 -1
  lru1.put(4, 4); // 淘汰 key 1，缓存: {3=3, 4=4}
  console.log("  get(1):", lru1.get(1), "(期望: -1)"); // 返回 -1
  console.log("  get(3):", lru1.get(3), "(期望: 3)"); // 返回 3
  console.log("  get(4):", lru1.get(4), "(期望: 4)\n"); // 返回 4

  // 测试2：双向链表版本
  console.log("测试2: 基本 put/get 操作 (双向链表版)");
  const lru2 = new LRUCacheLinkedList(2);
  lru2.put(1, 1);
  lru2.put(2, 2);
  console.log("  get(1):", lru2.get(1), "(期望: 1)");
  lru2.put(3, 3);
  console.log("  get(2):", lru2.get(2), "(期望: -1)");
  lru2.put(4, 4);
  console.log("  get(1):", lru2.get(1), "(期望: -1)");
  console.log("  get(3):", lru2.get(3), "(期望: 3)");
  console.log("  get(4):", lru2.get(4), "(期望: 4)\n");

  // 测试3：更新已存在的 key
  console.log("测试3: 更新已存在的 key (Map版)");
  const lru3 = new LRUCache(2);
  lru3.put(1, 1);
  lru3.put(2, 2);
  lru3.put(1, 10); // 更新 key 1，不应淘汰 key 2
  console.log("  get(1):", lru3.get(1), "(期望: 10)");
  console.log("  get(2):", lru3.get(2), "(期望: 2)");
  lru3.put(3, 3); // 淘汰 key 2
  console.log("  get(2):", lru3.get(2), "(期望: -1)");
  console.log("  get(3):", lru3.get(3), "(期望: 3)\n");

  // 测试4：容量为 1
  console.log("测试4: 容量为 1 (Map版)");
  const lru4 = new LRUCache(1);
  lru4.put(1, 1);
  console.log("  get(1):", lru4.get(1), "(期望: 1)");
  lru4.put(2, 2);
  console.log("  get(1):", lru4.get(1), "(期望: -1)");
  console.log("  get(2):", lru4.get(2), "(期望: 2)\n");
}

test();

export {};
