// ============================================================
// 047. 分发饼干
// ============================================================
// LeetCode 455. Assign Cookies
// 每个孩子有贪心因子 g[i]，每块饼干有尺寸 s[j]。
// 当 s[j] >= g[i] 时该孩子满足。每块饼干最多分给一个孩子。
// 求最多能满足多少个孩子。

// 方法1：排序 + 贪心双指针（推荐，O(n log n + m log m) 时间，O(1) 额外空间）
// 将孩子和饼干都升序排序，用小饼干优先满足贪心因子小的孩子。
// 这样能让更多孩子被满足（不会浪费大饼干）。
function findContentChildren(g: number[], s: number[]): number {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0; // 孩子指针
  let cookie = 0; // 饼干指针

  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      // 当前饼干能满足当前孩子，分配并都前进一步
      child++;
      cookie++;
    } else {
      // 当前饼干太小，尝试下一块饼干
      cookie++;
    }
  }

  return child;
}

// 方法2：排序 + 从大到小贪心（O(n log n + m log m) 时间，O(1) 额外空间）
// 将孩子和饼干降序排序，用大饼干优先满足贪心因子大的孩子。
function findContentChildren_desc(g: number[], s: number[]): number {
  g.sort((a, b) => b - a);
  s.sort((a, b) => b - a);

  let child = 0;
  let cookie = 0;
  let satisfied = 0;

  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      satisfied++;
      child++;
      cookie++;
    } else {
      // 当前饼干太小，连最贪心的孩子都满足不了，尝试下一个贪心更小的孩子
      child++;
    }
  }

  return satisfied;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 分发饼干 =====");
console.log("升序 g=[1,2,3], s=[1,1]:", findContentChildren([1, 2, 3], [1, 1])); // 期望: 1
console.log("升序 g=[1,2], s=[1,2,3]:", findContentChildren([1, 2], [1, 2, 3])); // 期望: 2
console.log("升序 g=[10,9,8,7], s=[5,6,7,8]:", findContentChildren([10, 9, 8, 7], [5, 6, 7, 8])); // 期望: 2

console.log("降序 g=[1,2,3], s=[1,1]:", findContentChildren_desc([1, 2, 3], [1, 1])); // 期望: 1
console.log("降序 g=[1,2], s=[1,2,3]:", findContentChildren_desc([1, 2], [1, 2, 3])); // 期望: 2
console.log("降序 g=[10,9,8,7], s=[5,6,7,8]:", findContentChildren_desc([10, 9, 8, 7], [5, 6, 7, 8])); // 期望: 2

export {};
