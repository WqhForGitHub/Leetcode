// ============================================================
// 071. 字母组合迭代器
// ============================================================
// LeetCode 1286. Iterator for Combination
// 设计一个迭代器类 CombinationIterator：
//   - 构造函数接收字符串 characters（已按字典序排列，无重复字符）和整数 combinationLength。
//   - next() 返回下一个长度为 combinationLength 的组合（字典序）。
//   - hasNext() 返回是否还有下一个组合。
// 时间复杂度：构造 O(C(n, k) * k)，next O(k)，hasNext O(1)。

// 方法1：回溯预计算 (推荐)
// 在构造时使用回溯枚举所有长度为 combinationLength 的组合并按字典序存储到数组中，
// next/hasNext 只需维护一个索引指针即可，实现简单高效。
// 时间复杂度：构造 O(C(n, k) * k)，next O(k) 拼接字符串，hasNext O(1)
// 空间复杂度：O(C(n, k) * k) 存储所有组合
class CombinationIterator1 {
  private combinations: string[]; // 所有组合按字典序存储
  private index: number; // 当前迭代位置

  constructor(characters: string, combinationLength: number) {
    this.combinations = [];
    this.index = 0;
    // 回溯枚举所有组合
    const backtrack = (start: number, path: string[]): void => {
      if (path.length === combinationLength) {
        this.combinations.push(path.join(""));
        return;
      }
      // 剩余字符不足以凑够长度时剪枝
      const need: number = combinationLength - path.length;
      for (let i: number = start; i < characters.length; i++) {
        // 剪枝：剩余可用字符数不足
        if (characters.length - i < need) break;
        path.push(characters[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    };
    backtrack(0, []);
  }

  next(): string {
    return this.combinations[this.index++];
  }

  hasNext(): boolean {
    return this.index < this.combinations.length;
  }
}

// 方法2：位掩码迭代
// 用一个整数 mask 表示当前选中的字符下标集合，每次 next 用 Gosper's hack
// 找到下一个恰好有 combinationLength 个 1 的 mask，从中构造字符串。
// 不需要预存所有组合，节省内存。
// 时间复杂度：构造 O(1)，next O(n)，hasNext O(1)
// 空间复杂度：O(n) 仅存当前 mask 和长度
class CombinationIterator2 {
  private chars: string;
  private k: number;
  private mask: number; // 当前组合对应的位掩码

  constructor(characters: string, combinationLength: number) {
    this.chars = characters;
    this.k = combinationLength;
    // 初始 mask 为最低 k 位为 1：000..0111
    this.mask = (1 << combinationLength) - 1;
  }

  next(): string {
    const result: string = this.maskToString(this.mask);
    // 使用 Gosper's hack 移动到下一个 popcount = k 的状态
    this.mask = this.gosperNext(this.mask);
    return result;
  }

  hasNext(): boolean {
    // mask 不能超过 chars 长度对应的位数范围
    return this.mask < 1 << this.chars.length;
  }

  // 将 mask 转为对应字符串
  private maskToString(mask: number): string {
    let res: string = "";
    for (let i: number = 0; i < this.chars.length; i++) {
      if (mask & (1 << i)) {
        // mask 最低位对应 chars[0]，保证字典序
        res += this.chars[i];
      }
    }
    return res;
  }

  // Gosper's hack：求下一个具有相同 popcount 的整数
  private gosperNext(x: number): number {
    const c: number = x & -x;
    const r: number = x + c;
    return (((r ^ x) >> 2) / c) | r;
  }
}

// 方法3：下一个组合公式(字典序)
// 直接根据当前选中的下标数组，按字典序生成下一个组合的下标数组。
// 类似 C++ 中 next_combination 的实现。
// 时间复杂度：构造 O(k)，next O(k)，hasNext O(1)
// 空间复杂度：O(k) 仅存下标数组
class CombinationIterator3 {
  private chars: string;
  private indices: number[]; // 当前组合对应的下标
  private n: number;
  private done: boolean;

  constructor(characters: string, combinationLength: number) {
    this.chars = characters;
    this.n = characters.length;
    this.indices = [];
    for (let i: number = 0; i < combinationLength; i++) {
      this.indices.push(i);
    }
    this.done = combinationLength > this.n;
  }

  next(): string {
    let res: string = "";
    for (const idx of this.indices) res += this.chars[idx];
    this.advance();
    return res;
  }

  hasNext(): boolean {
    return !this.done;
  }

  // 按字典序推进到下一个组合
  private advance(): void {
    const k: number = this.indices.length;
    let i: number = k - 1;
    // 从右向左找到第一个还能 +1 的位置
    while (i >= 0 && this.indices[i] === this.n - k + i) i--;
    if (i < 0) {
      this.done = true;
      return;
    }
    this.indices[i]++;
    for (let j: number = i + 1; j < k; j++) {
      this.indices[j] = this.indices[j - 1] + 1;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 字母组合迭代器 =====");

// 测试方法1
const iter1 = new CombinationIterator1("abc", 2);
const result1: string[] = [];
while (iter1.hasNext()) result1.push(iter1.next());
console.log("方法1:", result1); // 期望结果: ["ab","ac","bc"]

// 测试方法2
const iter2 = new CombinationIterator2("abc", 2);
const result2: string[] = [];
while (iter2.hasNext()) result2.push(iter2.next());
console.log("方法2:", result2); // 期望结果: ["ab","ac","bc"]

// 测试方法3
const iter3 = new CombinationIterator3("abc", 2);
const result3: string[] = [];
while (iter3.hasNext()) result3.push(iter3.next());
console.log("方法3:", result3); // 期望结果: ["ab","ac","bc"]

// 测试单独调用 next/hasNext
const iter4 = new CombinationIterator1("chp", 1);
console.log(iter4.hasNext(), iter4.next(), iter4.hasNext(), iter4.next()); // 期望: true 'c' true 'h'

export {};
