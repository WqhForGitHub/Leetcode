// LC2374. 边积分最高的节点
// edges 每节点 1 出边, 节点 i 边积分 = 所有指向 i 的 j 之和
// 返回边积分最高的节点, 相同取最小下标
// 遍历累加

type EdgeArr = number[];

// 方法1: 遍历累加
function edgeScore1(edges: EdgeArr): number {
  const n = edges.length;
  const score = new Array<bigint>(n).fill(0n);
  for (let i = 0; i < n; i++) {
    score[edges[i]] += BigInt(i);
  }
  let ans = 0;
  let best = -1n;
  for (let i = 0; i < n; i++) {
    if (score[i] > best) {
      best = score[i];
      ans = i;
    }
  }
  return ans;
}

// 方法2: Map 累加
function edgeScore2(edges: EdgeArr): number {
  const score = new Map<number, number>();
  for (let i = 0; i < edges.length; i++) {
    const t = edges[i];
    score.set(t, (score.get(t) || 0) + i);
  }
  let ans = 0,
    best = -1;
  for (let i = 0; i < edges.length; i++) {
    const s = score.get(i) || 0;
    if (s > best) {
      best = s;
      ans = i;
    }
  }
  return ans;
}

// 测试
function test(): void {
  console.log(edgeScore1([1, 0, 0, 0, 0, 7, 7, 5])); // 7
  console.log(edgeScore1([2, 0, 0, 2])); // 0
  console.log(edgeScore2([1, 0, 0, 0, 0, 7, 7, 5])); // 7
  console.log(edgeScore2([2, 0, 0, 2])); // 0
}
test();

export {};
