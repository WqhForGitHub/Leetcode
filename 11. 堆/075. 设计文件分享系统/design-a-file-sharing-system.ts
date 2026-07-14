// ============================================================
// 075. 设计文件分享系统
// ============================================================
// LeetCode 1500. Design a File Sharing System
// 用户加入请求一组文件块，退出释放，返回拥有指定块的用户列表。
// 时间复杂度：join O(log N)，request O(U log U)

// 方法1：最小堆管理可用 ID + Map
class FileSharing {
  private chunks: Map<number, Set<number>> = new Map(); // chunk -> users
  private users: Map<number, Set<number>> = new Map(); // user -> chunks
  private available: number[] = []; // 最小堆
  private nextId = 1;
  private active: Set<number> = new Set();

  join(listedChunks: number[]): number {
    let id: number;
    if (this.available.length === 0) {
      id = this.nextId++;
    } else {
      id = this.available[0];
      this.available[0] = this.available[this.available.length - 1];
      this.available.pop();
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < this.available.length && this.available[l] < this.available[s]) s = l;
        if (r < this.available.length && this.available[r] < this.available[s]) s = r;
        if (s !== i) {
          [this.available[i], this.available[s]] = [this.available[s], this.available[i]];
          i = s;
        } else break;
      }
    }
    this.active.add(id);
    this.users.set(id, new Set(listedChunks));
    for (const c of listedChunks) {
      if (!this.chunks.has(c)) this.chunks.set(c, new Set());
      this.chunks.get(c)!.add(id);
    }
    return id;
  }
  leave(userId: number): void {
    if (!this.active.has(userId)) return;
    this.active.delete(userId);
    const chunks = this.users.get(userId);
    if (chunks) {
      for (const c of chunks) {
        this.chunks.get(c)?.delete(userId);
      }
    }
    this.users.delete(userId);
    this.available.push(userId);
    let i = this.available.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.available[i] < this.available[p]) {
        [this.available[i], this.available[p]] = [this.available[p], this.available[i]];
        i = p;
      } else break;
    }
  }
  request(userId: number, chunkId: number): number[] {
    const users = this.chunks.get(chunkId);
    if (users === undefined || users.size === 0) return [];
    const result = Array.from(users).sort((a, b) => a - b);
    if (!users.has(userId)) {
      users.add(userId);
      this.users.get(userId)?.add(chunkId);
    }
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 设计文件分享系统 =====");
const fs = new FileSharing();
console.log("join:", fs.join([1, 2])); // 期望 1
console.log("join:", fs.join([2, 3])); // 期望 2
console.log("join:", fs.join([4])); // 期望 3
console.log("request:", fs.request(1, 3)); // 期望 [2]
fs.leave(1);
console.log("join:", fs.join([5])); // 期望 1 (复用 ID)

export {};
