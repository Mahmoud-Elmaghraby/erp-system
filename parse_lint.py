import re
from collections import Counter

with open('lint_output.txt', 'r') as f:
    content = f.read()

# Split by file sections
# Files start with E:\...
file_sections = re.split(r'\n(E:\\\S+)\s*\n', content)

file_warnings = {}
rule_counter = Counter()
sales_settings_warnings = []

# The first element might be headers, skip it
for i in range(1, len(file_sections), 2):
    file_path = file_sections[i]
    warnings_text = file_sections[i+1]
    
    # Extract warnings in this file
    # Pattern for warning: line:col warning message rule
    # Note: rule can be on the next line if it's long
    # We'll use a regex that handles both cases
    warnings = re.findall(r'(\d+:\d+)\s+warning\s+(.*?)\s\s+([@\w\-/]+(?:\n\s+[@\w\-/]+)?)', warnings_text, re.DOTALL)
    
    # Process cleaned rules (remove whitespace and newlines)
    cleaned_warnings = []
    for loc, msg, rule in warnings:
        rule = rule.replace('\n', '').replace(' ', '')
        cleaned_warnings.append((loc, msg, rule))
        rule_counter[rule] += 1
    
    file_warnings[file_path] = len(cleaned_warnings)
    
    if "modules\\sales-ui\\src\\lib\\pages\\sales-settings\\" in file_path:
        for loc, msg, rule in cleaned_warnings:
            sales_settings_warnings.append(f"{file_path}:{loc} - {msg} ({rule})")

# Top 10 files
print("Top 10 files by warning count:")
sorted_files = sorted(file_warnings.items(), key=lambda x: x[1], reverse=True)[:10]
for f, count in sorted_files:
    print(f"{count} warnings: {f}")

# Top 10 rules
print("\nTop 10 eslint rules by frequency:")
for rule, count in rule_counter.most_common(10):
    print(f"{count} times: {rule}")

# Sales settings warnings
print("\nWarnings in sales-settings:")
for w in sales_settings_warnings:
    print(w)
