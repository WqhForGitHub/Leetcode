// ============================================================
// 192. 最多的不重叠子字符串
// ============================================================
// LeetCode 1520. Maximum Number of Non-Overlapping Substrings
// 给定字符串 s，找出最多数目的不重叠子字符串，使其满足“有效性”：
// 子串中出现的每个字符，其所有出现都在该子串内。
// 若数目相同，返回总长度最短的方案。返回字符串数组。

// 方法1：按位置扩展区间 + 按右端点贪心（O(n * |Σ|)）
function maxNumOfSubstrings(s: string): string[] {
  const n = s.length;
  const first = new Map<string, number>();
  const last = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const c = s[i];
    if (!first.has(c)) first.set(c, i);
    last.set(c, i);
  }

  // 从起点 l 计算最小有效子串，返回 [l, r] 或 null
  const closure = (l: number): [number, number] | null => {
    let r = last.get(s[l])!;
    let i = l;
    while (i <= r) {
      const c = s[i];
      if (first.get(c)! < l) return null; // 该字符在 l 之前出现，无法以 l 为起点
      if (last.get(c)! > r) r = last.get(c)!;
      i++;
    }
    return [l, r];
  };

  const intervals: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    if (i === first.get(s[i])) {
      const res = closure(i);
      if (res) intervals.push(res);
    }
  }

  // 按右端点升序贪心选取
  intervals.sort((a, b) => a[1] - b[1]);
  const result: string[] = [];
  let lastEnd = -1;
  for (const [l, r] of intervals) {
    if (l > lastEnd) {
      result.push(s.slice(l, r + 1));
      lastEnd = r;
    }
  }
  return result;
}

// 方法2：按字符扩展区间 + 按右端点贪心（O(n * |Σ|)）
// 遍历 26 个字母，对每个出现过的字符以其首次出现位置为起点求闭包，去重后贪心。
function maxNumOfSubstrings2(s: string): string[] {
  const n = s.length;
  const first = new Map<string, number>();
  const last = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const c = s[i];
    if (!first.has(c)) first.set(c, i);
    last.set(c, i);
  }

  const closureFrom = (l: number): [number, number] | null => {
    let r = last.get(s[l])!;
    let i = l;
    while (i <= r) {
      const c = s[i];
      if (first.get(c)! < l) return null;
      if (last.get(c)! > r) r = last.get(c)!;
      i++;
    }
    return [l, r];
  };

  const seen = new Set<number>();
  const intervals: [number, number][] = [];
  // 遍历每个字符作为潜在起点
  for (const c of first.keys()) {
    const l = first.get(c)!;
    const res = closureFrom(l);
    if (res && !seen.has(res[0])) {
      seen.add(res[0]);
      intervals.push(res);
    }
  }

  intervals.sort((a, b) => a[1] - b[1]);
  const result: string[] = [];
  let lastEnd = -1;
  for (const [l, r] of intervals) {
    if (l > lastEnd) {
      result.push(s.slice(l, r + 1));
      lastEnd = r;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 192. 最多的不重叠子字符串 =====");
console.log('方法1 "adefaddaccc":', maxNumOfSubstrings("adefaddaccc")); // ["e","f","ccc"]
console.log('方法1 "abbaccd":', maxNumOfSubstrings("abbaccd")); // ["bb","cc","d"]
console.log('方法2 "adefaddaccc":', maxNumOfSubstrings2("adefaddaccc")); // ["e","f","ccc"]
console.log('方法2 "abbaccd":', maxNumOfSubstrings2("abbaccd")); // ["bb","cc","d"]

export {};
