// ============================================================
// 134. 有重复字符串的排列组合
// ============================================================
// 面试金典 CCI 08.08. 有重复字符串的排列组合
// 给定一个可能含重复字符的字符串，返回所有不重复的排列。
// 时间复杂度：O(N*N!), 空间复杂度：O(N)

// 方法1：排序+回溯+去重 (推荐)
// 先排序使相同字符相邻，回溯时若当前字符与前一个相同且前一个未被使用，则跳过。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permutationsWithDup(s: string): string[] {
  const chars: string[] = s.split("").sort();
  const n: number = chars.length;
  const result: string[] = [];
  const path: string[] = [];
  const used: boolean[] = new Array(n).fill(false);

  const backtrack = (): void => {
    if (path.length === n) {
      result.push(path.join(""));
      return;
    }
    for (let i: number = 0; i < n; i++) {
      if (used[i]) {
        continue;
      }
      // 去重：相同字符同层只取第一个未使用的
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) {
        continue;
      }
      used[i] = true;
      path.push(chars[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

// 方法2：计数+回溯
// 统计每个字符出现次数，按不同字符值回溯选取，天然去重。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permutationsWithDupCount(s: string): string[] {
  const count: Map<string, number> = new Map();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }
  const keys: string[] = [...count.keys()].sort();
  const n: number = s.length;
  const result: string[] = [];
  const path: string[] = [];

  const backtrack = (): void => {
    if (path.length === n) {
      result.push(path.join(""));
      return;
    }
    for (const k of keys) {
      const cnt: number = count.get(k) ?? 0;
      if (cnt === 0) {
        continue;
      }
      count.set(k, cnt - 1);
      path.push(k);
      backtrack();
      path.pop();
      count.set(k, cnt);
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 有重复字符串的排列组合 =====");
console.log(permutationsWithDup("aab"));
// 期望结果: ["aab","aba","baa"]
console.log(permutationsWithDupCount("aab"));
console.log(permutationsWithDup("abc"));
// 期望结果: 6 个排列
console.log(permutationsWithDupCount("aabb"));
// 期望结果: 6 个排列: aabb, abab, abba, baab, baba, bbaa

export {};
