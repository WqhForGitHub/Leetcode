// ============================================================
// 188. 设计文件分享系统
// ============================================================
// LeetCode 1500. Design a File Sharing System
// 文件被分成 1..m 个 chunk。
// - join(ownedChunks): 新用户加入并持有这些 chunk，返回分配的最小可用 userID。
// - leave(userID): 用户离开，释放其 chunk 与 userID（可被复用）。
// - request(userID, chunkID): 返回当前持有该 chunk 的 userID 升序列表；
//   若当前无人持有，则该用户获得此 chunk 并返回 [userID]。

// 方法1：Map + 最小可用 ID 回收（堆/有序集合）（各操作近似 O(log n)）
class FileSharing {
  private m: number;
  private chunkToUsers: Map<number, Set<number>>;
  private userToChunks: Map<number, Set<number>>;
  private available: number[]; // 最小堆，存放可复用的 userID

  constructor(m: number) {
    this.m = m;
    this.chunkToUsers = new Map();
    this.userToChunks = new Map();
    this.available = [];
    this.pushAvailable(1); // 起始可用 ID 从 1 开始
  }

  private pushAvailable(id: number): void {
    this.available.push(id);
    let i = this.available.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.available[parent] <= this.available[i]) break;
      [this.available[parent], this.available[i]] = [this.available[i], this.available[parent]];
      i = parent;
    }
  }

  private popAvailable(): number {
    const top = this.available[0];
    const last = this.available.pop()!;
    if (this.available.length > 0) {
      this.available[0] = last;
      let i = 0;
      const n = this.available.length;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && this.available[l] < this.available[smallest]) smallest = l;
        if (r < n && this.available[r] < this.available[smallest]) smallest = r;
        if (smallest === i) break;
        [this.available[smallest], this.available[i]] = [
          this.available[i],
          this.available[smallest],
        ];
        i = smallest;
      }
    }
    return top;
  }

  private nextId(): number {
    if (this.available.length > 0) {
      return this.popAvailable();
    }
    // 没有可回收 ID，则取当前最大已用 ID + 1
    let max = 0;
    for (const id of this.userToChunks.keys()) {
      if (id > max) max = id;
    }
    return max + 1;
  }

  join(ownedChunks: number[]): number {
    const id = this.nextId();
    const set = new Set<number>(ownedChunks);
    this.userToChunks.set(id, set);
    for (const c of ownedChunks) {
      if (!this.chunkToUsers.has(c)) {
        this.chunkToUsers.set(c, new Set());
      }
      this.chunkToUsers.get(c)!.add(id);
    }
    return id;
  }

  leave(userID: number): void {
    const chunks = this.userToChunks.get(userID);
    if (!chunks) return;
    for (const c of chunks) {
      const users = this.chunkToUsers.get(c);
      if (users) {
        users.delete(userID);
        if (users.size === 0) {
          this.chunkToUsers.delete(c);
        }
      }
    }
    this.userToChunks.delete(userID);
    this.pushAvailable(userID);
  }

  request(userID: number, chunkID: number): number[] {
    if (chunkID < 1 || chunkID > this.m) return [];
    const users = this.chunkToUsers.get(chunkID);
    if (!users || users.size === 0) {
      // 无人持有，该用户获得此 chunk
      if (!this.chunkToUsers.has(chunkID)) {
        this.chunkToUsers.set(chunkID, new Set());
      }
      this.chunkToUsers.get(chunkID)!.add(userID);
      if (!this.userToChunks.has(userID)) {
        this.userToChunks.set(userID, new Set());
      }
      this.userToChunks.get(userID)!.add(chunkID);
      return [userID];
    }
    return [...users].sort((a, b) => a - b);
  }
}

// 方法2：基于有序 Map（TreeMap 思路，TS 用排序数组维护）（各操作 O(log n)）
class FileSharing2 {
  private m: number;
  private chunkToUsers: Map<number, Set<number>>;
  private userToChunks: Map<number, Set<number>>;
  private freeIds: number[]; // 保持升序，复用最小

  constructor(m: number) {
    this.m = m;
    this.chunkToUsers = new Map();
    this.userToChunks = new Map();
    this.freeIds = [1];
  }

  private nextId(): number {
    if (this.freeIds.length > 0) {
      return this.freeIds.shift()!;
    }
    let max = 0;
    for (const id of this.userToChunks.keys()) {
      if (id > max) max = id;
    }
    return max + 1;
  }

  private ensureFreeSorted(): void {
    this.freeIds.sort((a, b) => a - b);
  }

  join(ownedChunks: number[]): number {
    const id = this.nextId();
    this.userToChunks.set(id, new Set(ownedChunks));
    for (const c of ownedChunks) {
      if (!this.chunkToUsers.has(c)) {
        this.chunkToUsers.set(c, new Set());
      }
      this.chunkToUsers.get(c)!.add(id);
    }
    return id;
  }

  leave(userID: number): void {
    const chunks = this.userToChunks.get(userID);
    if (!chunks) return;
    for (const c of chunks) {
      const users = this.chunkToUsers.get(c);
      if (users) {
        users.delete(userID);
        if (users.size === 0) this.chunkToUsers.delete(c);
      }
    }
    this.userToChunks.delete(userID);
    this.freeIds.push(userID);
    this.ensureFreeSorted();
  }

  request(userID: number, chunkID: number): number[] {
    if (chunkID < 1 || chunkID > this.m) return [];
    const users = this.chunkToUsers.get(chunkID);
    if (!users || users.size === 0) {
      if (!this.chunkToUsers.has(chunkID)) {
        this.chunkToUsers.set(chunkID, new Set());
      }
      this.chunkToUsers.get(chunkID)!.add(userID);
      if (!this.userToChunks.has(userID)) {
        this.userToChunks.set(userID, new Set());
      }
      this.userToChunks.get(userID)!.add(chunkID);
      return [userID];
    }
    return [...users].sort((a, b) => a - b);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 188. 设计文件分享系统 =====");
const fs1 = new FileSharing(4);
console.log("join([1,2]):", fs1.join([1, 2])); // 1
console.log("join([2,3]):", fs1.join([2, 3])); // 2
console.log("join([4]):", fs1.join([4])); // 3
console.log("request(1,3):", fs1.request(1, 3)); // [2]
fs1.leave(1);
console.log("request(2,1):", fs1.request(2, 1)); // [2]
fs1.leave(2);
console.log("join([5]):", fs1.join([5])); // 1 (复用)

const fs2 = new FileSharing2(4);
console.log("方法2 join([1,2]):", fs2.join([1, 2])); // 1
console.log("方法2 join([2,3]):", fs2.join([2, 3])); // 2
console.log("方法2 request(1,3):", fs2.request(1, 3)); // [2]
fs2.leave(1);
console.log("方法2 request(2,1):", fs2.request(2, 1)); // [2]

export {};
