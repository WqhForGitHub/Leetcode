// ============================================================
// 048. 设计路由器
// ============================================================
// LeetCode 周赛题. 设计路由器
// 设计一个路由器，支持 enqueue（入队数据包）、dequeue（出队）、
// forward（转发数据包到目标地址，返回转发次数）、getCount（查询目标的数据包数量）。

// ------------------------------------------------------------
// 方法1：队列 + 哈希表
// ------------------------------------------------------------
// 用队列保存数据包，哈希集合去重，Map 统计目标地址计数。
// 时间 O(1) enqueue/dequeue/forward（均摊），空间 O(n)。
class Router1 {
  private queue: { source: number; destination: number; timestamp: number }[] = [];
  private seen: Set<string> = new Set();
  private capacity: number;
  private destMap: Map<number, { source: number; destination: number; timestamp: number }[]> =
    new Map();

  constructor(memoryLimit: number) {
    this.capacity = memoryLimit;
  }

  private key(p: { source: number; destination: number; timestamp: number }): string {
    return `${p.source},${p.destination},${p.timestamp}`;
  }

  enqueue(packet: number[]): boolean {
    const p = {
      source: packet[0],
      destination: packet[1],
      timestamp: packet[2],
    };
    const k = this.key(p);
    if (this.seen.has(k)) return false;
    if (this.queue.length >= this.capacity) {
      const old = this.queue.shift()!;
      this.seen.delete(this.key(old));
      const list = this.destMap.get(old.destination);
      if (list && list.length > 0) list.shift();
    }
    this.queue.push(p);
    this.seen.add(k);
    if (!this.destMap.has(p.destination)) {
      this.destMap.set(p.destination, []);
    }
    this.destMap.get(p.destination)!.push(p);
    return true;
  }

  dequeue(): number[] {
    if (this.queue.length === 0) return [];
    const p = this.queue.shift()!;
    this.seen.delete(this.key(p));
    const list = this.destMap.get(p.destination);
    if (list && list.length > 0) list.shift();
    return [p.source, p.destination, p.timestamp];
  }

  getCount(destination: number, timestamp: number): number {
    const list = this.destMap.get(destination);
    if (!list) return 0;
    // 二分查找 >= timestamp 的数量
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid].timestamp < timestamp) lo = mid + 1;
      else hi = mid;
    }
    return list.length - lo;
  }
}

// ------------------------------------------------------------
// 方法2：双端队列 + 有序 Map
// ------------------------------------------------------------
// 用有序 Map（按 timestamp 排序）维护每个 destination 的数据包，
// 支持高效范围查询。
// 时间 O(log n) getCount，O(1) enqueue/dequeue；空间 O(n)。
class Router2 {
  private queue: number[][] = [];
  private seen: Set<string> = new Set();
  private capacity: number;
  private destPackets: Map<number, number[]> = new Map(); // 存 timestamp

  constructor(memoryLimit: number) {
    this.capacity = memoryLimit;
  }

  enqueue(packet: number[]): boolean {
    const k = packet.join(",");
    if (this.seen.has(k)) return false;
    if (this.queue.length >= this.capacity) {
      const old = this.queue.shift()!;
      this.seen.delete(old.join(","));
      const list = this.destPackets.get(old[1]);
      if (list) list.shift();
    }
    this.queue.push(packet);
    this.seen.add(k);
    if (!this.destPackets.has(packet[1])) {
      this.destPackets.set(packet[1], []);
    }
    this.destPackets.get(packet[1])!.push(packet[2]);
    return true;
  }

  dequeue(): number[] {
    if (this.queue.length === 0) return [];
    const p = this.queue.shift()!;
    this.seen.delete(p.join(","));
    const list = this.destPackets.get(p[1]);
    if (list) list.shift();
    return p;
  }

  getCount(destination: number, timestamp: number): number {
    const list = this.destPackets.get(destination);
    if (!list) return 0;
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid] < timestamp) lo = mid + 1;
      else hi = mid;
    }
    return list.length - lo;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const r1 = new Router1(3);
  console.log("测试1 enqueue:", r1.enqueue([1, 2, 1]), "期望: true");
  console.log("测试2 enqueue:", r1.enqueue([2, 1, 1]), "期望: true");
  console.log("测试3 enqueue:", r1.enqueue([1, 2, 1]), "期望: false");
  console.log("测试4 enqueue:", r1.enqueue([3, 2, 1]), "期望: true");
  console.log("测试5 enqueue:", r1.enqueue([4, 5, 1]), "期望: true");
  console.log("测试6 dequeue:", JSON.stringify(r1.dequeue()), "期望: [2,1,1]");
  console.log("测试7 getCount:", r1.getCount(2, 1), "期望: 2");

  const r2 = new Router2(2);
  console.log("测试8 enqueue:", r2.enqueue([1, 1, 1]), "期望: true");
  console.log("测试9 enqueue:", r2.enqueue([2, 1, 2]), "期望: true");
  console.log("测试10 getCount:", r2.getCount(1, 1), "期望: 2");
}

test();

export {};
