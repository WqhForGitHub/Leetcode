// ============================================================
// 090. 员工的重要性
// ============================================================
// LeetCode 690. Employee Importance
// 给定一个保存员工信息的数据结构，返回一个员工及其所有下属的重要性之和。
// 每个员工有 id、importance、subordinates（直接下属id列表）
// 时间复杂度：O(n)，空间复杂度：O(n)

// 员工数据结构
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

// 方法1：DFS递归（推荐）
// 用 Map 建立 id -> Employee 的索引，递归累加重要性
function getImportance(employees: Employee[], id: number): number {
  const map = new Map<number, Employee>();
  for (const e of employees) {
    map.set(e.id, e);
  }
  function dfs(empId: number): number {
    const emp = map.get(empId)!;
    let total = emp.importance;
    for (const subId of emp.subordinates) {
      total += dfs(subId);
    }
    return total;
  }
  return dfs(id);
}

// 方法2：BFS迭代
// 用队列层序遍历累加所有下属的重要性
function getImportanceBFS(employees: Employee[], id: number): number {
  const map = new Map<number, Employee>();
  for (const e of employees) {
    map.set(e.id, e);
  }
  let total = 0;
  const queue: number[] = [id];
  while (queue.length > 0) {
    const empId = queue.shift()!;
    const emp = map.get(empId)!;
    total += emp.importance;
    for (const subId of emp.subordinates) {
      queue.push(subId);
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 员工的重要性 =====");

// 测试1: employees = [[1,5,[2,3]],[2,3,[]],[3,3,[]]], id = 1
// 员工1重要性5，下属2、3；员工2重要性3无下属；员工3重要性3无下属
// 总和 = 5 + 3 + 3 = 11
const emps1 = [
  new Employee(1, 5, [2, 3]),
  new Employee(2, 3, []),
  new Employee(3, 3, []),
];
console.log("DFS id=1:", getImportance(emps1, 1)); // 期望 11
console.log("BFS id=1:", getImportanceBFS(emps1, 1)); // 期望 11

// 测试2: employees = [[1,2,[5]],[5,-3,[]]], id = 5
// 员工5重要性-3，无下属
const emps2 = [new Employee(1, 2, [5]), new Employee(5, -3, [])];
console.log("DFS id=5:", getImportance(emps2, 5)); // 期望 -3
console.log("BFS id=5:", getImportanceBFS(emps2, 5)); // 期望 -3

// 测试3: 多层嵌套
// 员工1重要性1，下属[2]；员工2重要性2，下属[3]；员工3重要性3，下属[]
const emps3 = [
  new Employee(1, 1, [2]),
  new Employee(2, 2, [3]),
  new Employee(3, 3, []),
];
console.log("DFS id=1:", getImportance(emps3, 1)); // 期望 6
console.log("BFS id=1:", getImportanceBFS(emps3, 1)); // 期望 6

// 测试4: 单员工
const emps4 = [new Employee(1, 10, [])];
console.log("DFS id=1:", getImportance(emps4, 1)); // 期望 10
console.log("BFS id=1:", getImportanceBFS(emps4, 1)); // 期望 10

export {};
