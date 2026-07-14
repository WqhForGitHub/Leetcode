// ============================================================
// 138. 用户网站访问行为分析
// ============================================================
// LeetCode 1152. Analyze User Website Visit Pattern
// 给定用户名数组 username、时间戳数组 timestamp、网站数组 website，
// 找出被最多用户访问过的长度为 3 的访问序列；若存在多个，返回字典序最小者。

// 方法1：按时间排序 + 按用户分组 + 枚举每个用户的所有 3-序列 + 计数
// 时间复杂度：O(n log n + U * C^3)，U 为用户数，C 为单个用户访问的网站数。
// 注意：题目要求按"用户"计数，即同一用户访问相同 3-序列只算一次。
function mostVisitedPattern(username: string[], timestamp: number[], website: string[]): string[] {
  const n = username.length;
  // 1. 将三元组按时间排序
  const visits: Array<{ user: string; time: number; site: string }> = [];
  for (let i = 0; i < n; i++) {
    visits.push({ user: username[i], time: timestamp[i], site: website[i] });
  }
  visits.sort((a, b) => a.time - b.time);

  // 2. 按用户分组，记录其按时间排序后的网站访问序列
  const userSites = new Map<string, string[]>();
  for (const v of visits) {
    if (!userSites.has(v.user)) userSites.set(v.user, []);
    userSites.get(v.user)!.push(v.site);
  }

  // 3. 对每个用户枚举所有 3-序列（去重），统计全局计数
  const patternCount = new Map<string, number>();
  const patternFromKey = new Map<string, string[]>();

  for (const sites of userSites.values()) {
    if (sites.length < 3) continue;
    const seen = new Set<string>();
    const m = sites.length;
    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        for (let k = j + 1; k < m; k++) {
          const key = `${sites[i]}|${sites[j]}|${sites[k]}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (!patternFromKey.has(key)) {
            patternFromKey.set(key, [sites[i], sites[j], sites[k]]);
          }
          patternCount.set(key, (patternCount.get(key) ?? 0) + 1);
        }
      }
    }
  }

  // 4. 找出计数最大、字典序最小的模式
  let bestKey = "";
  let bestCount = -1;
  for (const [key, count] of patternCount) {
    if (count > bestCount || (count === bestCount && key < bestKey)) {
      bestCount = count;
      bestKey = key;
    }
  }
  return patternFromKey.get(bestKey) ?? [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 用户网站访问行为分析 =====");
console.log(
  "方法1:",
  mostVisitedPattern(
    ["joe", "joe", "joe", "james", "james", "james", "james", "mary", "mary", "mary"],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["home", "about", "career", "home", "cart", "maps", "home", "home", "about", "career"],
  ),
); // 期望: ["home","about","career"]

console.log(
  "方法1:",
  mostVisitedPattern(
    ["ua", "ua", "ua", "ub", "ub", "ub"],
    [1, 2, 3, 4, 5, 6],
    ["a", "b", "c", "a", "b", "c"],
  ),
); // 期望: ["a","b","c"]

console.log(
  "方法1:",
  mostVisitedPattern(
    ["dow", "dow", "dow", "bow", "bow", "bow"],
    [1, 2, 3, 4, 5, 6],
    ["a", "b", "c", "a", "b", "a"],
  ),
); // 期望: ["a","b","a"]

export {};
