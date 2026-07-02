// ============================================================
// 042. 裁剪数字后查询第 K 小的数字
// ============================================================
// LeetCode 2343. Query Kth Smallest Trimmed Number
// 给定等长的数字字符串数组 nums 和查询数组 queries，queries[i] = [ki, trimi]。
// 对每个查询：将每个数字裁剪到最右边 trimi 位，在这些裁剪后的数字中
// 找第 ki 小的数字对应的原始下标；若裁剪后相同，则下标更小者视为更小。
// 时间复杂度：O(q * n log n), 空间复杂度：O(n)

// 方法1：逐查询排序（推荐）
// 对每个查询构造 [裁剪后的字符串, 原始下标] 数组，按字符串值（等长即字典序等价数值）
// 排序，相等按下标升序，取第 k-1 个的下标。
// 时间复杂度 O(q * n log n)，空间复杂度 O(n)
function smallestTrimmedNumbers(nums: string[], queries: number[][]): number[] {
  const n: number = nums.length;
  const len: number = nums[0].length;
  const ans: number[] = [];
  for (const q of queries) {
    const k: number = q[0];
    const trim: number = q[1];
    const arr: [string, number][] = [];
    for (let i: number = 0; i < n; i++) {
      // 取最右边 trim 位（等长字符串，字典序比较等价于数值比较）
      const trimmed: string = nums[i].slice(len - trim);
      arr.push([trimmed, i]);
    }
    arr.sort((a: [string, number], b: [string, number]): number => {
      if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
      return a[1] - b[1];
    });
    ans.push(arr[k - 1][1]);
  }
  return ans;
}

// 方法2：基数排序风格（从右向右逐位稳定排序）
// 将所有查询按 trim 升序处理，复用上一次的稳定排序结果：
// 每处理一位（从右往左），对当前顺序做一次按该位数字的稳定计数排序（0-9）。
// 处理完 trim 位后，order 即为按裁剪值稳定升序的原始下标序列，
// 稳定性保证了“相等时下标更小在前”。时间复杂度 O(n * L + q log q)，空间复杂度 O(n)
function smallestTrimmedNumbersRadix(nums: string[], queries: number[][]): number[] {
  const n: number = nums.length;
  const len: number = nums[0].length;
  // order[i] = 当前按已处理位稳定排序后第 i 小的原始下标
  let order: number[] = [];
  for (let i: number = 0; i < n; i++) order.push(i);

  // 查询按 trim 升序处理，逐步累加位数
  const qOrder: number[] = queries.map((_: number[], i: number): number => i);
  qOrder.sort((a: number, b: number): number => queries[a][1] - queries[b][1]);

  const ans: number[] = new Array<number>(queries.length).fill(0);
  let processed: number = 0; // 已从右起处理的位数
  for (const qi of qOrder) {
    const k: number = queries[qi][0];
    const trim: number = queries[qi][1];
    while (processed < trim) {
      const pos: number = len - 1 - processed; // 当前处理的字符下标（从右往左）
      const buckets: number[][] = [];
      for (let d: number = 0; d < 10; d++) buckets.push([]);
      for (const idx of order) {
        const digit: number = nums[idx].charCodeAt(pos) - 48; // '0' 的 ASCII 为 48
        buckets[digit].push(idx);
      }
      // 拍平桶，得到稳定排序后的新顺序
      const next: number[] = [];
      for (let d: number = 0; d < 10; d++) for (const idx of buckets[d]) next.push(idx);
      order = next;
      processed++;
    }
    ans[qi] = order[k - 1];
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 裁剪数字后查询第 K 小的数字 =====");
console.log(
  JSON.stringify(
    smallestTrimmedNumbers(
      ["102", "473", "251", "814"],
      [
        [1, 1],
        [2, 3],
        [4, 2],
        [1, 2],
      ],
    ),
  ),
); // 期望结果: [2,2,1,0]
console.log(
  JSON.stringify(
    smallestTrimmedNumbers(
      ["24", "37", "96", "04"],
      [
        [2, 1],
        [2, 2],
      ],
    ),
  ),
); // 期望结果: [3,0]
console.log("--- 方法2测试 ---");
console.log(
  JSON.stringify(
    smallestTrimmedNumbersRadix(
      ["102", "473", "251", "814"],
      [
        [1, 1],
        [2, 3],
        [4, 2],
        [1, 2],
      ],
    ),
  ),
); // 期望结果: [2,2,1,0]
console.log(
  JSON.stringify(
    smallestTrimmedNumbersRadix(
      ["24", "37", "96", "04"],
      [
        [2, 1],
        [2, 2],
      ],
    ),
  ),
); // 期望结果: [3,0]

export {};
