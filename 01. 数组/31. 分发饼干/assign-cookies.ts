// ============================================================
// 31. 分发饼干
// ============================================================
// LeetCode 455. Assign Cookies
// 给定孩子胃口数组 g 和饼干尺寸数组 s，每个孩子最多给一块饼干，求能满足多少孩子。
// 时间复杂度：O(n log n + m log m)，空间复杂度：O(1)

// 方法1：排序+双指针贪心（推荐）
function findContentChildren(g: number[], s: number[]): number {
  // 对胃口和饼干都进行升序排序
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0; // 孩子指针
  let cookie = 0; // 饼干指针

  // 贪心：用尽量小的饼干满足胃口尽量小的孩子
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      // 当前饼干可以满足当前孩子
      child++;
    }
    // 无论是否满足，饼干指针都后移（每块饼干只用一次）
    cookie++;
  }

  return child;
}

// 方法2：倒序贪心-用大饼干满足大胃口孩子
function findContentChildrenReverse(g: number[], s: number[]): number {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = g.length - 1;
  let cookie = s.length - 1;
  let count = 0;

  while (child >= 0 && cookie >= 0) {
    if (s[cookie] >= g[child]) {
      count++;
      cookie--;
    }
    child--;
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 31. 分发饼干 =====");
console.log("描述:", findContentChildren([1, 2, 3], [1, 1])); // 期望结果: 1
console.log("描述:", findContentChildren([1, 2], [1, 2, 3])); // 期望结果: 2
console.log("描述:", findContentChildren([10, 9, 8, 7], [5, 6, 7, 8])); // 期望结果: 2
console.log("描述:", findContentChildrenReverse([1, 2, 3], [1, 1])); // 期望结果: 1

export {};
