// ============================================================
// 124. 员工的重要性
// ============================================================
// LeetCode 690. Employee Importance
// 给定员工信息（id, importance, subordinates），返回某员工及其所有下属的重要性之和。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Employee {
  id: number;
  importance: number;
  subordinates: number[];
  constructor(id: number, importance: number, subordinates: number[]) {
    this.id = id;
    this.importance = importance;
    this.subordinates = subordinates;
  }
}

function getImportance(employees: Employee[], id: number): number {
  // 哈希表：id -> Employee
  const map = new Map<number, Employee>();
  for (const e of employees) {
    map.set(e.id, e);
  }

  // BFS 累加重要性
  let total = 0;
  const queue: number[] = [id];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const emp = map.get(cur)!;
    total += emp.importance;
    for (const sub of emp.subordinates) {
      queue.push(sub);
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 124. 员工的重要性 =====");
// 测试 1
const emps1 = [new Employee(1, 5, [2, 3]), new Employee(2, 3, []), new Employee(3, 3, [])];
console.log(getImportance(emps1, 1)); // 期望: 11
// 测试 2
const emps2 = [new Employee(1, 2, [5]), new Employee(5, -3, [])];
console.log(getImportance(emps2, 5)); // 期望: -3

export {};
