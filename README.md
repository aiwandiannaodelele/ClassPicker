
# ClassPicker - 点的就是你
**A simple and efficient random name picking tool, suitable for quick random selection in classrooms, meetings, 和 other scenarios.**  


## 🌟 Core Features  
1. **Random Number Selection**: Customize student ID range (e.g.， 1-45)， click the button to randomly scroll and stop at a number.  
2. **Instant Result**: Check the option to directly display the final random number with one click， no animation preview needed.  
3. **Window Pinning**: Keep the main window on top for easy use in multi-tasking environments.  


## 🛠️ Technical Implementation  
- **Programming Language**: Python 3.x  
- **GUI Framework**: Tkinter (built-in library， no additional graphical dependencies required)  
- **Theme Style**: Modern interface using the `sv_ttk` library (requires additional installation)  
- **Resource Management**: Compatible path handling for development and packaged environments via the `resource_path` function  


## 📦 Installation and Run  
### Dependency Installation  
```bash
pip install sv_ttk pillow matplotlib
```  

### How to Run  
1. **Run Source Code Directly**:  
   - Ensure `main.py`， `icon.ico`， 和 `icon.png` are in the same directory.  
   - Execute `python main.py`.  

2. **Use Packaged Executable File**:  
   - Pack with PyInstaller (install first):  
     ```bash
     pyinstaller --onefile --windowed --name "ClassPicker" --icon "icon.ico" --add-data "icon.png;." --add-data "icon.ico;." main.py
     ```  
   - Run `dist/ClassPicker.exe` (Windows system).  


## 🖥️ Interface Preview  
![image](https://github.com/user-attachments/assets/eccc5862-1307-4d1e-9ac6-162666bc1704)  

- **Main Window**: Displays the current random number， student ID range input field， function buttons， and options.  


## 📝 Notes  
1. **Icon Dependency**:  
   - The program requires `icon.ico` (application icon) and `icon.png` (about window icon)， which must be included via `--add-data` when packaging.  
   - The program will still run without icon files but will show warning messages.  

2. **Compatibility**:  
   - Mainly tested on Windows 10/11， theoretically supports macOS and Linux (requires adjusting packaging parameters).  


## 📧 Contact and Feedback  
- **Developers**: LeLeawa/Gong Yifan  
- **Email**: aiwandiannaodelele@outlook.com  
- **Issue Reporting**: Submit suggestions or bug reports in [GitHub Issues](https://github.com/aiwandiannaodelele/ClassPicker/issues).  


## 📄 Open Source License  
This project is licensed under the [MIT License](https://github.com/aiwandiannaodelele/ClassPicker/blob/main/LICENSE). Contributions and suggestions are welcome!  

---  

**✨ Use ClassPicker to make random selection easier!**
