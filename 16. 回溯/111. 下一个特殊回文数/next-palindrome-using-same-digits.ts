// ============================================================
// 111. 下一个特殊回文数
// ============================================================
// LeetCode 1842. Next Palindrome Using Same Digits
// 给定一个数字字符串，找出用相同数字组成的大于该数的最小回文数。
// 如果不存在则返回空字符串。
// 时间复杂度：O(n), 空间复杂度：O(n)

// 方法1：下一个排列 + 回文构造（推荐）
// 取前半部分，求下一个排列，然后镜像构造回文
// 时间复杂度 O(n), 空间复杂度 O(n)
function nextPalindrome(num: string): string {
  const n: number = num.length;
  if (n <= 1) return "";

  // 取前半部分
  const halfLen: number = Math.floor(n / 2);
  const half: string[] = num.substring(0, halfLen).split("");

  // 求下一个排列
  const hasNext: boolean = nextPermutation(half);
  if (!hasNext) return "";

  // 构造回文
  const left: string = half.join("");
  const right: string = half.reverse().join("");
  if (n % 2 === 0) {
    return left + right;
  } else {
    return left + num[halfLen] + right;
  }
}

function nextPermutation(arr: string[]): boolean {
  const n: number = arr.length;
  // 从右往左找第一个递减的位置
  let i: number = n - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--;
  if (i < 0) return false;

  // 从右往左找第一个大于 arr[i] 的位置
  let j: number = n - 1;
  while (arr[j] <= arr[i]) j--;

  // 交换
  [arr[i], arr[j]] = [arr[j], arr[i]];

  // 反转 i+1 到末尾
  let left: number = i + 1;
  let right: number = n - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return true;
}

// 方法2：回溯（排列 + 验证回文 + 比较）
// 生成所有排列，筛选回文并找到大于原数的最小值
// 时间复杂度 O(n!), 空间复杂度 O(n)
function nextPalindromeBruteForce(num: string): string {
  const digits: string[] = num.split("").sort();
  const results: string[] = [];

  function backtrack(path: string[], used: boolean[]): void {
    if (path.length === digits.length) {
      const candidate: string = path.join("");
      if (isPalindrome(candidate) && candidate > num) {
        results.push(candidate);
      }
      return;
    }
    for (let i = 0; i < digits.length; i++) {
      if (used[i]) continue;
      if (i > 0 && digits[i] === digits[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(digits[i]);
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([], new Array(digits.length).fill(false));
  if (results.length === 0) return "";
  results.sort();
  return results[0];
}

function isPalindrome(s: string): boolean {
  let l: number = 0;
  let r: number = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 下一个特殊回文数 =====");
console.log(nextPalindrome("46751")); // 期望结果: "51476"
console.log(nextPalindrome("1221")); // 期望结果: "2112"
console.log("--- 方法2测试 ---");
console.log(nextPalindromeBruteForce("1221")); // 期望结果: "2112"

export {};
