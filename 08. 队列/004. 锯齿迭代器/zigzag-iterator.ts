// ============================================================
// 004. 锯齿迭代器
// ============================================================
// LeetCode 281. Zigzag Iterator
// 给定两个一维向量，实现一个迭代器以锯齿（之字形）方式返回它们的元素。

// ------------------------------------------------------------
// 方法1：队列轮流出队
// ------------------------------------------------------------
// 将多个向量存入队列，每次从队首向量取一个元素后放回队尾，空向量出队丢弃。
// 时间 O(1) next/hasNext（均摊），空间 O(v)（v 为向量数）。
class ZigzagIterator1 {
  private vectors: number[][] = [];
  private indices: number[] = [];
  private queue: number[] = [];

  constructor(v1: number[], v2: number[]) {
    this.vectors = [v1, v2];
    this.indices = [0, 0];
    if (v1.length > 0) this.queue.push(0);
    if (v2.length > 0) this.queue.push(1);
  }

  next(): number {
    const vecIdx = this.queue.shift()!;
    const elemIdx = this.indices[vecIdx];
    const val = this.vectors[vecIdx][elemIdx];
    this.indices[vecIdx]++;
    if (this.indices[vecIdx] < this.vectors[vecIdx].length) {
      this.queue.push(vecIdx);
    }
    return val;
  }

  hasNext(): boolean {
    return this.queue.length > 0;
  }
}

// ------------------------------------------------------------
// 方法2：直接双指针交替
// ------------------------------------------------------------
// 维护两个向量的当前下标，用标志位轮流取元素。
// 时间 O(1)，空间 O(1)。
class ZigzagIterator2 {
  private v1: number[];
  private v2: number[];
  private i1: number = 0;
  private i2: number = 0;
  private turn: boolean = true;

  constructor(v1: number[], v2: number[]) {
    this.v1 = v1;
    this.v2 = v2;
  }

  next(): number {
    if (this.i1 < this.v1.length && (this.turn || this.i2 >= this.v2.length)) {
      this.turn = false;
      return this.v1[this.i1++];
    } else {
      this.turn = true;
      return this.v2[this.i2++];
    }
  }

  hasNext(): boolean {
    return this.i1 < this.v1.length || this.i2 < this.v2.length;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const z1 = new ZigzagIterator1([1, 2], [3, 4, 5, 6]);
  const result1: number[] = [];
  while (z1.hasNext()) result1.push(z1.next());
  console.log("测试1:", JSON.stringify(result1), "期望: [1,3,2,4,5,6]");

  const z2 = new ZigzagIterator2([1, 1, 2], [1, 2, 3]);
  const result2: number[] = [];
  while (z2.hasNext()) result2.push(z2.next());
  console.log("测试2:", JSON.stringify(result2), "期望: [1,1,1,2,2,3]");
}

test();

export {};
