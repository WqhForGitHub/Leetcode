// ============================================================
// 193. 交通枢纽
// ============================================================
// 自定义题：n 城市物流图 edges 带运量，找出运量最大的中转城市
// （入度 > 0 且出度 > 0，按 入度 * 出度 评价，最大者）。
// 若有并列，返回编号最小者；若无中转城市返回 -1。
// 思路：度数统计，一次遍历边即可。
// 时间复杂度：O(N + E)，空间复杂度：O(N)

interface LogisticEdge {
  from: number;
  to: number;
  volume: number;
}

// 方法1：度数统计（推荐）
function findTransportationHub(n: number, edges: LogisticEdge[]): number {
  const indeg: number[] = new Array(n).fill(0);
  const outdeg: number[] = new Array(n).fill(0);
  for (const { from, to } of edges) {
    outdeg[from]++;
    indeg[to]++;
  }
  let best = -1;
  let bestScore = -1;
  for (let i = 0; i < n; i++) {
    if (indeg[i] > 0 && outdeg[i] > 0) {
      const score = indeg[i] * outdeg[i];
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
  }
  return best;
}

// 方法2：考虑运量加权的中转城市（按总入运量 * 总出运量）
// 题目要求 "运量最大"，这里给出按运量加权的变体实现。
function findTransportationHubWeighted(n: number, edges: LogisticEdge[]): number {
  const inVol: number[] = new Array(n).fill(0);
  const outVol: number[] = new Array(n).fill(0);
  const indeg: number[] = new Array(n).fill(0);
  const outdeg: number[] = new Array(n).fill(0);
  for (const { from, to, volume } of edges) {
    outdeg[from]++;
    outVol[from] += volume;
    indeg[to]++;
    inVol[to] += volume;
  }
  let best = -1;
  let bestScore = -1;
  for (let i = 0; i < n; i++) {
    if (indeg[i] > 0 && outdeg[i] > 0) {
      const score = inVol[i] * outVol[i];
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 193. 交通枢纽 =====");

// 0->1, 0->2, 1->2, 2->3
// 入度/出度: 0(0,2) 1(1,1) 2(2,1) 3(1,0)
// 中转候选: 1(1*1=1) 2(2*1=2) => 返回 2
const e1: LogisticEdge[] = [
  { from: 0, to: 1, volume: 5 },
  { from: 0, to: 2, volume: 3 },
  { from: 1, to: 2, volume: 2 },
  { from: 2, to: 3, volume: 4 },
];
console.log(findTransportationHub(4, e1)); // 期望: 2
console.log(findTransportationHubWeighted(4, e1)); // 期望: 2

// 无中转城市（仅 0->1）
console.log(findTransportationHub(2, [{ from: 0, to: 1, volume: 1 }])); // 期望: -1

// 单节点
console.log(findTransportationHub(1, [])); // 期望: -1

export {};
