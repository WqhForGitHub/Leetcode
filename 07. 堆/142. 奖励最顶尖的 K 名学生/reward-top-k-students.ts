// ============================================================
// 142. 奖励最顶尖的 K 名学生
// ============================================================
// LeetCode 2512. Reward Top K Students
// 根据正向/负向反馈词计算学生分数，返回前 k 名。
// 时间复杂度：O(n + m log m)，空间复杂度：O(n)

// 方法1：哈希表 + 排序
function topStudents(positive: string[], negative: string[], report: string[], studentId: number[], k: number): number[] {
  const posSet: Set<string> = new Set(positive);
  const negSet: Set<string> = new Set(negative);
  const students: Array<{ score: number; id: number }> = [];
  for (let i = 0; i < report.length; i++) {
    let score = 0;
    const words = report[i].split(" ");
    for (const w of words) {
      if (posSet.has(w)) score += 3;
      if (negSet.has(w)) score -= 1;
    }
    students.push({ score, id: studentId[i] });
  }
  students.sort((a, b) => b.score - a.score || a.id - b.id);
  return students.slice(0, k).map(s => s.id);
}

// 方法2：最小堆维护 k 个
function topStudentsHeap(positive: string[], negative: string[], report: string[], studentId: number[], k: number): number[] {
  const posSet: Set<string> = new Set(positive);
  const negSet: Set<string> = new Set(negative);
  const heap: Array<{ score: number; id: number }> = [];
  const less = (a: typeof heap[0], b: typeof heap[0]): boolean => {
    return a.score < b.score || (a.score === b.score && a.id > b.id);
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (less(heap[i], heap[p])) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (i: number): void => {
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && less(heap[l], heap[s])) s = l;
      if (r < len && less(heap[r], heap[s])) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = 0; i < report.length; i++) {
    let score = 0;
    for (const w of report[i].split(" ")) {
      if (posSet.has(w)) score += 3;
      if (negSet.has(w)) score -= 1;
    }
    heap.push({ score, id: studentId[i] });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown(0);
    }
  }
  const result: number[] = [];
  while (heap.length > 0) {
    result.push(heap[0].id);
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 142. 奖励最顶尖的 K 名学生 =====");
console.log("排序:", topStudents(
  ["smart", "brilliant", "studious"],
  ["not"],
  ["this student is studious", "the student is smart"],
  [1, 2],
  2
)); // 期望 [1,2]

export {};
