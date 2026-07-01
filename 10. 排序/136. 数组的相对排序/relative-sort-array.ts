// ============================================================
// 136. 数组的相对排序
// ============================================================
// LeetCode 1122. Relative Sort Array
// 按 arr2 中元素出现的顺序对 arr1 排序；arr2 中未出现的元素按升序放在末尾。
// arr1 与 arr2 中元素范围 0..1000，arr2 中元素互异且均在 arr1 中出现。

// 方法1：计数排序（推荐，O(n + 1001)）
// 统计 arr1 各值出现次数，先按 arr2 顺序输出，剩余按数值升序输出。
function relativeSortArray(arr1: number[], arr2: number[]): number[] {
  const MAX = 1001;
  const count = new Array<number>(MAX).fill(0);
  for (const x of arr1) count[x]++;
  const result: number[] = [];
  // 先按 arr2 顺序输出
  for (const x of arr2) {
    while (count[x] > 0) {
      result.push(x);
      count[x]--;
    }
  }
  // 剩余未在 arr2 中的按升序输出
  for (let x = 0; x < MAX; x++) {
    while (count[x] > 0) {
      result.push(x);
      count[x]--;
    }
  }
  return result;
}

// 方法2：自定义比较器排序（O(n log n)）
// 用哈希表记录 arr2 中每个元素的优先级（下标越小越靠前），不在 arr2 中的
// 元素按数值升序排到末尾。
function relativeSortArray2(arr1: number[], arr2: number[]): number[] {
  // 建立 arr2 中每个元素的优先级（下标越小越靠前）
  const order = new Map<number, number>();
  arr2.forEach((v, idx) => order.set(v, idx));

  return [...arr1].sort((a, b) => {
    const oa = order.get(a);
    const ob = order.get(b);
    if (oa !== undefined && ob !== undefined) {
      return oa - ob;
    }
    if (oa !== undefined) return -1; // a 在 arr2 中，靠前
    if (ob !== undefined) return 1; // b 在 arr2 中，靠前
    // 都不在 arr2 中，按数值升序
    return a - b;
  });
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 数组的相对排序 =====");
console.log("方法1:", relativeSortArray([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]));
// 期望: [2,2,2,1,4,3,3,9,6,7,19]
console.log("方法2:", relativeSortArray2([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]));
// 期望: [2,2,2,1,4,3,3,9,6,7,19]
console.log("方法1:", relativeSortArray([28, 6, 22, 8, 44, 17], [22, 28, 8, 6]));
// 期望: [22,28,8,6,17,44]

export {};
