// ============================================================
// 010. 字母异位词分组
// ============================================================
// LeetCode 49. Group Anagrams
// 将字母异位词组合在一起。用排序后的字符串作为 key。
// 时间复杂度：O(n * k log k)，空间复杂度：O(n * k)

function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const str of strs) {
    // 对字符排序作为哈希 key
    const key = str.split("").sort().join("");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }
  return Array.from(map.values());
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 字母异位词分组 =====");
console.log("测试1:", groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// 预期: [["eat","tea","ate"],["tan","nat"],["bat"]]
console.log("测试2:", groupAnagrams([""])); // 预期: [[""]]
console.log("测试3:", groupAnagrams(["a"])); // 预期: [["a"]]

export {};
