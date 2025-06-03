const { execSync } = require("child_process");
execSync("npx ts-node --transpile-only scripts/exportExcel.ts", {
  stdio: "inherit",
  shell: true,
});
