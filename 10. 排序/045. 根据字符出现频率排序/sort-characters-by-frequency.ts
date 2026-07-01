// ============================================================
// 045. 根据字符出现频率排序
// ============================================================
// LeetCode 451. Sort Characters By Frequency
// 按字符出现频率降序排列，返回排列后的字符串。同频率字符顺序任意。

// 方法1：桶排序按频率（推荐，O(n) 时间，O(n) 空间）
// 统计每个字符频率后，以频率作为桶下标收集字符，再从高到低拼接。
function frequencySort_bucket(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  // 桶下标为频率，范围 1..n
  const n = s.length;
  const buckets: string[][] = Array.from({ length: n + 1 }, () => []);
  for (const [ch, count] of freq) {
    buckets[count].push(ch);
  }

  let result = "";
  for (let f = n; f >= 1; f--) {
    for (const ch of buckets[f]) {
      result += ch.repeat(f);
    }
  }
  return result;
}

// 方法2：按频率排序（O(n + k log k) 时间，O(n) 空间，k 为不同字符数）
// 统计频率后对字符按频率降序排序，再按频率重复拼接。
function frequencySort_sort(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  const chars = Array.from(freq.keys());
  chars.sort((a, b) => freq.get(b)! - freq.get(a)!);

  let result = "";
  for (const ch of chars) {
    result += ch.repeat(freq.get(ch)!);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 根据字符出现频率排序 =====");
console.log("桶排序 'tree':", frequencySort_bucket("tree")); // 期望: 'eert' 或 'eetr'
console.log("桶排序 'cccaaa':", frequencySort_bucket("cccaaa")); // 期望: 'aaaccc' 或 'cccaaa'
console.log("桶排序 'Aabb':", frequencySort_bucket("Aabb")); // 期望: 'bbAa' 或 'bbaA'

console.log("排序 'tree':", frequencySort_sort("tree")); // 期望: 'eert' 或 'eetr'
console.log("排序 'cccaaa':", frequencySort_sort("cccaaa")); // 期望: 'aaaccc' 或 'cccaaa'
console.log("排序 'Aabb':", frequencySort_sort("Aabb")); // 期望: 'bbAa' 或 'bbaA'

export {};
