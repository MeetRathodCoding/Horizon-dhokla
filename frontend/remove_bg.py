import sys
from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # threshold for considering a pixel "white"
    threshold = 245
    for item in datas:
        # Check if R, G, B are all > threshold
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Change to transparent
            newData.append((255, 255, 255, 0))
        else:
            # Keep original
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Successfully processed {input_path} and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input> <output>")
        sys.exit(1)
    remove_white_bg(sys.argv[1], sys.argv[2])
