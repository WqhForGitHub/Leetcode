// ============================================================
// 092. LRU 缓存
// ============================================================
// LeetCode 146. LRU Cache
// 设计并实现最近最少使用（LRU）缓存机制。
// 实现 LRUCache 类：
//   - LRUCache(capacity): 初始化容量
//   - get(key): 若关键字存在返回其值，否则返回 -1。访问会使该关键字变为最近使用。
//   - put(key, value): 写入。若已存在则更新值。超出容量时淘汰最久未使用的关键字。
// get 和 put 都要在 O(1) 平均时间复杂度内完成。
// 时间复杂度：O(1)（均摊），空间复杂度：O(capacity)

// ------------------------------------------------------------
// 方法1：Map 实现（利用 Map 的插入顺序天然维护 LRU 顺序）
// ------------------------------------------------------------
// JavaScript/TypeScript 的 Map 会按插入顺序遍历元素。
// 访问某 key 时，先 delete 再 set，使其变为最新插入（最近使用）。
// 淘汰时删除 Map 的第一个元素（最久未使用）。
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<number, number>();
  }

  // 访问关键字 key，若存在返回其值并标记为最近使用
  get(key: number): number {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // 删除后重新插入，使其成为 Map 中最新的元素
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  // 写入关键字
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      // 已存在则先删除（稍后重新插入更新位置）
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 容量已满，淘汰最久未使用的元素（Map 的第一个元素）
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    // 插入/更新，标记为最近使用
    this.cache.set(key, value);
  }
}

// ------------------------------------------------------------
// 方法2：哈希表 + 双向链表实现（经典手写实现）
// ------------------------------------------------------------
// 双向链表节点
class DLinkedNode {
  key: number;
  value: number;
  prev: DLinkedNode | null;
  next: DLinkedNode | null;
  constructor(key: number = 0, value: number = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCacheDoubly {
  private capacity: number;
  private size: number;
  private cache: Map<number, DLinkedNode>;
  private head: DLinkedNode; // 哨兵头节点（最近使用端）
  private tail: DLinkedNode; // 哨兵尾节点（最久未使用端）

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map<number, DLinkedNode>();
    // 使用哨兵节点简化边界处理
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 将节点添加到链表头部（head 之后），表示最近使用
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

  // 将节点移动到头部（表示最近被访问）
  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 弹出尾部节点（最久未使用），返回该节点
  private popTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  get(key: number): number {
    const node = this.cache.get(key);
    if (node === undefined) {
      return -1;
    }
    // 命中后移动到头部
    this.moveToHead(node);
    return node.value;
  }

  put(key: number, value: number): void {
    const node = this.cache.get(key);
    if (node !== undefined) {
      // 已存在，更新值并移动到头部
      node.value = value;
      this.moveToHead(node);
    } else {
      // 不存在，创建新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.size++;

      // 超出容量，淘汰尾部节点
      if (this.size > this.capacity) {
        const tailNode = this.popTail();
        this.cache.delete(tailNode.key);
        this.size--;
      }
    }
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("===== 测试方法1：Map 实现 =====");
  const lru1 = new LRUCache(2);
  lru1.put(1, 1); // 缓存 {1=1}
  lru1.put(2, 2); // 缓存 {1=1, 2=2}
  console.log("get(1):", lru1.get(1), "(期望 1)"); // 返回 1，缓存变为 {2=2, 1=1}
  lru1.put(3, 3); // 淘汰 key 2，缓存 {1=1, 3=3}
  console.log("get(2):", lru1.get(2), "(期望 -1)"); // 返回 -1
  lru1.put(4, 4); // 淘汰 key 1，缓存 {3=3, 4=4}
  console.log("get(1):", lru1.get(1), "(期望 -1)"); // 返回 -1
  console.log("get(3):", lru1.get(3), "(期望 3)"); // 返回 3
  console.log("get(4):", lru1.get(4), "(期望 4)"); // 返回 4

  console.log("\n===== 测试方法2：双向链表实现 =====");
  const lru2 = new LRUCacheDoubly(2);
  lru2.put(1, 1);
  lru2.put(2, 2);
  console.log("get(1):", lru2.get(1), "(期望 1)");
  lru2.put(3, 3);
  console.log("get(2):", lru2.get(2), "(期望 -1)");
  lru2.put(4, 4);
  console.log("get(1):", lru2.get(1), "(期望 -1)");
  console.log("get(3):", lru2.get(3), "(期望 3)");
  console.log("get(4):", lru2.get(4), "(期望 4)");

  console.log("\n===== 测试更新已存在的 key =====");
  const lru3 = new LRUCache(2);
  lru3.put(1, 1);
  lru3.put(2, 2);
  lru3.put(1, 10); // 更新 key 1
  lru3.put(3, 3); // 容量2，应淘汰 key 2
  console.log("get(1):", lru3.get(1), "(期望 10)");
  console.log("get(2):", lru3.get(2), "(期望 -1)");
}

test();

export {};
