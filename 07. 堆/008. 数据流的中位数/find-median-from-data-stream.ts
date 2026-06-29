// ============================================================
// 008. 数据流的中位数
// ============================================================
// LeetCode 295. Find Median from Data Stream
// 中位数是有序整数列表中间的数。设计支持 addNum 和 findMedian 的数据结构。
// 时间复杂度：addNum O(log n)，findMedian O(1)

class MedianFinder {
  // 大根堆存较小一半
  private lo: number[] = [];
  // 小根堆存较大一半
  private hi: number[] = [];
  addNum(num: number): void {
    const loPush = (v: number): void => {
      this.lo.push(v);
      let i = this.lo.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.lo[i] > this.lo[p]) {
          [this.lo[i], this.lo[p]] = [this.lo[p], this.lo[i]];
          i = p;
        } else break;
      }
    };
    const loPop = (): number | undefined => {
      if (this.lo.length === 0) return undefined;
      const top = this.lo[0];
      const last = this.lo.pop()!;
      if (this.lo.length > 0) {
        this.lo[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < this.lo.length && this.lo[l] > this.lo[s]) s = l;
          if (r < this.lo.length && this.lo[r] > this.lo[s]) s = r;
          if (s !== i) {
            [this.lo[i], this.lo[s]] = [this.lo[s], this.lo[i]];
            i = s;
          } else break;
        }
      }
      return top;
    };
    const hiPush = (v: number): void => {
      this.hi.push(v);
      let i = this.hi.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.hi[i] < this.hi[p]) {
          [this.hi[i], this.hi[p]] = [this.hi[p], this.hi[i]];
          i = p;
        } else break;
      }
    };
    const hiPop = (): number | undefined => {
      if (this.hi.length === 0) return undefined;
      const top = this.hi[0];
      const last = this.hi.pop()!;
      if (this.hi.length > 0) {
        this.hi[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < this.hi.length && this.hi[l] < this.hi[s]) s = l;
          if (r < this.hi.length && this.hi[r] < this.hi[s]) s = r;
          if (s !== i) {
            [this.hi[i], this.hi[s]] = [this.hi[s], this.hi[i]];
            i = s;
          } else break;
        }
      }
      return top;
    };
    loPush(num);
    hiPush(loPop()!);
    if (this.lo.length < this.hi.length) loPush(hiPop()!);
  }
  findMedian(): number {
    if (this.lo.length > this.hi.length) return this.lo[0];
    return (this.lo[0] + this.hi[0]) / 2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 数据流的中位数 =====");
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log("中位数:", mf.findMedian()); // 期望 1.5
mf.addNum(3);
console.log("中位数:", mf.findMedian()); // 期望 2

export {};
