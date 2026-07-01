// ============================================================
// 095. 雇佣 K 名工人的最低成本
// ============================================================
// LeetCode 857. Minimum Cost to Hire K Workers
// n 名工人，各有 quality[i] 与最低期望工资 wage[i]。需恰好雇佣 k 人。
// 工资按 quality 比例发放，且每人所得不得低于其 wage。
// 求满足条件的最小总工资。

// 核心性质：选中一组工人后，单位 quality 的工资 r 必须满足
//   r >= max_{选中} (wage[i] / quality[i])
// 取等最优（r = 最大比率者的比率），总成本 = r * sum(quality)。
// 故按比率升序排序，以每个工人作“比率上限”时，从前缀中选 quality 最小的 k 个。

// 方法1：按比率排序 + quality 最大堆（推荐，O(n log n) 时间，O(n) 空间）
// 维护大小为 k 的 quality 最大堆与堆内 quality 之和；
// 遍历排序后的工人，当堆大小达到 k 时用 当前比率 * sumQuality 更新答案。
class MaxHeap857 {
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

interface Worker857 {
  ratio: number;
  quality: number;
}

function mincostToHireWorkers(quality: number[], wage: number[], k: number): number {
  const n = quality.length;
  const workers: Worker857[] = quality.map((q, i) => ({ ratio: wage[i] / q, quality: q }));
  workers.sort((a, b) => a.ratio - b.ratio);

  const heap = new MaxHeap857();
  let sumQuality = 0;
  let best = Infinity;

  for (let i = 0; i < n; i++) {
    const w = workers[i];
    heap.push(w.quality);
    sumQuality += w.quality;
    if (heap.size() > k) {
      sumQuality -= heap.pop();
    }
    if (heap.size() === k) {
      const cost = w.ratio * sumQuality;
      if (cost < best) best = cost;
    }
  }
  return best;
}

// 方法2：枚举所有 k 人组合（暴力验证，O(C(n,k) * k) 时间，O(k) 空间）
// 仅适用于小规模输入验证正确性。对每组组合，比率上限为组内最大比率，
// 总成本 = maxRatio * sumQuality，取最小。
function mincostToHireWorkersBrute(quality: number[], wage: number[], k: number): number {
  const n = quality.length;
  const ratios = quality.map((q, i) => wage[i] / q);
  let best = Infinity;

  const combine = (start: number, chosen: number[]): void => {
    if (chosen.length === k) {
      let maxRatio = 0;
      let sumQ = 0;
      for (const idx of chosen) {
        if (ratios[idx] > maxRatio) maxRatio = ratios[idx];
        sumQ += quality[idx];
      }
      const cost = maxRatio * sumQ;
      if (cost < best) best = cost;
      return;
    }
    for (let i = start; i < n; i++) {
      chosen.push(i);
      combine(i + 1, chosen);
      chosen.pop();
    }
  };

  combine(0, []);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 雇佣 K 名工人的最低成本 =====");
console.log("堆 [10,20,5]/[70,50,30],k=2:",
  mincostToHireWorkers([10, 20, 5], [70, 50, 30], 2)); // 期望 105
console.log("堆 [3,1,10,10,1]/[4,8,2,2,7],k=3:",
  mincostToHireWorkers([3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3)); // 期望 30.66667
console.log("暴力 [10,20,5]/[70,50,30],k=2:",
  mincostToHireWorkersBrute([10, 20, 5], [70, 50, 30], 2)); // 期望 105
console.log("暴力 [3,1,10,10,1]/[4,8,2,2,7],k=3:",
  mincostToHireWorkersBrute([3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3)); // 期望 30.66667

export {};
