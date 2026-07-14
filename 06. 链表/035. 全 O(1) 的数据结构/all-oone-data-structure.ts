// ============================================================
// 035. 全 O(1) 的数据结构
// ============================================================
// LeetCode 432. All O`one Data Structure
// 设计一个数据结构，支持以下操作且均为 O(1)：
//   inc(key)：将 key 的计数加1（不存在则插入，计数为1）
//   dec(key)：将 key 的计数减1（计数为0则删除）
//   getMaxKey：返回计数最大的任意一个 key
//   getMinKey：返回计数最小的任意一个 key
// 实现：哈希表 + 双向链表（按频率排序）
// 时间复杂度：inc/dec/getMaxKey/getMinKey 均为 O(1)，空间复杂度 O(n)

// 链表节点：每个节点代表一个频率，维护该频率下所有 key 的集合
class Bucket {
  count: number; // 该桶对应的频率
  keys: Set<string>; // 该频率下的所有 key
  prev: Bucket | null;
  next: Bucket | null;
  constructor(count: number) {
    this.count = count;
    this.keys = new Set<string>();
    this.prev = null;
    this.next = null;
  }
}

class AllOne {
  private head: Bucket; // 哨兵头节点（频率最小端）
  private tail: Bucket; // 哨兵尾节点（频率最大端）
  private map: Map<string, Bucket>; // key -> 所在的桶

  constructor() {
    this.head = new Bucket(0);
    this.tail = new Bucket(0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.map = new Map<string, Bucket>();
  }

  // 在 target 之后插入 newBucket
  private insertAfter(target: Bucket, newBucket: Bucket): void {
    newBucket.prev = target;
    newBucket.next = target.next;
    target.next!.prev = newBucket;
    target.next = newBucket;
  }

  // 在 target 之前插入 newBucket
  private insertBefore(target: Bucket, newBucket: Bucket): void {
    newBucket.next = target;
    newBucket.prev = target.prev;
    target.prev!.next = newBucket;
    target.prev = newBucket;
  }

  // 从链表中移除 bucket
  private removeBucket(bucket: Bucket): void {
    bucket.prev!.next = bucket.next;
    bucket.next!.prev = bucket.prev;
    bucket.prev = null;
    bucket.next = null;
  }

  // 将 key 的计数加1
  inc(key: string): void {
    if (!this.map.has(key)) {
      // key 不存在，插入计数为 1 的桶
      const first = this.head.next!;
      if (first !== this.tail && first.count === 1) {
        // 已有频率为1的桶，直接加入
        first.keys.add(key);
        this.map.set(key, first);
      } else {
        // 创建新桶，插入到 head 之后
        const newBucket = new Bucket(1);
        newBucket.keys.add(key);
        this.insertAfter(this.head, newBucket);
        this.map.set(key, newBucket);
      }
    } else {
      // key 已存在，从当前桶移到更高频率桶
      const bucket = this.map.get(key)!;
      const count = bucket.count;
      bucket.keys.delete(key);

      const next = bucket.next!;
      if (next !== this.tail && next.count === count + 1) {
        // 已有频率为 count+1 的桶，直接加入
        next.keys.add(key);
        this.map.set(key, next);
      } else {
        // 创建新桶，插入到当前桶之后
        const newBucket = new Bucket(count + 1);
        newBucket.keys.add(key);
        this.insertAfter(bucket, newBucket);
        this.map.set(key, newBucket);
      }

      // 当前桶为空则移除
      if (bucket.keys.size === 0) {
        this.removeBucket(bucket);
      }
    }
  }

  // 将 key 的计数减1
  dec(key: string): void {
    if (!this.map.has(key)) return;
    const bucket = this.map.get(key)!;
    const count = bucket.count;
    bucket.keys.delete(key);

    if (count === 1) {
      // 频率降为0，直接删除 key
      this.map.delete(key);
    } else {
      const prev = bucket.prev!;
      if (prev !== this.head && prev.count === count - 1) {
        // 已有频率为 count-1 的桶，直接加入
        prev.keys.add(key);
        this.map.set(key, prev);
      } else {
        // 创建新桶，插入到当前桶之前
        const newBucket = new Bucket(count - 1);
        newBucket.keys.add(key);
        this.insertBefore(bucket, newBucket);
        this.map.set(key, newBucket);
      }
    }

    // 当前桶为空则移除
    if (bucket.keys.size === 0) {
      this.removeBucket(bucket);
    }
  }

  // 返回计数最大的任意一个 key
  getMaxKey(): string {
    if (this.tail.prev === this.head) return "";
    const bucket = this.tail.prev!;
    for (const key of bucket.keys) return key;
    return "";
  }

  // 返回计数最小的任意一个 key
  getMinKey(): string {
    if (this.head.next === this.tail) return "";
    const bucket = this.head.next!;
    for (const key of bucket.keys) return key;
    return "";
  }
}

// 测试
console.log("===== 035. 全 O(1) 的数据结构 =====");
{
  const allOne = new AllOne();
  allOne.inc("hello");
  allOne.inc("hello");
  console.log("Max（hello*2）：", allOne.getMaxKey()); // "hello"
  console.log("Min（hello*2）：", allOne.getMinKey()); // "hello"
  allOne.inc("leet");
  console.log("Max（hello*2, leet*1）：", allOne.getMaxKey()); // "hello"
  console.log("Min（hello*2, leet*1）：", allOne.getMinKey()); // "leet"
}
{
  const allOne = new AllOne();
  allOne.inc("a");
  allOne.inc("b");
  allOne.inc("b");
  allOne.inc("c");
  allOne.inc("c");
  allOne.inc("c");
  allOne.dec("b");
  allOne.dec("b");
  console.log("dec b 两次后 Max：", allOne.getMaxKey()); // "c" (c=3)
  console.log("dec b 两次后 Min：", allOne.getMinKey()); // "a" (a=1, b已删除)
  allOne.dec("a");
  console.log("dec a 后 Min：", allOne.getMinKey()); // "c" (a已删除, 只剩c)
}
{
  const allOne = new AllOne();
  allOne.inc("a");
  allOne.inc("a");
  allOne.inc("a");
  allOne.dec("a");
  allOne.dec("a");
  console.log("a=1 时的 Max/Min：", allOne.getMaxKey(), allOne.getMinKey()); // "a" "a"
}

export {};
