// ============================================================
// 016. 设计 Excel 求和公式
// ============================================================
// LeetCode 631. Design Excel Sum Formula
// 设计 Excel：set(r,c,v)、get(r,c)、sum(r,c,strs) 将单元格设为对一组矩形区域求和。
// 支持链式依赖更新。
// 时间复杂度：懒求值 get 最坏 O(引用数)；每次写后 O(公式数) 重算

// 解析单元格引用 "A1" -> [row, col]（1-indexed）
function parseCell(s: string): [number, number] {
  let i = 0;
  while (i < s.length && /[A-Z]/.test(s[i])) i++;
  const colStr = s.slice(0, i);
  const rowStr = s.slice(i);
  let col = 0;
  for (const ch of colStr) {
    col = col * 26 + (ch.charCodeAt(0) - "A".charCodeAt(0) + 1);
  }
  return [parseInt(rowStr, 10), col];
}

// 解析引用，可能是单格 "A1" 或矩形 "A1:B2" -> [r1,c1,r2,c2]
function parseRef(s: string): [number, number, number, number] {
  if (s.includes(":")) {
    const [a, b] = s.split(":");
    const [r1, c1] = parseCell(a);
    const [r2, c2] = parseCell(b);
    return [Math.min(r1, r2), Math.min(c1, c2), Math.max(r1, r2), Math.max(c1, c2)];
  }
  const [r, c] = parseCell(s);
  return [r, c, r, c];
}

// 方法1：懒求值（推荐）
// 公式单元格不存值，get 时按依赖 DAG 递归计算，单次 get 内做记忆化
class Excel {
  private H: number;
  private W: number;
  private val: number[][];
  private formula: ([number, number, number, number][] | null)[][];

  constructor(H: number, W: string) {
    this.H = H;
    this.W = W.charCodeAt(0) - "A".charCodeAt(0) + 1;
    this.val = Array.from({ length: H + 1 }, () => new Array(this.W + 1).fill(0));
    this.formula = Array.from({ length: H + 1 }, () =>
      new Array(this.W + 1).fill(null),
    );
  }

  private col(c: string): number {
    return c.charCodeAt(0) - "A".charCodeAt(0) + 1;
  }

  set(r: number, c: string, v: number): void {
    const col = this.col(c);
    this.formula[r][col] = null;
    this.val[r][col] = v;
  }

  get(r: number, c: string): number {
    return this.getInternal(r, this.col(c), new Map<string, number>());
  }

  private getInternal(r: number, c: number, memo: Map<string, number>): number {
    const key = r + "," + c;
    if (memo.has(key)) return memo.get(key)!;
    const f = this.formula[r][c];
    let res: number;
    if (f === null) {
      res = this.val[r][c];
    } else {
      res = 0;
      for (const [r1, c1, r2, c2] of f) {
        for (let rr = r1; rr <= r2; rr++) {
          for (let cc = c1; cc <= c2; cc++) {
            res += this.getInternal(rr, cc, memo);
          }
        }
      }
    }
    memo.set(key, res);
    return res;
  }

  sum(r: number, c: string, strs: string[]): number {
    const col = this.col(c);
    this.formula[r][col] = strs.map((s) => parseRef(s));
    this.val[r][col] = 0;
    return this.get(r, c);
  }
}

// 方法2：预计算 + 拓扑重算
// 每次 set/sum 后对所有公式单元格做拓扑排序并重算，get 直接返回存储值
class ExcelTopo {
  private H: number;
  private W: number;
  private val: number[][];
  private formula: ([number, number, number, number][] | null)[][];

  constructor(H: number, W: string) {
    this.H = H;
    this.W = W.charCodeAt(0) - "A".charCodeAt(0) + 1;
    this.val = Array.from({ length: H + 1 }, () => new Array(this.W + 1).fill(0));
    this.formula = Array.from({ length: H + 1 }, () =>
      new Array(this.W + 1).fill(null),
    );
  }

  private col(c: string): number {
    return c.charCodeAt(0) - "A".charCodeAt(0) + 1;
  }

  set(r: number, c: string, v: number): void {
    const col = this.col(c);
    this.formula[r][col] = null;
    this.val[r][col] = v;
    this.recompute();
  }

  get(r: number, c: string): number {
    return this.val[r][this.col(c)];
  }

  sum(r: number, c: string, strs: string[]): number {
    const col = this.col(c);
    this.formula[r][col] = strs.map((s) => parseRef(s));
    this.recompute();
    return this.val[r][col];
  }

  private recompute(): void {
    // 收集所有公式单元格
    const fcells: [number, number][] = [];
    for (let r = 1; r <= this.H; r++) {
      for (let c = 1; c <= this.W; c++) {
        if (this.formula[r][c] !== null) fcells.push([r, c]);
      }
    }
    const key = (r: number, c: number): string => r + "," + c;
    const isFormula = new Set<string>();
    for (const [r, c] of fcells) isFormula.add(key(r, c));

    // 依赖图：被引用的公式单元格 -> 当前公式单元格
    const adj = new Map<string, string[]>();
    const indeg = new Map<string, number>();
    for (const [r, c] of fcells) {
      adj.set(key(r, c), []);
      indeg.set(key(r, c), 0);
    }
    for (const [r, c] of fcells) {
      const deps = new Set<string>();
      for (const [r1, c1, r2, c2] of this.formula[r][c]!) {
        for (let rr = r1; rr <= r2; rr++) {
          for (let cc = c1; cc <= c2; cc++) {
            if (isFormula.has(key(rr, cc))) deps.add(key(rr, cc));
          }
        }
      }
      for (const d of deps) {
        adj.get(d)!.push(key(r, c));
        indeg.set(key(r, c), indeg.get(key(r, c))! + 1);
      }
    }

    // Kahn 拓扑排序，按序累加求和
    const queue: string[] = [];
    for (const [k, d] of indeg) if (d === 0) queue.push(k);
    while (queue.length > 0) {
      const k = queue.shift()!;
      const [r, c] = k.split(",").map(Number);
      let s = 0;
      for (const [r1, c1, r2, c2] of this.formula[r][c]!) {
        for (let rr = r1; rr <= r2; rr++) {
          for (let cc = c1; cc <= c2; cc++) {
            s += this.val[rr][cc];
          }
        }
      }
      this.val[r][c] = s;
      for (const nb of adj.get(k)!) {
        indeg.set(nb, indeg.get(nb)! - 1);
        if (indeg.get(nb) === 0) queue.push(nb);
      }
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 设计 Excel 求和公式 =====");
// 懒求值版本
const ex = new Excel(3, "C");
ex.set(1, "A", 5);
console.log(ex.sum(1, "C", ["A1", "A1:B2"])); // 10
ex.set(2, "B", 3);
console.log(ex.get(1, "C")); // 13
ex.set(1, "A", 10);
console.log(ex.get(1, "C")); // 23（A1=10 + A1:B2=13）

// 预计算版本
const ex2 = new ExcelTopo(3, "C");
ex2.set(1, "A", 5);
console.log(ex2.sum(1, "C", ["A1", "A1:B2"])); // 10
ex2.set(2, "B", 3);
console.log(ex2.get(1, "C")); // 13
ex2.set(1, "A", 10);
console.log(ex2.get(1, "C")); // 23（A1=10 + A1:B2=13）

export {};
