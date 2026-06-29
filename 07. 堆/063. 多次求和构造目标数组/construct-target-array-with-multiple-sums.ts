// ============================================================
// 063. 多次求和构造目标数组
// ============================================================
// LeetCode 1354. Construct Target Array With Multiple Sums
// 初始全为 1，每次用所有元素之和替换一个元素，判断能否得到 target。
// 时间复杂度：O(N log N log M)，空间复杂度：O(N)

// 方法1：最大堆逆向操作（推荐）
function isPossible(target: number[]): boolean {
  if (target.length === 1) return target[0] === 1;
  let sum = 0;
  const heap: number[] = [];
  const pushMax = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (const t of target) {
    sum += t;
    pushMax(t);
  }
  while (heap[0] > 1) {
    const max = popMax();
    sum -= max;
    if (sum === 0) return false;
    if (sum >= max) return false;
    const prev = max % sum === 0 ? sum : max % sum;
    if (prev < 1) return false;
    sum += prev;
    pushMax(prev);
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 多次求和构造目标数组 =====");
console.log("是否可能:", isPossible([9, 3, 5])); // 期望 true
console.log("是否可能:", isPossible([1, 1, 1, 2])); // 期望 false

export {};
