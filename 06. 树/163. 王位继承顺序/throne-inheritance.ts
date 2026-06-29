// ============================================================
// 163. 王位继承顺序
// ============================================================
// LeetCode 1600. Throne Inheritance
// 实现一个王位继承系统，支持 birth（出生）、death（死亡）和 getInheritanceOrder（获取继承顺序）。
// 继承顺序：长子优先的深度优先搜索顺序；死亡的人不出现在继承顺序中，但其子孙仍按原顺序继承。
// 时间复杂度：birth O(1)，death O(1)，getInheritanceOrder O(n)
// 空间复杂度：O(n)

// 方法1：DFS + 哈希表
// 用 Map<string, string[]> 记录每个人的孩子列表（按出生顺序）
// 用 Set<string> 记录已死亡的人
// getInheritanceOrder 从国王开始 DFS 前序遍历，跳过已死亡的人
class ThroneInheritance {
  private king: string;
  private children: Map<string, string[]> = new Map();
  private dead: Set<string> = new Set();

  constructor(kingName: string) {
    this.king = kingName;
    this.children.set(kingName, []);
  }

  birth(parentName: string, childName: string): void {
    if (!this.children.has(parentName)) {
      this.children.set(parentName, []);
    }
    this.children.get(parentName)!.push(childName);
    this.children.set(childName, []);
  }

  death(name: string): void {
    this.dead.add(name);
  }

  getInheritanceOrder(): string[] {
    const result: string[] = [];
    const dfs = (name: string): void => {
      if (!this.dead.has(name)) {
        result.push(name);
      }
      const kids = this.children.get(name);
      if (kids) {
        for (const c of kids) {
          dfs(c);
        }
      }
    };
    dfs(this.king);
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 163. 王位继承顺序 =====");

// 示例测试：
// King -> Alice -> Jack
//      -> Bob
//      -> Catherine
const t = new ThroneInheritance("King");
t.birth("King", "Alice");
t.birth("King", "Bob");
t.birth("King", "Catherine");
t.birth("Alice", "Jack");
t.death("Bob");
console.log("继承顺序:", t.getInheritanceOrder());
// 期望 ["King","Alice","Jack","Catherine"]  (Bob 死了，跳过)

t.death("Jack");
t.death("Alice");
console.log("继承顺序2:", t.getInheritanceOrder());
// 期望 ["King","Catherine"]

t.birth("Catherine", "David");
console.log("继承顺序3:", t.getInheritanceOrder());
// 期望 ["King","Catherine","David"]

export {};
