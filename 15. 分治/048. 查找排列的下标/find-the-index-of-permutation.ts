// ============================================================
// 048. 查找排列的下标
// ============================================================
// LeetCode 3109. Find the Index of Permutation
// 给定长度为 n 的排列 perm（[1..n] 的排列）。将 [1..n] 的所有排列按字典序排序，
// 返回 perm 的下标（0 下标）。由于答案可能很大，对 10^9+7 取模。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

const MOD_PERM: number = 1e9 + 7;

// 方法1：树状数组 + 阶乘（推荐）
// 字典序排名 = Σ (位置 i 处“未使用的比 perm[i] 小的值个数”) * (n-1-i)!。
// 用 BIT 维护每个值是否仍可用（初始全 1），逐位处理：查询 < perm[i] 的可用值个数，
// 乘以剩余阶乘累加，再将 perm[i] 标记为不可用。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function getPermutationIndex(perm: number[]): number {
  const n: number = perm.length;
  const MOD: number = MOD_PERM;
  // 预处理阶乘（取模）
  const fact: number[] = new Array<number>(n + 1).fill(0);
  fact[0] = 1;
  for (let i: number = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;

  const tree: number[] = new Array<number>(n + 2).fill(0);
  function lowbit(x: number): number {
    return x & -x;
  }
  function update(i: number, d: number): void {
    for (; i <= n; i += lowbit(i)) tree[i] += d;
  }
  function query(i: number): number {
    let s: number = 0;
    for (; i > 0; i -= lowbit(i)) s += tree[i];
    return s;
  }
  // 初始所有值 1..n 均可用
  for (let v: number = 1; v <= n; v++) update(v, 1);

  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    const smaller: number = query(perm[i] - 1); // 未使用的、比 perm[i] 小的值个数
    ans = (ans + ((smaller * fact[n - 1 - i]) % MOD)) % MOD;
    update(perm[i], -1); // 标记 perm[i] 已使用
  }
  return ans;
}

// 方法2：归并排序分治求左侧更小个数
// “未使用的更小值个数” = (perm[i]-1) - leftSmaller[i]，
// 其中 leftSmaller[i] = perm[0..i-1] 中比 perm[i] 小的个数（即已使用的更小值）。
// 用归并排序求 leftSmaller，再按上式累加阶乘贡献。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function getPermutationIndexMerge(perm: number[]): number {
  const n: number = perm.length;
  const MOD: number = MOD_PERM;
  const fact: number[] = new Array<number>(n + 1).fill(0);
  fact[0] = 1;
  for (let i: number = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;

  // 归并排序求 leftSmaller[i] = 左侧比 perm[i] 小的个数（排列元素互异，无需处理相等）
  const leftSmaller: number[] = new Array<number>(n).fill(0);
  function mergeSort(a: [number, number][]): [number, number][] {
    if (a.length <= 1) return a;
    const mid: number = Math.floor(a.length / 2);
    const left: [number, number][] = mergeSort(a.slice(0, mid));
    const right: [number, number][] = mergeSort(a.slice(mid));
    const merged: [number, number][] = [];
    let i: number = 0;
    let j: number = 0;
    while (i < left.length && j < right.length) {
      if (left[i][0] < right[j][0]) {
        merged.push(left[i++]);
      } else {
        leftSmaller[right[j][1]] += i; // i = 左侧严格更小个数
        merged.push(right[j++]);
      }
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) {
      leftSmaller[right[j][1]] += i;
      merged.push(right[j++]);
    }
    return merged;
  }
  mergeSort(perm.map((v: number, idx: number): [number, number] => [v, idx]));

  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    const smallerUnused: number = perm[i] - 1 - leftSmaller[i];
    ans = (ans + ((smallerUnused * fact[n - 1 - i]) % MOD)) % MOD;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 查找排列的下标 =====");
console.log(getPermutationIndex([1, 2])); // 期望结果: 0
console.log(getPermutationIndex([3, 1, 2])); // 期望结果: 4
console.log(getPermutationIndex([2, 1, 3])); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(getPermutationIndexMerge([1, 2])); // 期望结果: 0
console.log(getPermutationIndexMerge([3, 1, 2])); // 期望结果: 4
console.log(getPermutationIndexMerge([2, 1, 3])); // 期望结果: 2

export {};
