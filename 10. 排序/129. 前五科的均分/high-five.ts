// ============================================================
// 129. 前五科的均分
// ============================================================
// LeetCode 1085. High Five
// 给定学生成绩 [id, score] 列表，对每个学生取其前 5 高成绩的平均值，
// 按 id 升序返回 [id, 平均分（向下取整）]。

// 小顶堆（仅含必要方法），用于维护每个学生前 5 高分
class MinHeapNum {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): number | undefined {
    return this.data[0];
  }

  push(item: number): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  pop(): number | undefined {
    if (this.data.length === 0) return undefined;
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
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// 方法1：按 id 升序、分数降序排序，每个学生取前 5（推荐，O(n log n)）
function highFive(items: number[][]): number[][] {
  // 先按 id 升序，相同 id 按分数降序
  items.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

  const result: number[][] = [];
  let i = 0;
  const n = items.length;
  while (i < n) {
    const id = items[i][0];
    let sum = 0;
    // 取该学生前 5 个（已按分数降序）
    for (let k = 0; k < 5; k++) {
      sum += items[i + k][1];
    }
    result.push([id, Math.floor(sum / 5)]);
    // 跳过该学生剩余记录
    i += 5;
    while (i < n && items[i][0] === id) i++;
  }
  return result;
}

// 方法2：每个学生维护大小为 5 的小顶堆（O(n log 5)）
function highFive2(items: number[][]): number[][] {
  const heaps = new Map<number, MinHeapNum>();
  for (const [id, score] of items) {
    let h = heaps.get(id);
    if (!h) {
      h = new MinHeapNum();
      heaps.set(id, h);
    }
    h.push(score);
    if (h.size() > 5) h.pop();
  }

  const ids = Array.from(heaps.keys()).sort((a, b) => a - b);
  const result: number[][] = [];
  for (const id of ids) {
    const h = heaps.get(id)!;
    let sum = 0;
    while (h.size() > 0) {
      sum += h.pop()!;
    }
    result.push([id, Math.floor(sum / 5)]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 前五科的均分 =====");
console.log(
  "方法1:",
  highFive([
    [1, 91],
    [1, 92],
    [2, 93],
    [2, 97],
    [1, 60],
    [2, 77],
    [1, 65],
    [1, 87],
    [1, 100],
    [2, 100],
    [2, 76],
  ]),
); // 期望: [[1,87],[2,88]]
console.log(
  "方法2:",
  highFive2([
    [1, 91],
    [1, 92],
    [2, 93],
    [2, 97],
    [1, 60],
    [2, 77],
    [1, 65],
    [1, 87],
    [1, 100],
    [2, 100],
    [2, 76],
  ]),
); // 期望: [[1,87],[2,88]]

export {};
