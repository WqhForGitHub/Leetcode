// ============================================================
// 157. 将矩阵按对角线排序
// ============================================================
// LeetCode 1329. Sort the Matrix Diagonally
// 将矩阵每条从左上到右下的对角线升序排序。

// 方法1：按对角线分组排序（O(m*n*log(min(m,n)))）
// 同一对角线上的元素 i - j 相同，用 Map 分组收集、排序后写回。
function diagonalSort(mat: number[][]): number[][] {
  const m = mat.length;
  const n = mat[0].length;
  const diagonals = new Map<number, number[]>();
  // 收集每条对角线
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j;
      const arr = diagonals.get(key);
      if (arr === undefined) {
        diagonals.set(key, [mat[i][j]]);
      } else {
        arr.push(mat[i][j]);
      }
    }
  }
  // 每条对角线升序排序
  for (const arr of diagonals.values()) {
    arr.sort((a, b) => a - b);
  }
  // 按原顺序写回
  const result: number[][] = mat.map((row) => [...row]);
  const indices = new Map<number, number>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j;
      const idx = indices.get(key) ?? 0;
      result[i][j] = diagonals.get(key)![idx];
      indices.set(key, idx + 1);
    }
  }
  return result;
}

// 方法2：每条对角线用最小堆（O(m*n*log(min(m,n)))）
// 对每条对角线建立最小堆，依次弹出填回。
function diagonalSort2(mat: number[][]): number[][] {
  const m = mat.length;
  const n = mat[0].length;
  const result: number[][] = mat.map((row) => [...row]);

  // 简单最小堆实现
  class MinHeap {
    private data: number[] = [];
    size(): number {
      return this.data.length;
    }
    push(v: number): void {
      this.data.push(v);
      let i = this.data.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.data[p] <= this.data[i]) break;
        [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
        i = p;
      }
    }
    pop(): number {
      const top = this.data[0];
      const last = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        let i = 0;
        const len = this.data.length;
        while (true) {
          let smallest = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < len && this.data[l] < this.data[smallest]) smallest = l;
          if (r < len && this.data[r] < this.data[smallest]) smallest = r;
          if (smallest === i) break;
          [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
          i = smallest;
        }
      }
      return top;
    }
  }

  // 对角线编号 d = i - j，范围 [-(n-1), m-1]
  for (let d = -(n - 1); d <= m - 1; d++) {
    const heap = new MinHeap();
    for (let i = 0; i < m; i++) {
      const j = i - d;
      if (j >= 0 && j < n) heap.push(mat[i][j]);
    }
    for (let i = 0; i < m; i++) {
      const j = i - d;
      if (j >= 0 && j < n) result[i][j] = heap.pop();
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 将矩阵按对角线排序 =====");
console.log(
  "方法1 [[3,3,1,1],[2,2,1,2],[1,1,1,2]]:",
  JSON.stringify(
    diagonalSort([
      [3, 3, 1, 1],
      [2, 2, 1, 2],
      [1, 1, 1, 2],
    ]),
  ),
); // [[1,1,1,1],[1,2,2,2],[1,2,3,3]]
console.log(
  "方法2 [[3,3,1,1],[2,2,1,2],[1,1,1,2]]:",
  JSON.stringify(
    diagonalSort2([
      [3, 3, 1, 1],
      [2, 2, 1, 2],
      [1, 1, 1, 2],
    ]),
  ),
); // [[1,1,1,1],[1,2,2,2],[1,2,3,3]]
console.log(
  "方法1 [[11,25,66,1,69,7],[23,55,17,45,15,52],[75,31,36,44,58,8],[22,27,33,25,68,4],[84,28,14,11,5,50]]:",
  JSON.stringify(
    diagonalSort([
      [11, 25, 66, 1, 69, 7],
      [23, 55, 17, 45, 15, 52],
      [75, 31, 36, 44, 58, 8],
      [22, 27, 33, 25, 68, 4],
      [84, 28, 14, 11, 5, 50],
    ]),
  ),
);

export {};
