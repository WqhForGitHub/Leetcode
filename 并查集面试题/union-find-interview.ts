// ============================================================
// 并查集面试题 - TypeScript 解题合集
// 主题：集合操作 / 账户合并 / 字符串相似性判断 /
//       动物王国中的食物链
// ============================================================

// ============================================================
// 并查集基础模板
// ============================================================
// 并查集（Union-Find / Disjoint Set Union）用于处理不相交集合的合并与查询
// 核心操作：find（查找根节点）和 union（合并两个集合）
// 优化：路径压缩 + 按秩合并，使单次操作接近 O(1)

class UnionFind {
  parent: number[];
  rank: number[];
  count: number; // 连通分量数

  constructor(n: number) {
    this.parent = new Array(n).fill(0).map((_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }

  // 查找根节点，带路径压缩
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // 合并两个集合，按秩合并
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // 已在同一集合

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
    return true;
  }

  // 判断两个元素是否在同一集合
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  // 获取连通分量数
  getCount(): number {
    return this.count;
  }
}

// ============================================================
// 1. 集合操作
// ============================================================
// 基础并查集操作：合并集合、查找集合、判断连通性
// 场景：n 个元素，支持合并和查询操作
// 时间复杂度：均摊 O(α(n)) ≈ O(1)，空间复杂度：O(n)

// 方法1：标准并查集（推荐）
function collectionOperations(n: number, operations: string[][]): (number | boolean)[] {
  const uf = new UnionFind(n);
  const result: (number | boolean)[] = [];

  for (const op of operations) {
    if (op[0] === 'union') {
      const x = parseInt(op[1]);
      const y = parseInt(op[2]);
      result.push(uf.union(x, y));
    } else if (op[0] === 'find') {
      const x = parseInt(op[1]);
      result.push(uf.find(x));
    } else if (op[0] === 'connected') {
      const x = parseInt(op[1]);
      const y = parseInt(op[2]);
      result.push(uf.connected(x, y));
    } else if (op[0] === 'count') {
      result.push(uf.getCount());
    }
  }
  return result;
}

// 方法2：带权并查集（维护到根的距离/权值）
class WeightedUnionFind {
  parent: number[];
  rank: number[];
  weight: number[]; // 节点到父节点的权值

  constructor(n: number) {
    this.parent = new Array(n).fill(0).map((_, i) => i);
    this.rank = new Array(n).fill(0);
    this.weight = new Array(n).fill(1);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      const root = this.find(this.parent[x]);
      this.weight[x] *= this.weight[this.parent[x]]; // 路径压缩时累加权值
      this.parent[x] = root;
    }
    return this.parent[x];
  }

  union(x: number, y: number, value: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.weight[rootX] = value * this.weight[y] / this.weight[x];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.weight[rootY] = this.weight[x] / (value * this.weight[y]);
    } else {
      this.parent[rootY] = rootX;
      this.weight[rootY] = this.weight[x] / (value * this.weight[y]);
      this.rank[rootX]++;
    }
    return true;
  }

  // 查询 x 和 y 的比值（x / y）
  query(x: number, y: number): number {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) return -1;
    return this.weight[x] / this.weight[y];
  }
}

// ============================================================
// 2. 账户合并
// ============================================================
// LeetCode 721. Accounts Merge
// 给定一组账户，每个账户有名称和若干邮箱，合并具有相同邮箱的账户
// 同一个人的邮箱一定在同一个连通分量中
// 时间复杂度：O(n * k * α(n*k))，其中 n 为账户数，k 为平均邮箱数
// 空间复杂度：O(n * k)

