// ============================================================
// 052. 相对名次
// ============================================================
// LeetCode 506. Relative Ranks
// 给定运动员分数，按分数从高到低排名。前三名分别授予
// "Gold Medal"、"Silver Medal"、"Bronze Medal"，其余用排名数字字符串。

// 方法1：排序 + 下标映射（推荐，O(n log n) 时间）
// 将 (分数, 原下标) 按分数降序排序，再按排名回填到结果数组。
function findRelativeRanks(score: number[]): string[] {
  const n = score.length;
  const indexed: { s: number; i: number }[] = score.map((s, i) => ({ s, i }));
  indexed.sort((a, b) => b.s - a.s);

  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const result: string[] = new Array(n).fill("");
  for (let rank = 0; rank < n; rank++) {
    const originalIndex = indexed[rank].i;
    if (rank < 3) {
      result[originalIndex] = medals[rank];
    } else {
      result[originalIndex] = String(rank + 1);
    }
  }
  return result;
}

// 方法2：最大堆（O(n log n) 时间）
// 把 (分数, 下标) 放入最大堆，逐个弹出并分配名次。
interface ScoreEntry {
  s: number;
  i: number;
}

class ScoreMaxHeap {
  private data: ScoreEntry[] = [];

  size(): number {
    return this.data.length;
  }

  push(entry: ScoreEntry): void {
    this.data.push(entry);
    this.siftUp(this.data.length - 1);
  }

  pop(): ScoreEntry {
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
      if (this.data[parent].s >= this.data[i].s) break;
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
      if (left < n && this.data[left].s > this.data[largest].s) largest = left;
      if (right < n && this.data[right].s > this.data[largest].s) largest = right;
      if (largest === i) break;
      const tmp = this.data[largest];
      this.data[largest] = this.data[i];
      this.data[i] = tmp;
      i = largest;
    }
  }
}

function findRelativeRanksHeap(score: number[]): string[] {
  const n = score.length;
  const heap = new ScoreMaxHeap();
  for (let i = 0; i < n; i++) {
    heap.push({ s: score[i], i });
  }

  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const result: string[] = new Array(n).fill("");
  let rank = 0;
  while (heap.size() > 0) {
    const { i } = heap.pop();
    if (rank < 3) {
      result[i] = medals[rank];
    } else {
      result[i] = String(rank + 1);
    }
    rank++;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 相对名次 =====");
console.log("排序 [5,4,3,2,1]:", findRelativeRanks([5, 4, 3, 2, 1]));
// 期望 ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
console.log("排序 [10,3,8,9,4]:", findRelativeRanks([10, 3, 8, 9, 4]));
// 期望 ["Gold Medal","5","Bronze Medal","Silver Medal","4"]
console.log("堆 [5,4,3,2,1]:", findRelativeRanksHeap([5, 4, 3, 2, 1]));
// 期望 ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
console.log("堆 [10,3,8,9,4]:", findRelativeRanksHeap([10, 3, 8, 9, 4]));
// 期望 ["Gold Medal","5","Bronze Medal","Silver Medal","4"]

export {};
