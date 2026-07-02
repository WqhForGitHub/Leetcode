// ============================================================
// 113. 煎饼排序
// ============================================================
// LeetCode 969. Pancake Sorting
// 给定数组 arr（1..n 的排列），通过若干次「煎饼翻转」将其排序。
// 每次选择 k，反转 arr 前 k 个元素。返回所用的 k 值序列。
// 任意合法序列均可，下面给出一种构造方法。

// 方法1：从大到小归位（推荐，O(n^2) 时间，O(n) 空间）
// 每轮在未排序部分中找到最大值，先翻到队首，再翻到其正确位置。
function pancakeSort(arr: number[]): number[] {
  const result: number[] = [];
  const n = arr.length;
  // 未排序部分大小从 n 递减到 1
  for (let size = n; size > 0; size--) {
    // 在 arr[0..size-1] 中找最大值的下标
    let maxIdx = 0;
    for (let i = 1; i < size; i++) {
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }
    // 已经在正确位置，无需翻转
    if (maxIdx === size - 1) continue;
    // 若最大值不在队首，先翻到队首
    if (maxIdx !== 0) {
      result.push(maxIdx + 1);
      flip(arr, maxIdx + 1);
    }
    // 翻到当前未排序部分的末尾（即其最终位置）
    result.push(size);
    flip(arr, size);
  }
  return result;
}

// 翻转 arr 的前 k 个元素
function flip(arr: number[], k: number): void {
  let left = 0;
  let right = k - 1;
  while (left < right) {
    const tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
    left++;
    right--;
  }
}

// 方法2：按目标值归位（O(n^2) 时间，O(n) 空间）
// 直接枚举目标值 target = n..1，找到其下标后归位。
// 思路与方法1一致，仅查找方式不同，便于理解。
function pancakeSortByValue(arr: number[]): number[] {
  const result: number[] = [];
  const n = arr.length;
  for (let target = n; target >= 1; target--) {
    const idx = arr.indexOf(target);
    if (idx === target - 1) continue;
    if (idx !== 0) {
      result.push(idx + 1);
      flip(arr, idx + 1);
    }
    result.push(target);
    flip(arr, target);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 煎饼排序 =====");

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function applyFlips(original: number[], ks: number[]): number[] {
  const a = original.slice();
  for (const k of ks) flip(a, k);
  return a;
}

const test1 = [3, 2, 4, 1];
const ks1 = pancakeSort(test1.slice());
console.log("方法1 输入 [3,2,4,1] -> k序列:", ks1);
console.log(
  "方法1 排序后:",
  applyFlips([3, 2, 4, 1], ks1),
  "期望已排序:",
  isSorted(applyFlips([3, 2, 4, 1], ks1)),
);

const test2 = [1, 2, 3];
const ks2 = pancakeSort(test2.slice());
console.log("方法1 输入 [1,2,3] -> k序列:", ks2);
console.log(
  "方法1 排序后:",
  applyFlips([1, 2, 3], ks2),
  "期望已排序:",
  isSorted(applyFlips([1, 2, 3], ks2)),
);

const ks3 = pancakeSortByValue([3, 2, 4, 1]);
console.log("方法2 输入 [3,2,4,1] -> k序列:", ks3, "排序后:", applyFlips([3, 2, 4, 1], ks3));

const ks4 = pancakeSortByValue([1, 2, 3]);
console.log("方法2 输入 [1,2,3] -> k序列:", ks4, "排序后:", applyFlips([1, 2, 3], ks4));

export {};