function accountsMerge(accounts: string[][]): string[][] {
  // 邮箱到唯一 ID 的映射
  const emailToId = new Map<string, number>();
  const emailToName = new Map<string, string>();
  let id = 0;

  // 为每个邮箱分配唯一 ID
  for (const account of accounts) {
    const name = account[0];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (!emailToId.has(email)) {
        emailToId.set(email, id++);
      }
      emailToName.set(email, name);
    }
  }

  // 并查集合并同一账户中的邮箱
  const uf = new UnionFind(id);
  for (const account of accounts) {
    const firstEmailId = emailToId.get(account[1])!;
    for (let i = 2; i < account.length; i++) {
      uf.union(firstEmailId, emailToId.get(account[i])!);
    }
  }

  // 收集每个连通分量（根节点）下的所有邮箱
  const rootToEmails = new Map<number, string[]>();
  for (const [email, emailId] of emailToId) {
    const root = uf.find(emailId);
    if (!rootToEmails.has(root)) {
      rootToEmails.set(root, []);
    }
    rootToEmails.get(root)!.push(email);
  }

  // 构造结果：名称 + 排序后的邮箱列表
  const result: string[][] = [];
  for (const [root, emails] of rootToEmails) {
    emails.sort();
    const name = emailToName.get(emails[0])!;
    result.push([name, ...emails]);
  }
  return result;
}

// 方法2：DFS 合并（使用邻接表）
function accountsMergeDFS(accounts: string[][]): string[][] {
  const emailToName = new Map<string, string>();
  const graph = new Map<string, Set<string>>();

  // 构建邻接表：同一账户中的邮箱互相连接
  for (const account of accounts) {
    const name = account[0];
    const firstEmail = account[1];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      emailToName.set(email, name);
      if (!graph.has(email)) graph.set(email, new Set());
      if (i > 1) {
        // 当前邮箱与第一个邮箱连边
        graph.get(firstEmail)!.add(email);
        graph.get(email)!.add(firstEmail);
      }
    }
  }

  const visited = new Set<string>();
  const result: string[][] = [];

  const dfs = (email: string, component: string[]): void => {
    visited.add(email);
    component.push(email);
    for (const neighbor of graph.get(email) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, component);
      }
    }
  };

  for (const email of graph.keys()) {
    if (!visited.has(email)) {
      const component: string[] = [];
      dfs(email, component);
      component.sort();
      result.push([emailToName.get(email)!, ...component]);
    }
  }
  return result;
}

// ============================================================
// 3. 字符串相似性判断
// ============================================================
// LeetCode 737. Sentence Similarity II
// 给定一组相似词对，判断两个句子是否相似
// 相似具有传递性：若 a~b 且 b~c，则 a~c
// 并查集天然支持传递性的判断
// 时间复杂度：O(n + p * α(p))，n 为句子长度，p 为词对数
// 空间复杂度：O(p)

function areSentencesSimilarTwo(
  sentence1: string[],
  sentence2: string[],
  similarPairs: string[][]
): boolean {
  if (sentence1.length !== sentence2.length) return false;

  // 为每个单词分配唯一 ID
  const wordToId = new Map<string, number>();
  let id = 0;
  const getId = (word: string): number => {
    if (!wordToId.has(word)) {
      wordToId.set(word, id++);
    }
    return wordToId.get(word)!;
  };

  // 并查集合并相似词对
  const uf = new UnionFind(similarPairs.length * 2 + sentence1.length * 2);
  for (const [a, b] of similarPairs) {
    uf.union(getId(a), getId(b));
  }

  // 判断对应位置的词是否在同一集合
  for (let i = 0; i < sentence1.length; i++) {
    if (sentence1[i] === sentence2[i]) continue; // 相同单词直接通过
    if (!uf.connected(getId(sentence1[i]), getId(sentence2[i]))) {
      return false;
    }
  }
  return true;
}

// 方法2：使用 Map 的并查集（更灵活，无需预分配 ID）
class UnionFindMap {
  parent: Map<string, string>;
  rank: Map<string, number>;

  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
      return x;
    }
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;
    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  connected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }
}

function areSentencesSimilarTwoMap(
  sentence1: string[],
  sentence2: string[],
  similarPairs: string[][]
): boolean {
  if (sentence1.length !== sentence2.length) return false;

  const uf = new UnionFindMap();
  for (const [a, b] of similarPairs) {
    uf.union(a, b);
  }

  for (let i = 0; i < sentence1.length; i++) {
    if (sentence1[i] === sentence2[i]) continue;
    if (!uf.connected(sentence1[i], sentence2[i])) {
      return false;
    }
  }
  return true;
}

