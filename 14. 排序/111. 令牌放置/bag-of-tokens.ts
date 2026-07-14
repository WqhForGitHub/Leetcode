// ============================================================
// 111. 令牌放置
// ============================================================
// LeetCode 948. Bag of Tokens
// 有初始能量 power 和分数 score=0，以及令牌数组 tokens。
// 可将令牌正面朝上（需 power>=token）：power-=token, score++；
// 或将令牌反面朝上（需 score>=1）：power+=token, score--。
// 每个令牌最多用一次，求能获得的最大分数。

// 方法1：排序 + 双指针贪心（O(n log n) 时间，O(log n) 空间）
// 排序后，用左侧小令牌换分数，必要时用右侧大令牌换能量。
function bagOfTokensScore(tokens: number[], power: number): number {
  tokens.sort((a, b) => a - b);
  let score = 0;
  let maxScore = 0;
  let left = 0;
  let right = tokens.length - 1;
  while (left <= right) {
    if (power >= tokens[left]) {
      // 正面朝上：消耗能量换取分数
      power -= tokens[left];
      score++;
      left++;
      if (score > maxScore) maxScore = score;
    } else if (score >= 1) {
      // 反面朝上：消耗分数换取能量（拿最大的令牌换）
      power += tokens[right];
      score--;
      right--;
    } else {
      // 既不能换分也不能换能量，结束
      break;
    }
  }
  return maxScore;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 令牌放置 =====");
console.log(bagOfTokensScore([100], 50)); // 期望 0
console.log(bagOfTokensScore([100, 200], 150)); // 期望 1
console.log(bagOfTokensScore([100, 200, 300, 400], 200)); // 期望 2
console.log(bagOfTokensScore([200, 100], 150)); // 期望 1

export {};
