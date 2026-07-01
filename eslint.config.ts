// ============================================================
// ESLint Flat Config (ESLint 10)
// 集成 TypeScript + Prettier
// ============================================================
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // 全局忽略目录
  {
    ignores: ["node_modules/", "dist/", "build/", "*.log"],
  },
  // ESLint 基础推荐规则
  js.configs.recommended,
  // TypeScript 推荐规则
  ...tseslint.configs.recommended,
  // TypeScript 文件专属配置
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // LeetCode 练习项目：允许 console 输出
      "no-console": "off",
      // 未使用变量：警告，允许下划线前缀
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 允许显式 any（LeetCode 题解常见）
      "@typescript-eslint/no-explicit-any": "off",
      // 允许空函数
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  // 关闭与 Prettier 冲突的格式化规则（必须放在最后）
  eslintConfigPrettier,
);
