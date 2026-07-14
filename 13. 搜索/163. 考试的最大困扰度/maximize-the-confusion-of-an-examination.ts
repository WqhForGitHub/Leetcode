// ============================================================
// 163. 考试的最大困扰度
// ============================================================
// LeetCode 2024. Maximize the Confusion of an Examination
// 给定答案串 answerKey（含 'T'/'F'），最多修改 k 个答案，
// 求最长连续相同答案的长度。

// 方法1：二分查找
function maxConsecutiveAnswers(answerKey: string, k: number): number {
  const n = answerKey.length;
  // 检查是否存在长度为 len 的窗口，满足可以全变 T 或全变 F
  function canAchieve(len: number): boolean {
    let countT = 0;
    let countF = 0;
    for (let i = 0; i < len; i++) {
      if (answerKey[i] === "T") countT++;
      else countF++;
    }
    if (countT <= k || countF <= k) return true;
    for (let i = len; i < n; i++) {
      if (answerKey[i] === "T") countT++;
      else countF++;
      if (answerKey[i - len] === "T") countT--;
      else countF--;
      if (countT <= k || countF <= k) return true;
    }
    return false;
  }
  let left = 1;
  let right = n;
  while (left < right) {
    const mid = Math.ceil((left + right) / 2);
    if (canAchieve(mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// 方法2：滑动窗口
function maxConsecutiveAnswersSliding(answerKey: string, k: number): number {
  const n = answerKey.length;
  // 分别求最长全 T 和最长全 F
  function sliding(target: string): number {
    let left = 0;
    let maxLen = 0;
    let changes = 0;
    for (let right = 0; right < n; right++) {
      if (answerKey[right] !== target) changes++;
      while (changes > k) {
        if (answerKey[left] !== target) changes--;
        left++;
      }
      maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
  }
  return Math.max(sliding("T"), sliding("F"));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 163. 考试的最大困扰度 =====");
console.log("二分 TTFF,2:", maxConsecutiveAnswers("TTFF", 2)); // 4
console.log("二分 TFFT,1:", maxConsecutiveAnswers("TFFT", 1)); // 3
console.log("二分 TTFTTFTT,1:", maxConsecutiveAnswers("TTFTTFTT", 1)); // 5
console.log("滑动 TTFF,2:", maxConsecutiveAnswersSliding("TTFF", 2)); // 4
console.log("滑动 TFFT,1:", maxConsecutiveAnswersSliding("TFFT", 1)); // 3

export {};
