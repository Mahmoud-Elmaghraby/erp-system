import re

with open('lint_output.txt', 'r', encoding='utf-8') as f:
    lines = [l.rstrip() for l in f]

current_file = ""
for i in range(len(lines)):
    line = lines[i].strip()
    if line.startswith('E:'):
        current_file = line
        continue
    
    if ' error ' in line and ':' in line:
        parts = re.split(r'\s+error\s+', line)
        if len(parts) >= 2:
            loc = parts[0].strip()
            msg = parts[1].strip()
            rule = "unknown"
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if next_line and not next_line.startswith('E:') and ' error ' not in next_line and ' warning ' not in next_line:
                    rule = next_line
            if "problems" not in line:
                print(f"{current_file}:{loc} - {rule}: {msg}")
