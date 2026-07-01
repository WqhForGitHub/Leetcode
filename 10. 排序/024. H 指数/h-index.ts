// ============================================================
// 024. H 指数
// ============================================================
// LeetCode 274. H-Index
// 给定研究者的引用次数数组 citations，计算其 h 指数：
// h 指数是指有 h 篇论文被引用至少 h 次，其余论文被引用不超过 h 次。

// 方法1：排序后扫描（O(n log n)，O(1)）
// 降序排序后，找到最大的 h 使得前 h 篇论文引用次数都 >= h。
function hIndex(citations: number[]): number {
  const arr: number[] = [...citations].sort((a, b) => b - a);
  let h: number = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= i + 1) {
      h = i + 1;
    } else {
      break;
    }
  }
  return h;
}

// 方法2：计数排序（推荐，O(n)，O(n)）
// 引用次数 >= n 的统一计入 count[n]，从大到小累加找到满足 total >= i 的最大 i。
function hIndex2(citations: number[]): number {
  const n: number = citations.length;
  const count: number[] = new Array(n + 1).fill(0);
  for (const c of citations) {
    if (c >= n) count[n]++;
    else count[c]++;
  }

  let total: number = 0;
  for (let i = n; i >= 0; i--) {
    total += count[i];
    if (total >= i) return i;
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. H 指数 =====");
console.log("方法1:", hIndex([3, 0, 6, 1, 5])); // 期望 3
console.log("方法1:", hIndex([1, 1, 3])); // 期望 1
console.log("方法2:", hIndex2([3, 0, 6, 1, 5])); // 期望 3
console.log("方法2:", hIndex2([100])); // 期望 1
console.log("方法2:", hIndex2([0, 0, 0])); // 期望 0

export {};
