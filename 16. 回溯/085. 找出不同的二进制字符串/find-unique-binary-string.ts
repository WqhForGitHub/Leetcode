// ============================================================
// 085. 找出不同的二进制字符串
// ============================================================
// LeetCode 1980. Find Unique Binary String
// 给定 n 个长度均为 n 的二进制字符串 nums，返回一个长度为 n 且不在 nums 中的二进制字符串。
// 时间复杂度：O(n^2), 空间复杂度：O(n)

// 方法1：康托对角线法 (推荐)
// 构造字符串 s，使得 s[i] 与 nums[i][i] 不同。
// 因为 s 至少在第 i 位与 nums[i] 不同，所以 s 必然不在 nums 中。
// 时间复杂度 O(n), 空间复杂度 O(n)
function findDifferentBinaryString(nums: string[]): string {
  const n: number = nums.length;
  let result: string = "";
  // 取每个字符串对角线位置的字符，翻转
  for (let i = 0; i < n; i++) {
    const ch: string = nums[i][i];
    // 翻转该位：'0' 变 '1'，'1' 变 '0'
    result += ch === "0" ? "1" : "0";
  }
  return result;
}

// 方法2：回溯
// 逐位构建二进制串，遇到不在 nums 中的就返回。
// 时间复杂度 O(2^n * n) 最坏，空间复杂度 O(n)
function findDifferentBinaryString2(nums: string[]): string {
  const n: number = nums.length;
  const set: Set<string> = new Set(nums);
  let answer: string = "";

  const backtrack = (path: string): boolean => {
    if (path.length === n) {
      if (!set.has(path)) {
        answer = path;
        return true;
      }
      return false;
    }
    // 尝试 '0' 和 '1'
    for (const bit of ["0", "1"]) {
      path += bit;
      if (backtrack(path)) return true;
      path = path.slice(0, -1);
    }
    return false;
  };

  backtrack("");
  return answer;
}

// 方法3：排序查找
// 将所有字符串视为二进制数排序，从 0 开始递增，找到第一个缺失的整数，转成二进制串。
// 时间复杂度 O(n log n * n), 空间复杂度 O(n)
function findDifferentBinaryString3(nums: string[]): string {
  const n: number = nums.length;
  const set: Set<number> = new Set();
  for (const s of nums) {
    set.add(parseInt(s, 2));
  }
  // 从 0 开始尝试，必能在 [0, 2^n] 范围内找到缺失值
  for (let i = 0; i < 1 << n; i++) {
    if (!set.has(i)) {
      return i.toString(2).padStart(n, "0");
    }
  }
  return "";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 找出不同的二进制字符串 =====");
console.log(findDifferentBinaryString(["01", "10"])); // 期望结果: "11" 或 "00"
console.log(findDifferentBinaryString2(["01", "10"]));
console.log(findDifferentBinaryString3(["01", "10"]));
console.log(findDifferentBinaryString(["000", "001", "110"])); // 期望结果: 不在数组中的长度3串，如 "010"
console.log(findDifferentBinaryString2(["000", "001", "110"]));
console.log(findDifferentBinaryString3(["000", "001", "110"]));

export {};
