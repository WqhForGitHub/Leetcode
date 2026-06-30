// ============================================================
// 012. 序列重建
// ============================================================
// LeetCode 444. Sequence Reconstruction
// 判断 org 是否是 seqs 的唯一最短公共超序列（即 seqs 的唯一拓扑序等于 org）
// 时间复杂度：拓扑排序 O(N + Σ|seq|)；相邻对法 O(N + Σ|seq|)

// 方法1：拓扑排序 + 唯一性验证（推荐）
function sequenceReconstruction(org: number[], seqs: number[][]): boolean {
  const nodes = new Set<number>();
  for (const seq of seqs) {
    for (const x of seq) nodes.add(x);
  }
  // 节点集合必须与 org 一致
  if (nodes.size !== org.length) return false;
  for (const x of org) {
    if (!nodes.has(x)) return false;
  }
  if (org.length === 0) {
    return seqs.length === 0 || seqs.every((s) => s.length === 0);
  }

  // 建图
  const adj = new Map<number, Set<number>>();
  const indeg = new Map<number, number>();
  for (const x of nodes) {
    adj.set(x, new Set());
    indeg.set(x, 0);
  }
  for (const seq of seqs) {
    for (let i = 0; i + 1 < seq.length; i++) {
      const u = seq[i];
      const v = seq[i + 1];
      if (u === v) return false; // 自环非法
      if (!adj.get(u)!.has(v)) {
        adj.get(u)!.add(v);
        indeg.set(v, indeg.get(v)! + 1);
      }
    }
  }

  // Kahn 拓扑排序，每一步入度为 0 的节点必须唯一
  const queue: number[] = [];
  for (const [x, d] of indeg) {
    if (d === 0) queue.push(x);
  }
  const order: number[] = [];
  while (queue.length > 0) {
    if (queue.length !== 1) return false; // 不唯一
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  if (order.length !== org.length) return false;
  for (let i = 0; i < org.length; i++) {
    if (order[i] !== org[i]) return false;
  }
  return true;
}

// 方法2：相邻对覆盖法
// org 唯一可重建 <=> seqs 中所有数都在 org 内、不违反 org 顺序，
// 且 org 的每一对相邻 (org[i], org[i+1]) 都被某个 seq 直接覆盖
function sequenceReconstructionPairs(org: number[], seqs: number[][]): boolean {
  const pos = new Map<number, number>();
  for (let i = 0; i < org.length; i++) pos.set(org[i], i);
  const covered = new Array<boolean>(Math.max(org.length - 1, 0)).fill(false);
  let hasAny = false;
  for (const seq of seqs) {
    for (let i = 0; i < seq.length; i++) {
      hasAny = true;
      if (!pos.has(seq[i])) return false;
      if (i > 0) {
        const a = pos.get(seq[i - 1])!;
        const b = pos.get(seq[i])!;
        if (a >= b) return false; // 违反 org 顺序
        if (a + 1 === b) covered[a] = true; // 直接覆盖相邻对
      }
    }
  }
  if (!hasAny && org.length > 0) return false;
  return covered.every(Boolean);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 序列重建 =====");
console.log(sequenceReconstruction([1, 2, 3], [[1, 2], [2, 3]])); // true
console.log(sequenceReconstructionPairs([1, 2, 3], [[1, 2], [2, 3]])); // true
console.log(sequenceReconstruction([1, 2, 3], [[1, 2], [1, 3]])); // false
console.log(sequenceReconstructionPairs([1, 2, 3], [[1, 2], [1, 3]])); // false
console.log(sequenceReconstruction([1, 2, 3], [[1, 2]])); // false
console.log(sequenceReconstructionPairs([1, 2, 3], [[1, 2]])); // false
console.log(sequenceReconstruction([1, 2, 3], [[1, 2], [1, 3], [2, 3]])); // true
console.log(sequenceReconstructionPairs([1, 2, 3], [[1, 2], [1, 3], [2, 3]])); // true
console.log(sequenceReconstruction([1], [[1]])); // true
console.log(sequenceReconstructionPairs([1], [[1]])); // true
console.log(sequenceReconstruction([1], [[], []])); // false
console.log(sequenceReconstructionPairs([1], [[], []])); // false

export {};
