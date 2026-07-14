// ============================================================
// 109. 序列顺序查询
// ============================================================
// LeetCode 2102. Sequentially Ordinal Rank Tracker
// 动态维护景点（按评分和名字排序），支持 add 和 get 第 k 名。
// 时间复杂度：add O(log N)，get O(1)

// 方法1：两个堆（大根堆 + 小根堆）
class SORTracker {
  // 小根堆存前 k 名（按评分降序、名字升序的反向）
  private top: Array<{ score: number; name: string }> = [];
  // 大根堆存其余
  private rest: Array<{ score: number; name: string }> = [];
  private k = 0;
  private cmpLess = (
    a: { score: number; name: string },
    b: { score: number; name: string },
  ): boolean => {
    // top 堆顶是第 k 名（评分最小、名字最大）
    if (a.score !== b.score) return a.score < b.score;
    return a.name > b.name;
  };
  private cmpGreater = (
    a: { score: number; name: string },
    b: { score: number; name: string },
  ): boolean => {
    if (a.score !== b.score) return a.score > b.score;
    return a.name < b.name;
  };
  private siftUpTop(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmpLess(this.top[i], this.top[p])) {
        [this.top[i], this.top[p]] = [this.top[p], this.top[i]];
        i = p;
      } else break;
    }
  }
  private siftDownTop(i: number): void {
    const n = this.top.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.cmpLess(this.top[l], this.top[s])) s = l;
      if (r < n && this.cmpLess(this.top[r], this.top[s])) s = r;
      if (s !== i) {
        [this.top[i], this.top[s]] = [this.top[s], this.top[i]];
        i = s;
      } else break;
    }
  }
  private siftUpRest(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmpGreater(this.rest[i], this.rest[p])) {
        [this.rest[i], this.rest[p]] = [this.rest[p], this.rest[i]];
        i = p;
      } else break;
    }
  }
  private siftDownRest(i: number): void {
    const n = this.rest.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.cmpGreater(this.rest[l], this.rest[s])) s = l;
      if (r < n && this.cmpGreater(this.rest[r], this.rest[s])) s = r;
      if (s !== i) {
        [this.rest[i], this.rest[s]] = [this.rest[s], this.rest[i]];
        i = s;
      } else break;
    }
  }
  add(name: string, score: number): void {
    // 先和 top 堆顶比较
    if (this.top.length === 0 || this.cmpGreater({ score, name }, this.top[0])) {
      this.top.push({ score, name });
      this.siftUpTop(this.top.length - 1);
    } else {
      this.rest.push({ score, name });
      this.siftUpRest(this.rest.length - 1);
    }
  }
  get(): string {
    // 调整 top 堆大小为 k+1
    while (this.top.length < this.k + 1 && this.rest.length > 0) {
      const item = this.rest[0];
      this.rest[0] = this.rest[this.rest.length - 1];
      this.rest.pop();
      this.siftDownRest(0);
      this.top.push(item);
      this.siftUpTop(this.top.length - 1);
    }
    while (this.top.length > this.k + 1) {
      const item = this.top[0];
      this.top[0] = this.top[this.top.length - 1];
      this.top.pop();
      this.siftDownTop(0);
      this.rest.push(item);
      this.siftUpRest(this.rest.length - 1);
    }
    this.k++;
    return this.top[0].name;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 序列顺序查询 =====");
const sor = new SORTracker();
sor.add("bradford", 2);
sor.add("branford", 3);
console.log("get:", sor.get()); // 期望 "branford"
sor.add("alps", 2);
console.log("get:", sor.get()); // 期望 "alps"
sor.add("orland", 2);
console.log("get:", sor.get()); // 期望 "bradford"

export {};
