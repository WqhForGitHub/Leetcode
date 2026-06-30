// ============================================================
// 006. 搜寻名人
// ============================================================
// LeetCode 277. Find the Celebrity
// n 个人，knows(a,b) API 已提供。名人：所有人都认识他、他不认识任何人。返回名人编号或 -1。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 假设 LeetCode 全局已提供 knows(a, b): boolean
declare function knows(a: number, b: number): boolean;

// 方法1：两轮扫描（推荐）
// 第一轮找候选：candidate 从 0 开始，若 candidate 认识 i，则 candidate 必非名人，改 candidate=i。
// 第二轮验证：candidate 不认识任何人、且所有人都认识 candidate。
function findCelebrity(n: number): number {
  let candidate = 0;
  for (let i = 1; i < n; i++) {
    if (knows(candidate, i)) candidate = i; // candidate 认识 i，必非名人
  }
  for (let i = 0; i < n; i++) {
    if (i === candidate) continue;
    if (knows(candidate, i) || !knows(i, candidate)) return -1;
  }
  return candidate;
}

// 方法2：暴力（O(n^2)，仅作对照）
function findCelebrityBrute(n: number): number {
  for (let i = 0; i < n; i++) {
    let isCeleb = true;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (knows(i, j)) {
        isCeleb = false; // i 认识别人
        break;
      }
      if (!knows(j, i)) {
        isCeleb = false; // 有人不认识 i
        break;
      }
    }
    if (isCeleb) return i;
  }
  return -1;
}

// ============================================================
// 测试（用邻接矩阵模拟 knows API）
// ============================================================
console.log("===== 006. 搜寻名人 =====");
const g = globalThis as unknown as { knows?: (a: number, b: number) => boolean; __matrix?: number[][] };
g.knows = (a: number, b: number): boolean => g.__matrix![a][b] === 1;
const runWith = (n: number, matrix: number[][]): number => {
  g.__matrix = matrix;
  return findCelebrity(n);
};
const runBruteWith = (n: number, matrix: number[][]): number => {
  g.__matrix = matrix;
  return findCelebrityBrute(n);
};
// 1 是名人：1 不认识任何人，其他人认识 1
const m1 = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0],
];
console.log("两轮扫描:", runWith(3, m1)); // 期望 1
console.log("暴力:", runBruteWith(3, m1)); // 期望 1
// 0 与 1 互相认识，无名人
const m2 = [
  [0, 1],
  [1, 0],
];
console.log("无名人:", runWith(2, m2)); // 期望 -1
console.log("暴力:", runBruteWith(2, m2)); // 期望 -1

export {};
