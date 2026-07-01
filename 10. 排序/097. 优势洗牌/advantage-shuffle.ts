// ============================================================
// 097. 优势洗牌
// ============================================================
// LeetCode 870. Advantage Shuffle
// 给定两个长度相等的数组 A 和 B，重排 A 使得 A[i] > B[i] 的数量最大化（田忌赛马）。

// 方法1：排序 + 双指针（推荐，时间 O(n log n)，空间 O(n)）
// 将 A 升序排序，将 B 连同原始下标升序排序。用两个指针指向 A 的最小值和最大值。
// 从最大的 B 开始匹配：若 A 的最大值能胜过当前 B，则把最大值分配给它；
// 否则用 A 的最小值"送死"（牺牲给当前较大的 B）。
function advantageCount(nums: number[], b: number[]): number[] {
  const n = nums.length;
  nums.sort((a, b) => a - b);
  // B 带原始下标排序
  const bSorted: Array<[number, number]> = b
    .map((v, i) => [v, i] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  const result: number[] = new Array(n).fill(0);
  let low = 0;
  let high = n - 1;

  // 从最大的 B 向最小的 B 匹配
  for (let i = n - 1; i >= 0; i--) {
    const [val, idx] = bSorted[i];
    if (nums[high] > val) {
      // 能赢：用当前最大的 A
      result[idx] = nums[high];
      high--;
    } else {
      // 赢不了：用最小的 A 牺牲掉
      result[idx] = nums[low];
      low++;
    }
  }

  return result;
}

// 方法2：排序 + 二分模拟多重集合（时间 O(n^2)，空间 O(n)）
// 对 A 排序后视为有序多重集合；对每个 B[i] 二分找第一个大于 B[i] 的元素，
// 找到则取出（赢），否则取出最小元素（送死）。用 splice 模拟删除。
// 思路直观但删除为 O(n)，整体 O(n^2)，适合作为对比实现。
function advantageCountBinary(nums: number[], b: number[]): number[] {
  const sorted: number[] = [...nums].sort((a, b) => a - b);
  const result: number[] = [];

  for (const target of b) {
    // 二分找第一个 > target 的位置
    let lo = 0;
    let hi = sorted.length - 1;
    let firstGreater = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] > target) {
        firstGreater = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    // 能赢则取第一个大于 target 的，否则取最小（首位）
    const pickIdx = firstGreater === -1 ? 0 : firstGreater;
    result.push(sorted[pickIdx]);
    sorted.splice(pickIdx, 1);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 优势洗牌 =====");
console.log("方法1:", advantageCount([2, 7, 11, 15], [1, 10, 4, 11])); // 期望: [2,11,7,15] (4 次优势)
console.log("方法1:", advantageCount([12, 24, 8, 32], [13, 25, 32, 11])); // 期望: [24,32,8,12] 等
console.log("方法2:", advantageCountBinary([2, 7, 11, 15], [1, 10, 4, 11])); // 期望: 4 次优势

export {};
