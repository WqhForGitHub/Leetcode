// ============================================================
// 140. 比较字符串最小字母出现频次
// ============================================================
// LeetCode 1170. Compare Strings by Frequency of the Smallest Character
// 定义 f(s) = s 中字典序最小字符的出现次数。
// 对每个查询 query，返回 words 中满足 f(word) > f(query) 的单词个数。

// 计算 f(s)：字符串中字典序最小字符的出现次数
function f(s: string): number {
  let minChar = "z";
  let count = 0;
  for (const ch of s) {
    if (ch < minChar) {
      minChar = ch;
      count = 1;
    } else if (ch === minChar) {
      count++;
    }
  }
  return count;
}

// 方法1：排序 + 二分查找（推荐，时间 O((n + m) * L + n log n)）
// 先计算所有 word 的 f 值并排序，对每个 query 用二分找第一个大于 f(query) 的位置。
function numSmallerByFrequency(queries: string[], words: string[]): number[] {
  const wordF: number[] = words.map((w) => f(w));
  wordF.sort((a, b) => a - b);
  const n = wordF.length;

  const result: number[] = [];
  for (const q of queries) {
    const fq = f(q);
    // 找到第一个严格大于 fq 的下标 left
    let left = 0;
    let right = n;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (wordF[mid] <= fq) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    result.push(n - left);
  }
  return result;
}

// 方法2：计数排序 + 后缀和（时间 O((n + m) * L + 12)）
// f 值范围仅为 1..11（最长单词 10 个字符，全相同则 f=10；查询单词最长 10 个，f 最大 10；
// 但 word 的 f 可达 10。题目约定最长 10 字符，故 f 取值 1..10；用 1..11 容错即可）。
function numSmallerByFrequency2(queries: string[], words: string[]): number[] {
  // 计数 wordF 的频次
  const count = new Array(12).fill(0); // 下标 1..11
  for (const w of words) {
    count[f(w)]++;
  }
  // 后缀和：suffix[i] = f 值 > i 的 word 数量
  const suffix = new Array(12).fill(0);
  suffix[11] = 0;
  for (let i = 10; i >= 1; i--) {
    suffix[i] = suffix[i + 1] + count[i + 1];
  }
  // 注意：suffix[i] 表示 f(word) > i 的数量
  const result: number[] = [];
  for (const q of queries) {
    result.push(suffix[f(q)]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 140. 比较字符串最小字母出现频次 =====");
console.log("方法1:", numSmallerByFrequency(["cbd"], ["zaaaz"])); // 期望: [1]
console.log("方法1:", numSmallerByFrequency(["bbb", "cc"], ["a", "aa", "aaa", "aaaa"])); // 期望: [1,2]
console.log("方法2:", numSmallerByFrequency2(["cbd"], ["zaaaz"])); // 期望: [1]
console.log("方法2:", numSmallerByFrequency2(["bbb", "cc"], ["a", "aa", "aaa", "aaaa"])); // 期望: [1,2]

export {};
