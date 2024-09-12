#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 动态导入 chalk
(async () => {
  const chalk = (await import("chalk")).default;

  // 获取当前文件的目录名
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // CLI 问题
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "请输入项目名称:",
    },
    {
      type: "list",
      name: "framework",
      message: "选择一个框架:",
      choices: ["React", "Vue"],
    },
    // {
    //   type: "confirm",
    //   name: "typescript",
    //   message: "是否使用 TypeScript?",
    //   default: false,
    // },
  ];

  // 复制文件夹的递归函数
  function copyFolderSync(from, to) {
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach((element) => {
      const src = path.join(from, element);
      const dest = path.join(to, element);
      if (fs.lstatSync(src).isDirectory()) {
        copyFolderSync(src, dest); // 递归复制文件夹
      } else {
        fs.copyFileSync(src, dest); // 复制文件
      }
    });
  }

  // 根据用户输入生成项目结构
  function createProject(answers) {
    const { projectName, framework } = answers;

    const projectPath = path.join(process.cwd(), projectName);

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }

    // 如果用户选择 Vue 框架，复制 template-vue 文件夹到目标路径
    if (framework === "Vue") {
      const templatePath = path.join(__dirname, "../template-vue"); // 模板路径
      copyFolderSync(templatePath, projectPath); // 复制模板文件
      //console.log(chalk.green("Vue 项目模板已复制!"));
    }
    if (framework === "React") {
      const templatePath = path.join(__dirname, "../template-react"); // 模板路径
      copyFolderSync(templatePath, projectPath); // 复制模板文件
      //console.log(chalk.green("React 项目模板已复制!"));
    }

    // 你可以根据其他框架添加更多的模板复制逻辑
    console.log(chalk.green("项目创建成功!"));
    console.log(`\n接下来，你可以通过以下命令开始开发你的项目：`);
    console.log(`\n  ${chalk.blue(`cd ${projectName}`)}`);
    console.log(`  ${chalk.blue(`pnpm install`)}  # 安装项目依赖`);
    console.log(`  ${chalk.blue(`pnpm dev`)}  # 启动开发服务器`);
  }

  inquirer.prompt(questions).then(createProject);
})();
