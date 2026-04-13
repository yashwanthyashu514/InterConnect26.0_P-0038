import os
import re

directory = "c:/Users/ataru/Desktop/Imperio -Neural(2)/maca-empire/src/app"

# We want to remove `<div className="empty-state-icon">...</div>` entirely from all page.tsx files
pattern = re.compile(r'<div className="empty-state-icon">.*?</div>', re.DOTALL)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.tsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "empty-state-icon" in content:
                # Replace with practically nothing
                content = pattern.sub('', content)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Removed emoji icon from {filepath}")
