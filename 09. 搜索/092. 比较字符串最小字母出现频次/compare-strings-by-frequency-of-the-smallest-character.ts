// ============================================================
// 092. 比较字符串最小字母出现频次
// ============================================================
// LeetCode 1170. Compare Strings by Frequency of the Smallest Character
// f(s) = s 中最小字母出现次数。对 queries 中每个字符串，
// 返回 words 中 f(w) > f(query) 的个数。

// 方法1：排序 + 二分查找
function numSmallerByFrequency(queries: string[], words: string[]): number[] {
  const wordFreqs = words.map((w) => f(w)).sort((a, b) => a - b);
  const result: number[] = [];
  for (const q of queries) {
    const qf = f(q);
    // 二分找第一个 > qf 的位置
    let lo = 0;
    let hi = wordFreqs.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (wordFreqs[mid] <= qf) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    result.push(wordFreqs.length - lo);
  }
  return result;
}

function f(s: string): number {
  const sorted = s.split("").sort().join("");
  let count = 0;
  const minChar = sorted[0];
  for (const ch of sorted) {
    if (ch === minChar) count++;
    else break;
  }
  return count;
}

// 方法2：计数排序
function numSmallerByFrequencyCount(queries: string[], words: string[]): number[] {
  // f 的取值范围 1-10
  const count = new Array(12).fill(0);
  for (const w of words) {
    count[f(w)]++;
  }
  // 后缀和
  for (let i = 10; i >= 1; i--) {
    count[i] += count[i + 1];
  }
  const result: number[] = [];
  for (const q of queries) {
    result.push(count[f(q) + 1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 比较字符串最小字母出现频次 =====");
console.log("二分 ['cbd'],['zaaaz']:", numSmallerByFrequency(["cbd"], ["zaaaz"])); // [1]
console.log(
  "二分 ['bbb','cc'],['a','aa','aaa','aaaa']:",
  numSmallerByFrequency(["bbb", "cc"], ["a", "aa", "aaa", "aaaa"]),
); // [1,2]

export {};