// ============================================================
// 4. 动物王国中的食物链
// ============================================================
// POJ 1182 / AcWing 240. 食物链
// 动物王国中有 A、B、C 三类动物，A 吃 B，B 吃 C，C 吃 A
// 给定 N 个动物和 K 条信息：
//   1 X Y：X 和 Y 是同类
//   2 X Y：X 吃 Y
// 判断有多少条信息是假的（与之前的信息矛盾）
// 核心思路：带权并查集，维护每个节点到根的关系
//   d[x] = 0：x 与根同类
//   d[x] = 1：x 吃根
//   d[x] = 2：x 被根吃
// 时间复杂度：O(K * α(N))，空间复杂度：O(N)

function foodChain(n: number, statements: number[][]): number {
  const parent = new Array(n + 1).fill(0).map((_, i) => i);
  const d = new Array(n + 1).fill(0); // d[x]：x 到 parent[x] 的关系
  let lieCount = 0;

  const find = (x: number): number => {
    if (parent[x] !== x) {
      const root = find(parent[x]);
      d[x] = (d[x] + d[parent[x]]) % 3; // 路径压缩时累加关系
      parent[x] = root;
    }
    return parent[x];
  };

  for (const [type, x, y] of statements) {
    // 编号超出范围，直接为假
    if (x > n || y > n) {
      lieCount++;
      continue;
    }

    const rootX = find(x);
    const rootY = find(y);

    if (type === 1) {
      // X 和 Y 是同类
      if (rootX === rootY) {
        // 已在同一集合，检查是否同类
        if (d[x] !== d[y]) lieCount++;
      } else {
        // 不在同一集合，合并
        parent[rootX] = rootY;
        // 使 d[x] ≡ d[y] (mod 3)，即 x 和 y 到根的关系相同
        d[rootX] = (d[y] - d[x] + 3) % 3;
      }
    } else {
      // X 吃 Y
      if (x === y) {
        lieCount++; // 自己吃自己，矛盾
        continue;
      }
      if (rootX === rootY) {
        // 已在同一集合，检查 x 是否吃 y
        // x 吃 y 等价于 (d[x] - d[y]) % 3 === 1
        if ((d[x] - d[y] + 3) % 3 !== 1) lieCount++;
      } else {
        // 不在同一集合，合并
        parent[rootX] = rootY;
        // 使 (d[x] - d[y]) % 3 === 1，即 x 吃 y
        d[rootX] = (d[y] - d[x] + 1 + 3) % 3;
      }
    }
  }
  return lieCount;
}

// 方法2：扩展域并查集（将每个动物拆分为 3 个节点）
// x_self：x 的同类域，x_prey：x 的猎物域，x_predator：x 的天敌域
// x 吃 y 等价于：x_prey 与 y_self 合并，x_self 与 y_predator 合并，x_predator 与 y_prey 合并
function foodChainExtended(n: number, statements: number[][]): number {
  // 每个动物拆为 3 个节点：self(0), prey(1), predator(2)
  const total = n * 3;
  const parent = new Array(total).fill(0).map((_, i) => i);

  const find = (x: number): number => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (x: number, y: number): void => {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX !== rootY) parent[rootX] = rootY;
  };

  let lieCount = 0;

  for (const [type, x, y] of statements) {
    if (x > n || y > n) {
      lieCount++;
      continue;
    }

    const self = (i: number) => i * 3;       // 同类域
    const prey = (i: number) => i * 3 + 1;   // 猎物域
    const pred = (i: number) => i * 3 + 2;   // 天敌域

    if (type === 1) {
      // X 和 Y 是同类
      // 矛盾条件：X 吃 Y 或 Y 吃 X
      if (find(self(x)) === find(prey(y)) || find(self(y)) === find(prey(x))) {
        lieCount++;
      } else {
        // 合并同类域、猎物域、天敌域
        union(self(x), self(y));
        union(prey(x), prey(y));
        union(pred(x), pred(y));
      }
    } else {
      // X 吃 Y
      // 矛盾条件：X 和 Y 同类，或 Y 吃 X
      if (find(self(x)) === find(self(y)) || find(self(y)) === find(prey(x))) {
        lieCount++;
      } else {
        // X 的猎物 = Y 的同类
        union(prey(x), self(y));
        // X 的同类 = Y 的天敌（Y 吃 X 的猎物）
        union(self(x), pred(y));
        // X 的天敌 = Y 的猎物（食物链循环）
        union(pred(x), prey(y));
      }
    }
  }
  return lieCount;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 集合操作 =====");
