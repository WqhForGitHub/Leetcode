// ============================================================
// 087. 找出知晓秘密的所有专家
// ============================================================
// LeetCode 2092. Find All People With Secret
// meetings 按时间给出，0 号一开始知道秘密。同一时刻的会议可在连通分量内
// 任意传播。按时间分组 + 并查集（每轮重置不知秘密者）。
// 时间复杂度：O(M log M + M * α(N))，空间复杂度：O(N + M)

function findAllPeople(n: number, meetings: number[][], firstPerson: number): number[] {
  // 按时间排序
  meetings.sort((a, b) => a[2] - b[2]);
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (x: number, y: number): void => {
    const rx: number = find(x);
    const ry: number = find(y);
    if (rx !== ry) parent[rx] = ry;
  };
  // 0 和 firstPerson 一开始知道
  union(0, firstPerson);
  const know: boolean[] = new Array(n).fill(false);
  know[0] = true;
  know[firstPerson] = true;
  let i: number = 0;
  const m: number = meetings.length;
  while (i < m) {
    // 收集同一时间的所有会议
    let j: number = i;
    const people: Set<number> = new Set();
    while (j < m && meetings[j][2] === meetings[i][2]) {
      const [x, y]: number[] = meetings[j];
      union(x, y);
      people.add(x);
      people.add(y);
      j++;
    }
    // 检查该轮哪些人通过 0 知道秘密
    for (const p of people) {
      if (find(p) === find(0)) {
        know[p] = true;
      } else {
        // 不知道秘密的人，重置其并查集节点
        parent[p] = p;
      }
    }
    i = j;
  }
  const ans: number[] = [];
  for (let p: number = 0; p < n; p++) {
    if (know[p]) ans.push(p);
  }
  return ans;
}

// 方法1：按时间分组 + 并查集（重置未知者）
function f1(n: number, meetings: number[][], firstPerson: number): number[] {
  return findAllPeople(n, meetings, firstPerson);
}

// 方法2：按时间分组 + 并查集，每轮单独建临时并查集
function f2(n: number, meetings: number[][], firstPerson: number): number[] {
  meetings.sort((a, b) => a[2] - b[2]);
  const know: boolean[] = new Array(n).fill(false);
  know[0] = true;
  know[firstPerson] = true;
  let i: number = 0;
  const m: number = meetings.length;
  while (i < m) {
    let j: number = i;
    const ps: Set<number> = new Set();
    const edges: number[][] = [];
    while (j < m && meetings[j][2] === meetings[i][2]) {
      edges.push([meetings[j][0], meetings[j][1]]);
      ps.add(meetings[j][0]);
      ps.add(meetings[j][1]);
      j++;
    }
    // 为该轮参与者建立临时并查集
    const parent: Map<number, number> = new Map();
    const find = (x: number): number => {
      if (parent.get(x)! !== x) parent.set(x, find(parent.get(x)!));
      return parent.get(x)!;
    };
    for (const p of ps) parent.set(p, p);
    for (const [u, v] of edges) {
      const ru: number = find(u);
      const rv: number = find(v);
      if (ru !== rv) parent.set(ru, rv);
    }
    // 该轮知道秘密的人
    const knowSet: Set<number> = new Set();
    for (const p of ps) if (know[p]) knowSet.add(find(p));
    for (const p of ps) {
      if (knowSet.has(find(p))) know[p] = true;
    }
    i = j;
  }
  const ans: number[] = [];
  for (let p: number = 0; p < n; p++) if (know[p]) ans.push(p);
  return ans;
}

console.log("===== 087. 找出知晓秘密的所有专家 =====");
// 测试
console.log(
  f1(
    6,
    [
      [1, 2, 5],
      [2, 3, 8],
      [1, 5, 10],
    ],
    1,
  ),
); // [0,1,2,3,5]
console.log(
  f2(
    6,
    [
      [1, 2, 5],
      [2, 3, 8],
      [1, 5, 10],
    ],
    1,
  ),
); // [0,1,2,3,5]
console.log(
  f1(
    4,
    [
      [3, 1, 3],
      [1, 2, 2],
      [0, 3, 3],
    ],
    3,
  ),
); // [0,1,2,3,4]? -> [0,1,2,3]
console.log(
  f2(
    4,
    [
      [3, 1, 3],
      [1, 2, 2],
      [0, 3, 3],
    ],
    3,
  ),
); // [0,1,2,3]

export {};
