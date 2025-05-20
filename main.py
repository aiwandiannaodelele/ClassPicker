import tkinter as tk
from tkinter import ttk
import sv_ttk
import random
import threading
import time
import os
import sys

def resource_path(relative_path):
    """获取资源的绝对路径，适用于开发环境和打包后的环境"""
    try:
        # PyInstaller创建临时文件夹，将资源路径存储在_MEIPASS中
        base_path = sys._MEIPASS
    except AttributeError:
        # 开发环境下直接使用相对路径
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


# 尝试导入PIL库
try:
    from PIL import Image, ImageTk
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


class NumberPickerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("点的就是你")
        self.root.geometry("300x370")
        
        # 设置应用图标
        self.set_application_icon()

        # 窗口置顶变量，默认勾选
        self.always_on_top_var = tk.BooleanVar(value=True)
        self.root.attributes("-topmost", self.always_on_top_var.get())

        # 设置全局字体为微软雅黑
        self.font_family = "微软雅黑"

        # 应用sv-ttk主题
        sv_ttk.set_theme("light")

        # 创建样式
        self.style = ttk.Style()
        self.style.configure("Number.TLabel", font=(self.font_family, 30))
        self.style.configure("Button.TButton", font=(self.font_family, 12))
        self.style.configure("InputLabel.TLabel", font=(self.font_family, 10))
        self.style.configure("InputEntry.TEntry", font=(self.font_family, 10))
        self.style.configure("Checkbutton.TCheckbutton", font=(self.font_family, 10))
        self.style.configure("SpinButton.TButton", font=(self.font_family, 8), width=2)
        self.style.configure("Result.Number.TLabel", foreground="#3B82F6", font=(self.font_family, 32, "bold"))

        # 变量
        self.number_var = tk.StringVar(value="0")
        self.student_id_var = tk.StringVar(value="45")
        self.is_running = False
        self.thread = None
        self.instant_mode_var = tk.BooleanVar(value=False)
        self.current_style = "Number.TLabel"

        # 创建菜单栏
        self.create_menu()

        # 创建界面
        self.create_widgets()

    def set_application_icon(self):
        """设置应用程序图标"""
        try:
            # 使用resource_path函数获取图标路径
            icon_path = resource_path("icon.ico")
            if os.path.exists(icon_path):
                self.root.iconbitmap(icon_path)
        except Exception as e:
            print(f"无法设置应用图标: {e}")

    def create_menu(self):
        menubar = tk.Menu(self.root)
        menubar.add_command(label="退出", command=self.root.quit)
        menubar.add_command(label="关于", command=self.show_about)
        self.root.config(menu=menubar)

    def toggle_always_on_top(self):
        """切换窗口置顶状态"""
        self.root.attributes("-topmost", self.always_on_top_var.get())

    def show_about(self):
        """显示关于窗口，始终在主窗口上方"""
        about_window = tk.Toplevel(self.root)
        about_window.title("关于")
        about_window.geometry("250x180")
        
        # 确保关于窗口在主窗口上方（不管主窗口是否置顶）
        about_window.transient(self.root)  # 设置为临时窗口
        about_window.attributes("-topmost", True)  # 强制置顶

        # 设置关于窗口的图标
        self.set_about_window_icon(about_window)
        
        # 创建内容框架
        content_frame = ttk.Frame(about_window, padding=10)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # 显示图标（如果存在且已导入PIL库）
        self.display_about_icon(content_frame)
        
        # 显示版本信息
        about_label = ttk.Label(
            content_frame,
            text="点的就是你 v1.0\nLeLeawa 制作",
            font=(self.font_family, 12),
            anchor='center'
        )
        about_label.pack(pady=10)

    def set_about_window_icon(self, window):
        """设置关于窗口的图标"""
        try:
            # 使用resource_path函数获取图标路径
            icon_path = resource_path("icon.ico")
            if os.path.exists(icon_path):
                window.iconbitmap(icon_path)
        except Exception as e:
            print(f"无法设置关于窗口图标: {e}")

    def display_about_icon(self, parent):
        """在关于窗口中显示图标"""
        if not PIL_AVAILABLE:
            print("警告: PIL库未安装，无法显示图标")
            # 显示文本提示
            no_image_label = ttk.Label(
                parent,
                text="图标不可用\n请确保已安装Pillow库",
                font=(self.font_family, 10),
                foreground="red"
            )
            no_image_label.pack(pady=5)
            return
            
        try:
            # 使用resource_path函数获取图标路径
            icon_path = resource_path("icon.png")
            if os.path.exists(icon_path):
                # 打开并调整图像大小
                image = Image.open(icon_path)
                image = image.resize((80, 80), Image.LANCZOS)
                self.about_image = ImageTk.PhotoImage(image)
                
                # 创建图像标签
                image_label = ttk.Label(parent, image=self.about_image)
                image_label.pack(pady=5)
            else:
                print("警告: icon.png 文件不存在")
        except Exception as e:
            print(f"无法加载关于窗口中的图标: {e}")

    def create_widgets(self):
        # 数字显示框
        number_frame = ttk.Frame(self.root)
        number_frame.pack(pady=20)

        self.number_label = ttk.Label(
            number_frame,
            textvariable=self.number_var,
            width=10,
            relief=tk.SUNKEN,
            style=self.current_style,
            anchor='center'
        )
        self.number_label.pack(padx=10, pady=10)

        # 按钮
        button_frame = ttk.Frame(self.root)
        button_frame.pack(pady=10)

        self.toggle_button = ttk.Button(
            button_frame,
            text="点！",
            command=self.toggle_number,
            style="Button.TButton"
        )
        self.toggle_button.pack(padx=10, pady=10)

        # 学号输入框及加减按钮
        input_frame = ttk.Frame(self.root)
        input_frame.pack(pady=10)

        input_label = ttk.Label(
            input_frame,
            text="学号范围:",
            style="InputLabel.TLabel"
        )
        input_label.pack(side=tk.LEFT, padx=5)

        # 创建包含输入框和加减按钮的子框架
        spin_frame = ttk.Frame(input_frame)
        spin_frame.pack(side=tk.LEFT)

        # 减号按钮
        self.dec_button = ttk.Button(
            spin_frame,
            text="-",
            command=self.decrease_number,
            style="SpinButton.TButton"
        )
        self.dec_button.pack(side=tk.LEFT)

        # 学号输入框
        student_id_entry = ttk.Entry(
            spin_frame,
            textvariable=self.student_id_var,
            width=6,
            style="InputEntry.TEntry"
        )
        student_id_entry.pack(side=tk.LEFT, padx=2)

        # 加号按钮
        self.inc_button = ttk.Button(
            spin_frame,
            text="+",
            command=self.increase_number,
            style="SpinButton.TButton"
        )
        self.inc_button.pack(side=tk.LEFT)

        # 功能选项框架
        options_frame = ttk.Frame(self.root)
        options_frame.pack(pady=10)

        # 瞬间出结果勾选框
        instant_check = ttk.Checkbutton(
            options_frame,
            text="瞬间出结果",
            variable=self.instant_mode_var,
            style="Checkbutton.TCheckbutton"
        )
        instant_check.pack(anchor=tk.W, padx=10, pady=5)

        # 置顶勾选框
        topmost_check = ttk.Checkbutton(
            options_frame,
            text="置顶",
            variable=self.always_on_top_var,
            command=self.toggle_always_on_top,
            style="Checkbutton.TCheckbutton"
        )
        topmost_check.pack(anchor=tk.W, padx=10, pady=5)

    def increase_number(self):
        """增加学号范围值"""
        try:
            current = int(self.student_id_var.get())
            self.student_id_var.set(str(current + 1))
        except ValueError:
            self.student_id_var.set("1")

    def decrease_number(self):
        """减少学号范围值"""
        try:
            current = int(self.student_id_var.get())
            if current > 1:
                self.student_id_var.set(str(current - 1))
        except ValueError:
            self.student_id_var.set("1")

    def toggle_number(self):
        """切换数字滚动状态"""
        if self.is_running:
            self.stop_number()
        else:
            if self.instant_mode_var.get():
                self.instant_result()
            else:
                self.start_number()

    def start_number(self):
        """开始随机选择数字"""
        try:
            max_num = int(self.student_id_var.get())
            if max_num < 1:
                max_num = 1
                self.student_id_var.set("1")
        except ValueError:
            max_num = 45
            self.student_id_var.set("45")

        # 重置显示样式
        self.set_normal_style()
        
        self.is_running = True
        self.toggle_button.config(text="停！")

        # 创建并启动线程
        self.thread = threading.Thread(target=self._run_number, args=(max_num,), daemon=True)
        self.thread.start()

    def stop_number(self):
        """停止随机选择数字"""
        self.is_running = False
        self.toggle_button.config(text="点！")
        
        # 应用结果样式
        self.set_result_style()

    def _run_number(self, max_num):
        """在线程中运行数字选择逻辑"""
        while self.is_running:
            number = random.randint(1, max_num)
            self.root.after(0, lambda n=number: self.number_var.set(str(n)))
            time.sleep(0.01)

    def instant_result(self):
        """瞬间出结果功能 - 直接显示最终结果"""
        try:
            max_num = int(self.student_id_var.get())
            if max_num < 1:
                max_num = 1
                self.student_id_var.set("1")
        except ValueError:
            max_num = 45
            self.student_id_var.set("45")

        # 生成随机数并直接显示，不经过预览过程
        number = random.randint(1, max_num)
        self.number_var.set(str(number))
        
        # 立即应用结果样式
        self.set_result_style()

    def show_preview_numbers(self, final_number, max_num):
        """显示预览数字动画，然后显示最终结果"""
        # 显示3次预览数字
        for i in range(3):
            preview_num = random.randint(1, max_num)
            self.number_var.set(str(preview_num))
            self.root.update()
            time.sleep(0.1)
        
        # 显示最终结果
        self.number_var.set(str(final_number))
        self.set_result_style()

    def set_result_style(self):
        """设置结果显示样式"""
        self.current_style = "Result.Number.TLabel"
        self.number_label.config(style=self.current_style)

    def set_normal_style(self):
        """设置正常显示样式"""
        self.current_style = "Number.TLabel"
        self.number_label.config(style=self.current_style)


if __name__ == "__main__":
    # 确保中文显示正常
    import matplotlib
    matplotlib.use("TkAgg")
    
    root = tk.Tk()
    app = NumberPickerApp(root)
    root.mainloop()