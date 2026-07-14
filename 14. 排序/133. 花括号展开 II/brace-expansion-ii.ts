// ============================================================
// 133. 花括号展开 II
// ============================================================
// LeetCode 1096. Brace Expansion II
// 文法规则：{a,b} 表示 a 或 b（并集），并列表示拼接，可嵌套。
// 返回所有可生成单词，按字典序升序去重排列。

// 方法1：递归下降解析，每一步返回字符串集合（O(n * result)）
// 文法：
//   expression -> term (',' term)*      // 并集
//   term       -> factor+               // 拼接
//   factor     -> letter | '{' expression '}'

class BraceParser {
  private s: string;
  private i: number;

  constructor(s: string) {
    this.s = s;
    this.i = 0;
  }

  // 解析 expression，返回其可生成的所有字符串集合
  parseExpression(): Set<string> {
    const result = this.parseTerm();
    while (this.i < this.s.length && this.s[this.i] === ",") {
      this.i++; // 跳过 ','
      const next = this.parseTerm();
      for (const w of next) result.add(w);
    }
    return result;
  }

  // 解析 term：一个或多个 factor 拼接
  private parseTerm(): Set<string> {
    let result = new Set<string>([""]);
    while (this.i < this.s.length && this.s[this.i] !== "," && this.s[this.i] !== "}") {
      const factor = this.parseFactor();
      const merged = new Set<string>();
      for (const prefix of result) {
        for (const suffix of factor) {
          merged.add(prefix + suffix);
        }
      }
      result = merged;
    }
    return result;
  }

  // 解析 factor：单个字母 或 '{' expression '}'
  private parseFactor(): Set<string> {
    if (this.s[this.i] === "{") {
      this.i++; // 跳过 '{'
      const inner = this.parseExpression();
      // 期望 '}'
      if (this.i < this.s.length && this.s[this.i] === "}") this.i++;
      return inner;
    }
    // 单个字母
    const ch = this.s[this.i];
    this.i++;
    return new Set<string>([ch]);
  }
}

function braceExpansionII(expression: string): string[] {
  const parser = new BraceParser(expression);
  const set = parser.parseExpression();
  const result = Array.from(set).sort();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 花括号展开 II =====");
console.log(braceExpansionII("{a,b}{c,{d,e}}")); // 期望: ["ac","ad","ae","bc","bd","be"]
console.log(braceExpansionII("{{a,z},a{b,c},{ab,z}}")); // 期望: ["a","ab","ac","z"]
console.log(braceExpansionII("{a,b}c{d,e}")); // 期望: ["acd","ace","bcd","bce"]
console.log(braceExpansionII("a{b,c}")); // 期望: ["ab","ac"]

export {};
