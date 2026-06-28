// ============================================================
// 078. 全 O(1) 的数据结构
// ============================================================
// LeetCode 432. All O'one Data Structure
// 设计数据结构，O(1) 完成 inc / dec / getMaxKey / getMinKey
// 思路：哈希表记录 key 当前计数 + 双向链表按计数分组（每个桶存同计数的 key 集合）
//       链表按计数升序排列，头尾为哨兵节点
// 时间复杂度：O(1) 每个操作，空间复杂度：O(n)

// 双向链表节点：某一计数对应的 key 集合
class Bucket {
  count: number;
  keys: Set<string>;
  prev: Bucket | null = null;
  next: Bucket | null = null;

  constructor(count: number) {
    this.count = count;
    this.keys = new Set();
  }
}

class AllOne {
  // key -> 当前计数
  private keyCount: Map<string, number>;
  // 计数 -> 对应桶节点
  private countBucket: Map<number, Bucket>;
  // 哨兵头尾节点（head.next 为最小计数桶，tail.prev 为最大计数桶）
  private head: Bucket;
  private tail: Bucket;

  constructor() {
    this.keyCount = new Map();
    this.countBucket = new Map();
    this.head = new Bucket(-Infinity);
    this.tail = new Bucket(Infinity);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 在 node 之后插入新桶
  private insertAfter(node: Bucket, newNode: Bucket): void {
    newNode.prev = node;
    newNode.next = node.next;
    node.next!.prev = newNode;
    node.next = newNode;
    this.countBucket.set(newNode.count, newNode);
  }

  // 移除空桶
  private removeBucket(node: Bucket): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    this.countBucket.delete(node.count);
  }

  inc(key: string): void {
    const cnt = this.keyCount.get(key) || 0;
    this.keyCount.set(key, cnt + 1);

    // 查找或新建 cnt+1 的桶
    const target = this.countBucket.get(cnt + 1);
    if (target) {
      target.keys.add(key);
    } else {
      // 新桶插入在当前桶（或 head）之后
      const cur = cnt === 0 ? this.head : this.countBucket.get(cnt)!;
      const bucket = new Bucket(cnt + 1);
      this.insertAfter(cur, bucket);
      bucket.keys.add(key);
    }

    // 从旧桶移除 key
    if (cnt > 0) {
      const old = this.countBucket.get(cnt)!;
      old.keys.delete(key);
      if (old.keys.size === 0) this.removeBucket(old);
    }
  }

  dec(key: string): void {
    const cnt = this.keyCount.get(key);
    if (cnt === undefined) return;

    if (cnt === 1) {
      // 计数降为 0，直接删除
      this.keyCount.delete(key);
    } else {
      this.keyCount.set(key, cnt - 1);
      // 查找或新建 cnt-1 的桶
      const target = this.countBucket.get(cnt - 1);
      if (target) {
        target.keys.add(key);
      } else {
        // 新桶插入在当前桶之前（即当前桶前驱之后）
        const cur = this.countBucket.get(cnt)!;
        const bucket = new Bucket(cnt - 1);
        this.insertAfter(cur.prev!, bucket);
        bucket.keys.add(key);
      }
    }

    // 从旧桶移除 key
    const old = this.countBucket.get(cnt)!;
    old.keys.delete(key);
    if (old.keys.size === 0) this.removeBucket(old);
  }

  getMaxKey(): string {
    if (this.tail.prev === this.head) return "";
    for (const key of this.tail.prev!.keys) return key;
    return "";
  }

  getMinKey(): string {
    if (this.head.next === this.tail) return "";
    for (const key of this.head.next!.keys) return key;
    return "";
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 全 O(1) 的数据结构 =====");
const allOne = new AllOne();
allOne.inc("hello");
allOne.inc("hello");
allOne.inc("world");
console.log(allOne.getMaxKey()); // 期望输出: "hello"
console.log(allOne.getMinKey()); // 期望输出: "world"
allOne.inc("world");
allOne.inc("world");
allOne.inc("leet");
console.log(allOne.getMaxKey()); // 期望输出: "world"
console.log(allOne.getMinKey()); // 期望输出: "leet"

export {};
