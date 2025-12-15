import json
import os
import sys

# Usage: python3 scripts/apply_translations.py <translations_file.json>

LOCALES_DIR = 'src/locales'

def deep_merge(target, source):
    for key, value in source.items():
        if isinstance(value, dict):
            if key not in target:
                target[key] = {}
            if isinstance(target[key], dict):
                deep_merge(target[key], value)
            else:
                target[key] = value
        else:
            target[key] = value

def merge_translations(translations_file):
    try:
        with open(translations_file, 'r', encoding='utf-8') as f:
            translations_map = json.load(f)
    except Exception as e:
        print(f"Error loading translations file: {e}")
        return

    for lang, translations in translations_map.items():
        file_path = os.path.join(LOCALES_DIR, f'{lang}.json')
        
        target_data = {}
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    target_data = json.load(f)
            except Exception as e:
                print(f"Error reading {lang}.json: {e}")
                continue
        else:
            print(f"Warning: {lang}.json does not exist. Creating it.")
        
        # Ensure 'codeQuality' exists
        if 'codeQuality' not in target_data:
            target_data['codeQuality'] = {}
        
        if 'rules' not in target_data['codeQuality']:
            target_data['codeQuality']['rules'] = {}
            
        # Update codeQuality with deep merge
        if 'codeQuality' in translations:
            deep_merge(target_data['codeQuality'], translations['codeQuality'])
        
        # Save
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(target_data, f, indent=4, ensure_ascii=False)
            print(f"Successfully updated {lang}.json")
        except Exception as e:
            print(f"Error writing {lang}.json: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/apply_translations.py <translations_file.json>")
        sys.exit(1)
        
    merge_translations(sys.argv[1])