const ops1: string[][] = [
  ['union', '0', '1'],
  ['union', '2', '3'],
  ['connected', '0', '1'],
  ['connected', '0', '2'],
  ['count'],
  ['union', '1', '2'],
  ['connected', '0', '2'],
  ['count'],
];
console.log("标准并查集:", collectionOperations(4, ops1));
// [true, true, true, false, 2, true, true, 1]

console.log("\n===== 2. 账户合并 =====");
const accounts1 = [
  ["John", "johnsmith@mail.com", "john00@mail.com"],
  ["John", "johnnybravo@mail.com"],
  ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
  ["Mary", "mary@mail.com"],
];
console.log("并查集:", accountsMerge(accounts1.map(a => [...a])));
// [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
//  ["John","johnnybravo@mail.com"],
//  ["Mary","mary@mail.com"]]

const accounts2 = [
  ["John", "johnsmith@mail.com", "john00@mail.com"],
  ["John", "johnnybravo@mail.com"],
  ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
  ["Mary", "mary@mail.com"],
];
console.log("DFS:", accountsMergeDFS(accounts2.map(a => [...a])));

console.log("\n===== 3. 字符串相似性判断 =====");
const s1 = ["great", "acting", "skills"];
const s2 = ["fine", "drama", "talent"];
const pairs1 = [["great", "good"], ["fine", "good"], ["drama", "acting"], ["skills", "talent"]];
console.log("并查集(ID):", areSentencesSimilarTwo(s1, s2, pairs1)); // true

const s3 = ["great", "acting", "skills"];
const s4 = ["fine", "drama", "talent"];
const pairs2 = [["great", "good"], ["fine", "good"], ["drama", "acting"], ["skills", "talent"]];
console.log("并查集(Map):", areSentencesSimilarTwoMap(s3, s4, pairs2)); // true

const s5 = ["great"];
const s6 = ["great"];
console.log("相同单词:", areSentencesSimilarTwoMap(s5, s6, [])); // true

const s7 = ["great"];
const s8 = ["good"];
console.log("不同单词无词对:", areSentencesSimilarTwoMap(s7, s8, [])); // false

console.log("\n===== 4. 动物王国中的食物链 =====");
// 经典测试用例
const statements1: number[][] = [
  [1, 1, 2],   // 1 和 2 是同类
  [2, 2, 3],   // 2 吃 3
  [2, 3, 1],   // 3 吃 1 → 矛盾（1和2同类，2吃3，则1吃3，3不应吃1）
  [1, 1, 3],   // 1 和 3 是同类 → 矛盾
  [2, 3, 1],   // 3 吃 1 → 矛盾
  [1, 5, 5],   // 5 和 5 是同类 → 矛盾（自己和自己同类算合法）
  [2, 5, 5],   // 5 吃 5 → 矛盾
];
console.log("带权并查集 假话数:", foodChain(5, statements1)); // 3
console.log("扩展域并查集 假话数:", foodChainExtended(5, statements1)); // 3

// 简单测试
const statements2: number[][] = [
  [1, 1, 2],   // 1 和 2 是同类 ✓
  [2, 1, 3],   // 1 吃 3 ✓
  [2, 3, 2],   // 3 吃 2 ✓（食物链：1吃3，3吃2，2吃1，循环）
];
console.log("带权并查集(无假话):", foodChain(3, statements2)); // 0
console.log("扩展域并查集(无假话):", foodChainExtended(3, statements2)); // 0

export {};
