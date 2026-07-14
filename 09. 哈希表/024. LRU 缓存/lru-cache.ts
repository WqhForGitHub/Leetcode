// ============================================================
// 024. LRU 缓存
// ============================================================
// LeetCode 146. LRU Cache
// 设计支持 get 和 put 操作的 LRU 缓存，要求 get/put 均为 O(1)。
// 哈希表 + 双向链表实现。
// 时间复杂度：get/put 均 O(1)，空间复杂度：O(capacity)

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

class LRUCache {
  private capacity: number;
  private size: number;
  // 哈希表：key -> 链表节点
  private cache: Map<number, DLinkedNode>;
  // 双向链表虚拟头尾节点
  private head: DLinkedNode;
  private tail: DLinkedNode;

  constructor(capacity: number) {
    this.size = 0;
    this.capacity = capacity;
    this.cache = new Map<number, DLinkedNode>();
    // 使用虚拟头尾节点简化边界处理
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 获取键对应的值，不存在返回 -1
  get(key: number): number {
    const node = this.cache.get(key);
    if (node === undefined) {
      return -1;
    }
    // 命中后移动到头部，表示最近使用
    this.moveToHead(node);
    return node.value;
  }

  // 插入或更新键值对
  put(key: number, value: number): void {
    const node = this.cache.get(key);
    if (node === undefined) {
      // 新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.size++;
      // 超出容量，淘汰尾部节点（最久未使用）
      if (this.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
        this.size--;
      }
    } else {
      // 已存在，更新值并移到头部
      node.value = value;
      this.moveToHead(node);
    }
  }

  // 将节点添加到虚拟头节点之后
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

  // 将节点移动到头部
  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除尾部节点并返回
  private removeTail(): DLinkedNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. LRU 缓存 =====");
const lru = new LRUCache(2);
lru.put(1, 1); // 缓存 {1=1}
lru.put(2, 2); // 缓存 {1=1, 2=2}
console.log(lru.get(1)); // 1
lru.put(3, 3); // 淘汰 key 2，缓存 {1=1, 3=3}
console.log(lru.get(2)); // -1 (未找到)
lru.put(4, 4); // 淘汰 key 1，缓存 {3=3, 4=4}
console.log(lru.get(1)); // -1 (未找到)
console.log(lru.get(3)); // 3
console.log(lru.get(4)); // 4

export {};
