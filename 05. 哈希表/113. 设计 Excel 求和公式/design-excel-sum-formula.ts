// ============================================================
// 113. 设计 Excel 求和公式
// ============================================================
// LeetCode 631. Design Excel Sum Formula
// 设计 Excel 类，支持 set、get、sum。sum 可对矩形区域引用求和，
// 当被引用单元格变化时，依赖它的单元格自动更新。
// 时间复杂度：get O(1)，set/sum O(K)，K 为依赖链大小

class Excel {
  // H x W 的网格，H=26（行 1..26），W=26（列 A..Z）
  private grid: number[][];
  // 依赖关系：单元格 -> 它依赖的子单元格列表
  private children: Map<string, string[]>;
  // 反向依赖：单元格 -> 依赖它的父单元格列表
  private parents: Map<string, Set<string>>;

  constructor(private height: number, private width: number) {
    this.grid = Array.from({ length: height + 1 }, () =>
      new Array(width + 1).fill(0),
    );
    this.children = new Map();
    this.parents = new Map();
  }

  private key(r: number, c: number): string {
    return r + "," + c;
  }

  // 解析引用如 "A1" 或 "A1:B2"
  private parseRef(ref: string): number[][] {
    const result: number[][] = [];
    if (ref.includes(":")) {
      // 矩形区域
      const [start, end] = ref.split(":");
      const [c1, r1] = this.parseCell(start);
      const [c2, r2] = this.parseCell(end);
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          result.push([r, c]);
        }
      }
    } else {
      const [c, r] = this.parseCell(ref);
      result.push([r, c]);
    }
    return result;
  }

  // 解析单个单元格 "A1" -> [列, 行]
  private parseCell(cell: string): [number, number] {
    const col = cell.charCodeAt(0) - 64; // 'A' -> 1
    const row = parseInt(cell.slice(1));
    return [col, row];
  }

  // 清除单元格的依赖关系
  private clearDependencies(r: number, c: number): void {
    const k = this.key(r, c);
    const oldChildren = this.children.get(k) || [];
    for (const childKey of oldChildren) {
      const parents = this.parents.get(childKey);
      if (parents) {
        parents.delete(k);
      }
    }
    this.children.delete(k);
  }

  set(r: number, c: number, v: number): void {
    this.clearDependencies(r, c);
    this.grid[r][c] = v;
    // 传播更新：重新计算所有依赖此单元格的 sum 单元格
    this.propagate(r, c);
  }

  // 传播：当 (r,c) 变化时，重算所有父级 sum 单元格
  private propagate(r: number, c: number): void {
    const k = this.key(r, c);
    const parentSet = this.parents.get(k);
    if (!parentSet || parentSet.size === 0) return;
    // 复制一份避免遍历时修改
    for (const parentKey of Array.from(parentSet)) {
      const [pr, pc] = parentKey.split(",").map(Number);
      const childList = this.children.get(parentKey) || [];
      let sum = 0;
      for (const childKey of childList) {
        const [cr, cc] = childKey.split(",").map(Number);
        sum += this.grid[cr][cc];
      }
      this.grid[pr][pc] = sum;
      // 递归传播更上层
      this.propagate(pr, pc);
    }
  }

  get(r: number, c: number): number {
    return this.grid[r][c];
  }

  // sum(r, c, strs): 将 (r,c) 设为 strs 中所有引用的和
  sum(r: number, c: number, strs: string[]): number {
    this.clearDependencies(r, c);
    const k = this.key(r, c);
    const childList: string[] = [];

    let total = 0;
    for (const ref of strs) {
      const cells = this.parseRef(ref);
      for (const [cr, cc] of cells) {
        const childKey = this.key(cr, cc);
        childList.push(childKey);
        total += this.grid[cr][cc];
        // 建立反向依赖
        if (!this.parents.has(childKey)) {
          this.parents.set(childKey, new Set());
        }
        this.parents.get(childKey)!.add(k);
      }
    }
    this.children.set(k, childList);
    this.grid[r][c] = total;
    return total;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 设计 Excel 求和公式 =====");
const excel = new Excel(3, 26);
excel.set(1, 1, 1);
excel.set(1, 2, 2);
console.log(excel.sum(2, 1, ["A1", "B1"])); // 期望: 3
excel.set(1, 1, 5);
console.log(excel.get(2, 1)); // 期望: 7 (因依赖 A1 自动更新)
excel.set(2, 2, ["A1", "B1"].length > 0 ? 10 : 0); // 仅设值
console.log(excel.get(2, 2)); // 期望: 10

export {};
