// ============================================================
// 44. 迭代压缩字符串
// ============================================================
// LeetCode 604. Design Compressed String Iterator
// 设计一个迭代器，对压缩字符串（如 "L1e2t1C1o1d1e1"）进行迭代，支持 next() 和 hasNext()。
// 时间复杂度：O(1) next/hasNext，O(n) 初始化

// 方法1：预解析存储字符和计数（推荐）
class StringIterator {
  // 字符列表，按出现顺序存储
  private chars: string[];
  // 计数列表，与 chars 一一对应
  private counts: number[];
  // 当前指向的字符索引
  private index: number;

  constructor(compressedString: string) {
    this.chars = [];
    this.counts = [];
    this.index = 0;

    let i = 0;
    while (i < compressedString.length) {
      // 读取一个字母字符
      const ch = compressedString[i];
      i++;
      // 紧接着读取连续的数字（可能多位）
      let numStr = "";
      while (i < compressedString.length && /\d/.test(compressedString[i])) {
        numStr += compressedString[i];
        i++;
      }
      this.chars.push(ch);
      this.counts.push(parseInt(numStr, 10));
    }
  }

  next(): string {
    if (!this.hasNext()) {
      return " ";
    }
    const ch = this.chars[this.index];
    // 当前字符剩余计数减 1
    this.counts[this.index]--;
    if (this.counts[this.index] === 0) {
      // 当前字符已用尽，移到下一个
      this.index++;
    }
    return ch;
  }

  hasNext(): boolean {
    // 当索引未超出范围且当前字符仍有剩余时返回 true
    return this.index < this.chars.length && this.counts[this.index] > 0;
  }
}

// 方法2：惰性解析
class StringIteratorLazy {
  private str: string;
  private ptr: number;
  private currentChar: string;
  private currentCount: number;

  constructor(compressedString: string) {
    this.str = compressedString;
    this.ptr = 0;
    this.currentChar = " ";
    this.currentCount = 0;
  }

  next(): string {
    if (!this.hasNext()) {
      return " ";
    }
    // 如果当前字符已耗尽，则解析下一个段
    if (this.currentCount === 0) {
      this.parseNext();
    }
    this.currentCount--;
    return this.currentChar;
  }

  hasNext(): boolean {
    // 当前字符还有剩余 或 字符串中还有未解析的内容
    if (this.currentCount > 0) {
      return true;
    }
    return this.ptr < this.str.length;
  }

  // 解析下一段字符及其计数
  private parseNext(): void {
    this.currentChar = this.str[this.ptr];
    this.ptr++;
    let numStr = "";
    while (this.ptr < this.str.length && /\d/.test(this.str[this.ptr])) {
      numStr += this.str[this.ptr];
      this.ptr++;
    }
    this.currentCount = parseInt(numStr, 10);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 44. 迭代压缩字符串 =====");
const iter1 = new StringIterator("L1e2t1C1o1d1e1");
console.log("预解析 next:", iter1.next()); // 期望结果: "L"
console.log("预解析 next:", iter1.next()); // 期望结果: "e"
console.log("预解析 next:", iter1.next()); // 期望结果: "e"
console.log("预解析 next:", iter1.next()); // 期望结果: "t"
console.log("预解析 hasNext:", iter1.hasNext()); // 期望结果: true

const iter2 = new StringIterator("x3y2");
const output2: string[] = [];
while (iter2.hasNext()) {
  output2.push(iter2.next());
}
console.log("预解析 全部展开:", output2); // 期望结果: ["x","x","x","y","y"]

const iter3 = new StringIteratorLazy("L1e2t1C1o1d1e1");
console.log("惰性 next:", iter3.next()); // 期望结果: "L"
console.log("惰性 next:", iter3.next()); // 期望结果: "e"
console.log("惰性 next:", iter3.next()); // 期望结果: "e"
console.log("惰性 next:", iter3.next()); // 期望结果: "t"
console.log("惰性 hasNext:", iter3.hasNext()); // 期望结果: true

export {};
