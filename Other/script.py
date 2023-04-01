import os

def create_file_structure():
    # Root files
    root_files = ['index.html', 'style.css', 'main.js']

    # Create root files
    for file in root_files:
        with open(file, 'w') as f:
            pass

    # Create 'Modules' directory
    os.makedirs('Modules', exist_ok=True)

    # Files inside 'Modules' directory
    module_files = ['UI.js', 'GameLogic.js', 'Data.js']

    # Create files inside 'Modules' directory
    for file in module_files:
        with open(os.path.join('Modules', file), 'w') as f:
            pass

if __name__ == '__main__':
    create_file_structure()
