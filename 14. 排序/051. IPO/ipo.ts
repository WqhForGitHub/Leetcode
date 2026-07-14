// ============================================================
// 051. IPO
// ============================================================
// LeetCode 502. IPO
// 有 n 个项目，各有资本需求 capital[i] 和纯利润 profit[i]，
// 初始资金 w，最多选 k 个项目，选项目后资金增加 profit，求最终最大资金。

// 方法1：按资本排序 + 最大堆选利润（推荐，O(n log n) 时间）
// 将项目按资本需求升序排序。用最大堆存放当前可承担项目的利润。
// 每轮把所有资本需求 <= 当前资金的项目入堆，再取出最大利润项目。
class MaxHeap {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  push(val: number): void {
    this.data.push(val);
    this.siftUp(this.data.length - 1);
  }

  pop(): number {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] >= this.data[i]) break;
      const tmp = this.data[parent];
      this.data[parent] = this.data[i];
      this.data[i] = tmp;
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.data[left] > this.data[largest]) largest = left;
      if (right < n && this.data[right] > this.data[largest]) largest = right;
      if (largest === i) break;
      const tmp = this.data[largest];
      this.data[largest] = this.data[i];
      this.data[i] = tmp;
      i = largest;
    }
  }
}

interface Project {
  cap: number;
  prof: number;
}

function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
  const n = profits.length;
  const projects: Project[] = capital.map((c, i) => ({ cap: c, prof: profits[i] }));
  // 按资本需求升序排序
  projects.sort((a, b) => a.cap - b.cap);

  const heap = new MaxHeap();
  let current = w;
  let idx = 0;

  for (let round = 0; round < k; round++) {
    // 把所有当前能承担的项目利润入堆
    while (idx < n && projects[idx].cap <= current) {
      heap.push(projects[idx].prof);
      idx++;
    }
    if (heap.size() === 0) break; // 没有可承担的项目
    current += heap.pop();
  }
  return current;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. IPO =====");
console.log(
  "k=2,w=0,profits=[1,2,3],capital=[0,1,1]:",
  findMaximizedCapital(2, 0, [1, 2, 3], [0, 1, 1]),
); // 期望 4
console.log(
  "k=3,w=0,profits=[1,2,3],capital=[0,1,2]:",
  findMaximizedCapital(3, 0, [1, 2, 3], [0, 1, 2]),
); // 期望 6
console.log(
  "k=1,w=2,profits=[1,2,3],capital=[1,10,3]:",
  findMaximizedCapital(1, 2, [1, 2, 3], [1, 10, 3]),
); // 期望 3 (仅能承担 cap=1 的项目)

export {};
