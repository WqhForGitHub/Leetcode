// ============================================================
// 096. 射箭比赛中的最大得分
// ============================================================
// LeetCode 2212. Maximum Points in an Archery Tournament
// Alice 在 12 个区域共射 numArrows 支箭，aliceArrows[i] 为区域 i 的箭数。
// Bob 也有 numArrows 支箭。若 Bob 在区域 i 射的箭数严格大于 Alice，则 Bob 得 i 分。
// 求 Bob 的最大得分及对应分配方案。
// 时间复杂度：O(2^12 * 12), 空间复杂度：O(12)

// 方法1：回溯 (每个区域决策赢/不赢)
// 对每个区域决定是否赢得该分；记录最优方案；剩余箭加到任意已赢区域。
// 时间复杂度 O(2^12 * 12), 空间复杂度 O(12)
function maximumBobPoints(numArrows: number, aliceArrows: number[]): number[] {
  const n: number = 12;
  let bestScore: number = -1;
  let bestAllocation: number[] = new Array(n).fill(0);
  const allocation: number[] = new Array(n).fill(0);

  const backtrack = (section: number, arrowsLeft: number, score: number): void => {
    if (section === n) {
      if (score > bestScore) {
        bestScore = score;
        bestAllocation = [...allocation];
        // 剩余箭加到任意已赢区域（不改变输赢状态）；若无赢的区域，加到区域 0
        if (arrowsLeft > 0) {
          let placed: boolean = false;
          for (let i = 0; i < n; i++) {
            if (bestAllocation[i] > 0) {
              bestAllocation[i] += arrowsLeft;
              placed = true;
              break;
            }
          }
          if (!placed) bestAllocation[0] += arrowsLeft;
        }
      }
      return;
    }
    // 选择不赢该区域
    allocation[section] = 0;
    backtrack(section + 1, arrowsLeft, score);
    // 选择赢得该区域（至少 aliceArrows[section] + 1 支箭）
    const need: number = aliceArrows[section] + 1;
    if (arrowsLeft >= need) {
      allocation[section] = need;
      backtrack(section + 1, arrowsLeft - need, score + section);
      allocation[section] = 0;
    }
  };

  backtrack(0, numArrows, 0);
  return bestAllocation;
}

// 方法2：位掩码枚举
// 枚举要赢的区域子集，验证所需箭数 <= numArrows，记录最大得分。
// 时间复杂度 O(2^12 * 12), 空间复杂度 O(12)
function maximumBobPoints2(numArrows: number, aliceArrows: number[]): number[] {
  const n: number = 12;
  let bestScore: number = -1;
  let bestMask: number = 0;

  for (let mask: number = 0; mask < 1 << n; mask++) {
    let arrowsNeeded: number = 0;
    let score: number = 0;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        arrowsNeeded += aliceArrows[i] + 1;
        score += i;
      }
    }
    if (arrowsNeeded <= numArrows && score > bestScore) {
      bestScore = score;
      bestMask = mask;
    }
  }

  // 构造分配
  const result: number[] = new Array(n).fill(0);
  let used: number = 0;
  for (let i = 0; i < n; i++) {
    if ((bestMask >> i) & 1) {
      result[i] = aliceArrows[i] + 1;
      used += result[i];
    }
  }
  const leftover: number = numArrows - used;
  if (leftover > 0) {
    if (bestMask === 0) {
      result[0] += leftover;
    } else {
      // 加到第一个赢的区域
      for (let i = 0; i < n; i++) {
        if ((bestMask >> i) & 1) {
          result[i] += leftover;
          break;
        }
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 射箭比赛中的最大得分 =====");
console.log(maximumBobPoints(9, [1, 1, 0, 1, 0, 0, 2, 1, 0, 1, 2, 0])); // 期望结果: 得分为 47 的合法分配
console.log(maximumBobPoints2(9, [1, 1, 0, 1, 0, 0, 2, 1, 0, 1, 2, 0])); // 期望结果: 得分为 47 的合法分配

export {};
