// ============================================================
// 090. 适龄的朋友
// ============================================================
// LeetCode 825. Friends Of Appropriate Ages
// 给定年龄数组 ages，A 向 B 发送好友请求需满足：
//   1) age[B] > 0.5 * age[A] + 7
//   2) age[B] <= age[A]
//   3) 不满足 (age[B] > 100 且 age[A] < 100)
// 注意：A 不会向自己发请求。统计总请求数。

// 方法1：计数排序 + 前缀和（推荐，O(n + 121^2) 时间，O(121) 空间）
// 年龄范围 1..120，用 count[age] 统计人数，prefix[age] 为前缀和。
// 对每个年龄 A，有效 B 的年龄区间为 (0.5*A+7, A]，
// 区间内人数 = prefix[A] - prefix[lower-1]，再减去自身 count[A]。
function numFriendRequests(ages: number[]): number {
  const count = new Array(121).fill(0);
  for (const a of ages) {
    count[a]++;
  }
  // prefix[i] = count[1] + count[2] + ... + count[i]
  const prefix = new Array(121).fill(0);
  for (let i = 1; i <= 120; i++) {
    prefix[i] = prefix[i - 1] + count[i];
  }

  let total = 0;
  for (let A = 1; A <= 120; A++) {
    if (count[A] === 0) continue;
    // B 必须满足 age[B] > 0.5*A + 7
    const lower = Math.floor(0.5 * A + 7) + 1;
    if (lower > A) continue; // 区间为空（A <= 14 时发生）
    // 区间 [lower, A] 内的总人数
    const numB = prefix[A] - prefix[lower - 1];
    // count[A] 个 A 年龄者各发 numB 个请求，但不能向自己发
    total += count[A] * numB - count[A];
  }
  return total;
}

// 方法2：双重循环枚举年龄对（O(n + 121^2) 时间，O(121) 空间）
// 思路相同，但不使用前缀和，直接对每对 (A, B) 判断条件并累加。
function numFriendRequestsBrute(ages: number[]): number {
  const count = new Array(121).fill(0);
  for (const a of ages) {
    count[a]++;
  }

  let total = 0;
  for (let A = 1; A <= 120; A++) {
    if (count[A] === 0) continue;
    for (let B = 1; B <= 120; B++) {
      if (count[B] === 0) continue;
      // 判断 A 是否会给 B 发请求
      if (B <= 0.5 * A + 7) continue;
      if (B > A) continue;
      if (B > 100 && A < 100) continue;
      // 若 A == B，不能向自己发
      total += count[A] * (count[B] - (A === B ? 1 : 0));
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 适龄的朋友 =====");
console.log("前缀和 [16,16]:", numFriendRequests([16, 16])); // 期望 2
console.log("前缀和 [16,17,18]:", numFriendRequests([16, 17, 18])); // 期望 2
console.log("前缀和 [20,30,100,110,120]:", numFriendRequests([20, 30, 100, 110, 120])); // 期望 3
console.log("暴力法 [16,16]:", numFriendRequestsBrute([16, 16])); // 期望 2
console.log("暴力法 [16,17,18]:", numFriendRequestsBrute([16, 17, 18])); // 期望 2
console.log("暴力法 [20,30,100,110,120]:", numFriendRequestsBrute([20, 30, 100, 110, 120])); // 期望 3

export {};
