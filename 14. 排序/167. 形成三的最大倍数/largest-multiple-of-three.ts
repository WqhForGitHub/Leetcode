// ============================================================
// 167. 形成三的最大倍数
// ============================================================
// LeetCode 1363. Largest Multiple of Three
// 给定数字数组 digits，用其中部分数字组成最大的 3 的倍数字符串。
// 无法组成则返回 ""。数字排列可任意重排。

// 方法1：数字计数 + 余数数学（O(n + 10)）
function largestMultipleOfThree1(digits: number[]): string {
  const count: number[] = new Array(10).fill(0);
  let sum = 0;
  for (const d of digits) {
    count[d]++;
    sum += d;
  }
  // 从 count 中移除 need 个余数为 rem 的数字（按从小到大）
  const removeRem = (rem: number, need: number): boolean => {
    let removed = 0;
    for (let d = rem; d <= 9 && removed < need; d += 3) {
      while (count[d] > 0 && removed < need) {
        count[d]--;
        removed++;
      }
    }
    return removed === need;
  };
  const r = sum % 3;
  if (r === 1) {
    if (!removeRem(1, 1)) removeRem(2, 2);
  } else if (r === 2) {
    if (!removeRem(2, 1)) removeRem(1, 2);
  }
  // 从大到小拼结果
  let res = "";
  for (let d = 9; d >= 0; d--) {
    if (count[d] > 0) res += d.toString().repeat(count[d]);
  }
  if (res.length === 0) return "";
  if (res[0] === "0") return "0";
  return res;
}

// 方法2：降序排序 + 余数移除（O(n log n)）
function largestMultipleOfThree2(digits: number[]): string {
  let sorted = [...digits].sort((a, b) => b - a);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const r = sum % 3;
  if (r !== 0) {
    // 先尝试移除一个余数为 r 的最小数字
    let removed = false;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] % 3 === r) {
        sorted.splice(i, 1);
        removed = true;
        break;
      }
    }
    // 否则移除两个余数为 3-r 的最小数字
    if (!removed) {
      const need = 3 - r;
      const toRemove = new Set<number>();
      let cnt = 0;
      for (let i = sorted.length - 1; i >= 0 && cnt < 2; i--) {
        if (sorted[i] % 3 === need) {
          toRemove.add(i);
          cnt++;
        }
      }
      if (cnt === 2) {
        sorted = sorted.filter((_, idx) => !toRemove.has(idx));
      }
    }
  }
  if (sorted.length === 0) return "";
  if (sorted[0] === 0) return "0";
  return sorted.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 167. 形成三的最大倍数 =====");
console.log("方法1 [8,1,9]:", largestMultipleOfThree1([8, 1, 9])); // "981"
console.log("方法2 [8,1,9]:", largestMultipleOfThree2([8, 1, 9])); // "981"
console.log("方法1 [8,6,7,1,0]:", largestMultipleOfThree1([8, 6, 7, 1, 0])); // "8760"
console.log("方法2 [8,6,7,1,0]:", largestMultipleOfThree2([8, 6, 7, 1, 0])); // "8760"
console.log("方法1 [1]:", largestMultipleOfThree1([1])); // ""
console.log("方法2 [0,0,0]:", largestMultipleOfThree2([0, 0, 0])); // "0"

export {};
