// ============================================================
// 021. 情侣牵手
// ============================================================
// LeetCode 765. Couples Holding Hands
// N 对情侣坐成一行，row[i] 为第 i 个座位的人。情侣编号为 (2k, 2k+1)。
// 每排两个座位，求最少交换几次使每对情侣相邻。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：并查集（推荐）
// 思路：把每一排（座位 2i, 2i+1）看作一个节点。该排上两人分别属于情侣组
// row[2i]/2 与 row[2i+1]/2。若不属于同一组则连通这两个组。
// 最终每个连通分量只需 (size-1) 次交换，总交换数 = N - 连通分量数。
function minSwapsCouplesUF(row: number[]): number {
  const n = row.length >> 1; // 排数 = 情侣对数
  const parent: number[] = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  for (let i = 0; i < n; i++) {
    const a = row[2 * i] >> 1; // 第 2i 座位的人所属情侣组
    const b = row[2 * i + 1] >> 1; // 第 2i+1 座位的人所属情侣组
    if (a !== b) union(a, b);
  }

  let components = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) === i) components++;
  }
  return n - components;
}

// 方法2：贪心交换
// 思路：从左到右每排检查，若第一个人 x 的伴侣 (x^1) 不在右边，则把右边的
// 人与伴侣交换。用哈希表维护每个人当前位置。
function minSwapsCouplesGreedy(row: number[]): number {
  const n = row.length;
  const pos: number[] = new Array(n);
  for (let i = 0; i < n; i++) pos[row[i]] = i;

  let swaps = 0;
  for (let i = 0; i < n; i += 2) {
    const x = row[i];
    const partner = x ^ 1; // 异或 1 得到伴侣编号
    if (row[i + 1] !== partner) {
      const partnerIdx = pos[partner];
      const other = row[i + 1];
      // 交换 row[i+1] 与 row[partnerIdx]
      row[i + 1] = partner;
      row[partnerIdx] = other;
      pos[partner] = i + 1;
      pos[other] = partnerIdx;
      swaps++;
    }
  }
  return swaps;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 情侣牵手 =====");

console.log(minSwapsCouplesUF([0, 2, 1, 3])); // 期望: 1
console.log(minSwapsCouplesUF([3, 2, 0, 1])); // 期望: 0

console.log(minSwapsCouplesGreedy([0, 2, 1, 3])); // 期望: 1
console.log(minSwapsCouplesGreedy([3, 2, 0, 1])); // 期望: 0

console.log(minSwapsCouplesUF([0, 4, 1, 2, 5, 3])); // 期望: 2 (6 人 3 对)
console.log(minSwapsCouplesGreedy([0, 4, 1, 2, 5, 3])); // 期望: 2

export {};
