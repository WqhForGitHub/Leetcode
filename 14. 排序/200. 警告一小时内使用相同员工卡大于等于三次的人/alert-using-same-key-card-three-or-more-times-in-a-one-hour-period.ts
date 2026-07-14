// ============================================================
// 200. 警告一小时内使用相同员工卡大于等于三次的人
// ============================================================
// LeetCode 1604. Alert Using Same Key-Card Three or More Times in a One Hour Period
// 给定 keyName 和 keyTime 数组（HH:MM 格式），
// 找出一小时内（含边界 60 分钟）使用同一员工卡 >= 3 次的员工，按字母序返回。

// 方法1：按名字分组 + 排序 + 滑动窗口检查三元组（O(n log n)）
function alertNames(keyName: string[], keyTime: string[]): string[] {
  const map = new Map<string, number[]>();
  for (let i = 0; i < keyName.length; i++) {
    const name = keyName[i];
    const time = toMinutes(keyTime[i]);
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(time);
  }
  const result: string[] = [];
  for (const [name, times] of map) {
    times.sort((a, b) => a - b);
    // 检查是否存在三个时间点在同一小时内
    for (let i = 2; i < times.length; i++) {
      if (times[i] - times[i - 2] <= 60) {
        result.push(name);
        break;
      }
    }
  }
  result.sort();
  return result;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// 方法2：按名字分组 + 排序 + 滑动窗口（O(n log n)）
// 使用窗口左指针检查窗口内是否 >= 3 次
function alertNames2(keyName: string[], keyTime: string[]): string[] {
  const map = new Map<string, number[]>();
  for (let i = 0; i < keyName.length; i++) {
    const name = keyName[i];
    const [h, m] = keyTime[i].split(":").map(Number);
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(h * 60 + m);
  }
  const result: string[] = [];
  for (const [name, times] of map) {
    times.sort((a, b) => a - b);
    let left = 0;
    for (let right = 0; right < times.length; right++) {
      while (times[right] - times[left] > 60) {
        left++;
      }
      if (right - left + 1 >= 3) {
        result.push(name);
        break;
      }
    }
  }
  result.sort();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 200. 警告一小时内使用相同员工卡大于等于三次的人 =====");
console.log(
  "方法1:",
  alertNames(
    ["daniel", "daniel", "daniel", "luis", "luis", "luis", "luis"],
    ["10:00", "10:40", "11:00", "09:00", "11:00", "13:00", "15:00"],
  ),
); // ["daniel"]
console.log(
  "方法2:",
  alertNames2(
    ["daniel", "daniel", "daniel", "luis", "luis", "luis", "luis"],
    ["10:00", "10:40", "11:00", "09:00", "11:00", "13:00", "15:00"],
  ),
); // ["daniel"]
console.log(
  "方法1:",
  alertNames(
    ["alice", "alice", "alice", "bob", "bob", "bob", "bob"],
    ["12:01", "12:00", "18:00", "21:20", "21:50", "21:59", "22:20"],
  ),
); // ["bob"]
console.log(
  "方法2:",
  alertNames2(
    ["alice", "alice", "alice", "bob", "bob", "bob", "bob"],
    ["12:01", "12:00", "18:00", "21:20", "21:50", "21:59", "22:20"],
  ),
); // ["bob"]

export {};
