import zipfile, os, sys
root = r'C:/Users/jerra/OneDrive/Documents/GitHub/Creator--team2'
out = r'C:/Users/jerra/OneDrive/Documents/GitHub/Creator--team2.zip'
exclude_dirs = {'node_modules', '.git', 'venv', '.venv', '__pycache__'}
count = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        # skip excluded directories in the path
        parts = dirpath.split(os.sep)
        if any(part in exclude_dirs for part in parts):
            continue
        for fname in filenames:
            fp = os.path.join(dirpath, fname)
            arcname = os.path.relpath(fp, root)
            try:
                z.write(fp, arcname)
                count += 1
            except Exception:
                pass
print('Created:', out)
print('Files included:', count)
sys.exit(0)
