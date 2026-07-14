// ============================================================
// 031. 列举单词的全部缩写
// ============================================================
// LeetCode 320. Generalized Abbreviation
// 给定一个单词，生成所有可能的缩写。例如 "word" -> ["word","1ord","w1rd","wo1d","wor1","2rd","w2d","wo2d","1o1d","1or1","w1r1","1o2","2r1","3d","w3","4"]
// 时间复杂度：O(n * 2^n), 空间复杂度：O(n)

// 方法1：回溯 (推荐)
// 对每个位置，选择保留字符或缩写（计数）
// 时间复杂度 O(n * 2^n), 空间复杂度 O(n)
function generateAbbreviations(word: string): string[] {
  const n: number = word.length;
  const result: string[] = [];

  // pos: 当前位置
  // current: 已构建的字符串
  // count: 当前连续缩写的字符数
  function backtrack(pos: number, current: string, count: number): void {
    if (pos === n) {
      // 处理末尾的计数
      if (count > 0) {
        result.push(current + count);
      } else {
        result.push(current);
      }
      return;
    }

    // 选择1：缩写当前位置（不写字符，增加计数）
    backtrack(pos + 1, current, count + 1);

    // 选择2：保留当前位置的字符（先输出计数，再输出字符）
    const newCurrent: string = current + (count > 0 ? count.toString() : "") + word[pos];
    backtrack(pos + 1, newCurrent, 0);
  }

  backtrack(0, "", 0);
  return result;
}

// 方法2：位掩码枚举
// 用n位二进制数表示每个位置是保留(0)还是缩写(1)，枚举所有2^n种可能
// 时间复杂度 O(n * 2^n), 空间复杂度 O(n)
function generateAbbreviations2(word: string): string[] {
  const n: number = word.length;
  const result: string[] = [];

  for (let mask: number = 0; mask < 1 << n; mask++) {
    let abbr: string = "";
    let count: number = 0;
    for (let i: number = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // 缩写位置i
        count++;
      } else {
        // 保留位置i
        if (count > 0) {
          abbr += count;
          count = 0;
        }
        abbr += word[i];
      }
    }
    if (count > 0) abbr += count;
    result.push(abbr);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 列举单词的全部缩写 =====");
const abbrs1: string[] = generateAbbreviations("word");
console.log(abbrs1); // 期望结果: 16个缩写
console.log("数量:", abbrs1.length); // 期望: 16
console.log("包含'word':", abbrs1.includes("word")); // 期望: true
console.log("包含'4':", abbrs1.includes("4")); // 期望: true

const abbrs2: string[] = generateAbbreviations2("word");
console.log(abbrs2);
console.log("数量:", abbrs2.length); // 期望: 16

export {};
