// ============================================================
// 072. 屏幕可显示句子的数量
// ============================================================
// LeetCode 418. Sentence Screen Fitting
// 给定句子单词数组和屏幕 rows 行 cols 列，每个单词间至少一个空格，单词不可断行，
// 求能显示完整句子的次数。
// 时间复杂度 O(rows * avg_word_len)

// 方法1：DP/模拟 - 预计算每行起始单词的转移（推荐）
// 对于每个起始单词索引，预计算一行结束后下一个起始单词索引和完成的句子数。
// 然后逐行模拟，累计句子数。
// 时间复杂度 O(n * cols / avg_word_len + rows)，空间复杂度 O(n)
function wordsTyping(sentence: string[], rows: number, cols: number): number {
  const n: number = sentence.length;
  // nextStart[i] 表示从第 i 个单词开始填一行后，下一行的起始单词索引
  const nextStart: number[] = new Array(n);
  // cnt[i] 表示从第 i 个单词开始填一行，完成的句子数
  const cnt: number[] = new Array(n);

  // 预计算每个起始单词索引的情况
  for (let i: number = 0; i < n; i++) {
    let pos: number = 0; // 当前列位置
    let idx: number = i; // 当前单词索引
    let count: number = 0; // 完成的句子数
    // 尝试在当前行放入尽可能多的单词
    while (pos + sentence[idx].length <= cols) {
      pos += sentence[idx].length;
      idx++;
      // 如果完成一个完整句子，计数加一
      if (idx === n) {
        idx = 0;
        count++;
      }
      // 如果还有空间放空格
      if (pos < cols) {
        pos++;
      } else {
        break;
      }
    }
    nextStart[i] = idx;
    cnt[i] = count;
  }

  // 逐行模拟，累计句子数
  let total: number = 0;
  let cur: number = 0; // 当前行起始单词索引
  for (let r: number = 0; r < rows; r++) {
    total += cnt[cur];
    cur = nextStart[cur];
  }
  return total;
}

// 方法2：直接模拟逐行填充
// 不预计算，直接逐行逐单词填入屏幕，统计完整句子数。
// 时间复杂度 O(rows * words_per_row)，空间复杂度 O(1)
function wordsTyping2(sentence: string[], rows: number, cols: number): number {
  const n: number = sentence.length;
  let count: number = 0;
  let idx: number = 0; // 当前单词索引
  for (let r: number = 0; r < rows; r++) {
    let pos: number = 0; // 当前列位置
    // 尝试在当前行放入尽可能多的单词
    while (pos + sentence[idx].length <= cols) {
      pos += sentence[idx].length;
      idx++;
      // 如果完成一个完整句子
      if (idx === n) {
        idx = 0;
        count++;
      }
      // 如果还有空间放空格
      if (pos < cols) {
        pos++;
      } else {
        break;
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 屏幕可显示句子的数量 =====");
console.log(wordsTyping(["hello", "world"], 2, 8)); // 期望结果: 1
console.log(wordsTyping(["a", "bcd", "e"], 3, 6)); // 期望结果: 2
console.log(wordsTyping(["I", "had", "apple", "pie"], 4, 5)); // 期望结果: 1
console.log(wordsTyping(["hello", "world"], 1, 11)); // 期望结果: 1
console.log(wordsTyping(["a", "b", "c"], 3, 3)); // 期望结果: 1

export {};
