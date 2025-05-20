
# ClassPicker - 点的就是你  
**一款简洁高效的随机点名工具，适用于课堂、会议等场景的快速随机选择。**  


## 🌟 核心功能  
1. **随机数字选择**：可自定义学号范围（如1-45），点击按钮随机滚动并停止在某个数字。  
2. **瞬间出结果**：勾选功能后，点击按钮直接显示最终随机数，无需动画预览。  
3. **窗口置顶**：支持将主窗口置顶，方便在多任务环境中使用。  


## 🛠️ 技术实现  
- **开发语言**：Python 3.x  
- **GUI框架**：Tkinter（内置库，无需额外安装图形依赖）  
- **主题样式**：使用 `sv_ttk` 库实现现代风格界面（需额外安装）  
- **资源管理**：通过 `resource_path` 函数兼容开发环境与打包后的路径处理  


## 📦 安装与运行  
### 依赖安装  
```bash
pip install sv_ttk pillow matplotlib
```  

### 运行方式  
1. **直接运行源代码**：  
   - 确保 `main.py`、`icon.ico`、`icon.png` 在同一目录。  
   - 执行 `python main.py`。  

2. **使用打包后的可执行文件**：  
   - 使用 PyInstaller 打包（需提前安装）：  
     ```bash
     pyinstaller --onefile --windowed --name "ClassPicker" --icon "icon.ico" --add-data "icon.png;." --add-data "icon.ico;." main.py
     ```  
   - 运行 `dist/ClassPicker.exe`（Windows系统）。  


## 🖥️ 界面预览  
![image](https://github.com/user-attachments/assets/eccc5862-1307-4d1e-9ac6-162666bc1704)


- **主窗口**：显示当前随机数、学号范围输入框、功能按钮及选项。  
- **关于窗口**：显示版本号（v1.0）和开发者信息（LeLeawa 制作）。  


## 📜 更新日志  
- **v1.0（初始版本）**：  
  - 实现基础随机点名功能，支持数字滚动与瞬间结果。  
  - 窗口置顶与关于窗口独立置顶功能。  


## 📝 注意事项  
1. **图标依赖**：  
   - 程序需 `icon.ico`（应用图标）和 `icon.png`（关于窗口图标），打包时需通过 `--add-data` 包含。  
   - 若缺少图标文件，程序仍可运行，但会显示警告信息。  

2. **兼容性**：  
   - 主要测试环境为 Windows 10/11，理论支持 macOS 和 Linux（需调整打包参数）。  


## 📧 联系与反馈  
- **开发者**：LeLeawa  
- **邮箱**：aiwandiannaodelele@outlook.com
- **问题反馈**：在 [GitHub Issues](https://github.com/aiwandiannaodelele/ClassPicker/issues) 提交建议或Bug报告。  


## 📄 开源协议  
本项目采用 [MIT License]([LICENSE](https://github.com/aiwandiannaodelele/ClassPicker/blob/main/LICENSE))，欢迎贡献代码或提出改进建议！  

---  

**✨ 使用 ClassPicker，让随机选择更轻松！**  
