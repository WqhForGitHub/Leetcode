// ============================================================
// 131. 最小公共区域
// ============================================================
// LeetCode 1257. Smallest Common Region
// 给定一个区域列表和两个区域 region1, region2，找到这两个区域的最小公共区域。
// 区域之间存在包含关系。列表中每个子列表的第一个区域包含其余区域。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表建父指针+集合
// 1) 用哈希表建立 每个区域 -> 其直接父区域 的映射
// 2) 从 region1 向上走到根，把路径上所有区域放入集合
// 3) 从 region2 向上走，第一个出现在集合中的就是最近公共祖先
function findSmallestRegion(
  regions: string[][],
  region1: string,
  region2: string
): string {
  // 建立 父指针 映射
  const parent = new Map<string, string>();
  for (const list of regions) {
    const p = list[0];
    for (let i = 1; i < list.length; i++) {
      parent.set(list[i], p);
    }
  }

  // 从 region1 向上走到根，路径放入集合
  const ancestors = new Set<string>();
  let curr: string | undefined = region1;
  while (curr !== undefined) {
    ancestors.add(curr);
    curr = parent.get(curr);
  }

  // 从 region2 向上走，找到第一个公共祖先
  curr = region2;
  while (curr !== undefined) {
    if (ancestors.has(curr)) return curr;
    curr = parent.get(curr);
  }
  return "";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 最小公共区域 =====");

// 测试1:
// regions = [["Earth","North America","South America"],
//            ["North America","United States","Canada"],
//            ["United States","New York","Boston"],
//            ["Canada","Ontario","Quebec"],
//            ["South America","Brazil"]]
// region1 = "Quebec", region2 = "New York"
// Quebec -> Canada -> North America
// New York -> United States -> North America
// LCA = "North America"
console.log(
  "测试1:",
  findSmallestRegion(
    [
      ["Earth", "North America", "South America"],
      ["North America", "United States", "Canada"],
      ["United States", "New York", "Boston"],
      ["Canada", "Ontario", "Quebec"],
      ["South America", "Brazil"],
    ],
    "Quebec",
    "New York"
  )
); // 期望 "North America"

// 测试2: region1 和 region2 同层，LCA 为父
console.log(
  "测试2:",
  findSmallestRegion(
    [
      ["Earth", "North America", "South America"],
      ["North America", "United States", "Canada"],
      ["United States", "New York", "Boston"],
      ["Canada", "Ontario", "Quebec"],
      ["South America", "Brazil"],
    ],
    "Ontario",
    "Quebec"
  )
); // 期望 "Canada"

// 测试3: 一个区域是另一个区域的祖先
console.log(
  "测试3:",
  findSmallestRegion(
    [
      ["Earth", "North America", "South America"],
      ["North America", "United States", "Canada"],
      ["United States", "New York", "Boston"],
      ["Canada", "Ontario", "Quebec"],
      ["South America", "Brazil"],
    ],
    "Canada",
    "Quebec"
  )
); // 期望 "Canada"

export {};
