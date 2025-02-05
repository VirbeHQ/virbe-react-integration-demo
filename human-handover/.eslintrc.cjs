module.exports = {
  root: true,
  extends: ["plugin:tailwindcss/recommended"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ['dist', '.eslintrc.cjs', 'routeTree.gen.ts', 'vite.config.ts', 'prettier.config.mjs'],
};
