import os

def replace_in_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                # Replace classes to match the prompt's exact hex mapping in Tailwind
                # slate- to gray- (gray maps to cool gray/neutral with F9FAFB)
                # emerald- to green- (green maps exactly to #22C55E)
                new_content = content.replace('slate-', 'gray-').replace('emerald-', 'green-')
                
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
    print("Color palette replacement complete!")

if __name__ == "__main__":
    replace_in_files('/home/rushikesh/Desktop/Horizon-dhokla/frontend/src')
