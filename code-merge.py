import os

def gather_files_recursive(input_folder):
    for folder, _, filenames in os.walk(input_folder):
        for filename in filenames:
            yield os.path.join(folder, filename)

def split_file_content(content, max_chars):
    chunks = content.split('\n\n')
    split_content = []
    current_chunk = []

    for chunk in chunks:
        if sum(len(c) for c in current_chunk) + len(chunk) + len(current_chunk) - 1 <= max_chars:
            current_chunk.append(chunk)
        else:
            split_content.append('\n\n'.join(current_chunk))
            current_chunk = [chunk]

    if current_chunk:
        split_content.append('\n\n'.join(current_chunk))

    return split_content

def combine_files(input_folder, output_file, extensions=None, max_words=500, max_chars=4000):
    if extensions:
        extensions = [ext.lower() for ext in extensions]

    output_index = 1

    for filepath in gather_files_recursive(input_folder):
        if not extensions or os.path.splitext(filepath)[1].lower() in extensions:
            with open(filepath, 'r', encoding='utf-8') as infile:
                content = infile.read()

                if len(content) > max_chars or len(content.split()) > max_words:
                    split_contents = split_file_content(content, max_chars)
                    for part, split_content in enumerate(split_contents, start=1):
                        output_file_name = f"{os.path.splitext(output_file)[0]}_{output_index}_part{part}{os.path.splitext(output_file)[1]}"
                        with open(output_file_name, 'w', encoding='utf-8') as outfile:
                            outfile.write(f"FILE: {os.path.relpath(filepath, input_folder)}\n")
                            outfile.write(f"{'=' * 80}\n")
                            outfile.write(split_content)
                            outfile.write('\n\n')
                        output_index += 1
                else:
                    output_file_name = f"{os.path.splitext(output_file)[0]}_{output_index}{os.path.splitext(output_file)[1]}"
                    with open(output_file_name, 'w', encoding='utf-8') as outfile:
                        outfile.write(f"FILE: {os.path.relpath(filepath, input_folder)}\n")
                        outfile.write(f"{'=' * 80}\n")
                        outfile.write(content)
                        outfile.write('\n\n')
                    output_index += 1

if __name__ == '__main__':
    input_folder = os.getcwd()  # Use the current working directory as the input folder
    output_file = 'combined_code.txt'
    extensions = ['.html', '.js', '.css']  # Include any other file extensions you want to combine

    combine_files(input_folder, output_file, extensions)
