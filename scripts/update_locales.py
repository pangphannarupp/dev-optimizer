import re
import json
import os
import glob

RULES_FILE = 'src/utils/codeQualityRules.ts'
LOCALES_DIR = 'src/locales'

def extract_rules():
    with open(RULES_FILE, 'r') as f:
        content = f.read()

    # Regex to capture id, message, suggestion
    # This is a bit brittle but simple for the structure we have
    # id: 'foo',
    # message: 'bar',
    # suggestion: 'baz'
    
    rules = {}
    
    # regex for objects inside the arrays
    # We find blocks starting with { and look for id/message/suggestion keys
    # Use re.DOTALL to match across lines
    
    # Regex-based block extraction is brittle with nested braces in patterns.
    # We will use a simple brace counting state machine.
    
    lines = content.split('\n')
    
    # Helper to extracting string value for a key from a block of text
    def extract_key_value(text, key):
        # find key:
        pos = text.find(key + ":")
        if pos == -1:
             # try quoted key
             pos = text.find("'" + key + "':")
             if pos == -1:
                 pos = text.find('"' + key + '":')
                 if pos == -1: return None
        
        # Move past key
        pos = text.find(":", pos) + 1
        
        # Skip whitespace
        while pos < len(text) and text[pos].isspace():
            pos += 1
            
        if pos >= len(text): return None
        
        quote_char = text[pos]
        if quote_char not in ["'", '"', '`']:
            return None # Not a string literal (maybe variable or regex)
            
        # Find closing quote
        start_pos = pos + 1
        current = start_pos
        while current < len(text):
            if text[current] == quote_char and text[current-1] != '\\':
                return text[start_pos:current]
            current += 1
            
        return None

    # Find all start indices of "id: " using regex to be safe about property names
    id_indices = [m.start() for m in re.finditer(r"id:\s*['\"]", content)]
    
    for i, start_index in enumerate(id_indices):
        end_index = id_indices[i+1] if i + 1 < len(id_indices) else len(content)
        block_content = content[start_index:end_index]
        
        # Extract fields using robust parser
        # We assume regular object property syntax
        rule_id = extract_key_value(block_content, "id")
        if not rule_id: continue
        
        message = extract_key_value(block_content, "message")
        if not message: continue
        
        suggestion = extract_key_value(block_content, "suggestion") or ""
        
        if rule_id not in rules:
            rules[rule_id] = {
                "message": message,
                "suggestion": suggestion
            }
            
    print(f"Extracted {len(rules)} rules.")
    return rules

def update_locales(rules):
    json_files = glob.glob(os.path.join(LOCALES_DIR, '*.json'))
    
    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Navigate to codeQuality section
            if 'codeQuality' not in data:
                data['codeQuality'] = {}
            
            # Ensure 'rules' object exists
            if 'rules' not in data['codeQuality']:
                data['codeQuality']['rules'] = {}
            
            existing_rules = data['codeQuality']['rules']
            
            # Update/Add rules
            for rule_id, content in rules.items():
                if rule_id not in existing_rules:
                    existing_rules[rule_id] = {
                        "message": content['message'],
                        "suggestion": content['suggestion']
                    }
                # Else: preserve existing translation if key exists? 
                # Ideally yes, but if we are "Applying translation", maybe we want to sync the new English baseline
                # For now, let's only add missing keys to respect manual translations if any exist (unlikely for new rules)
            
            # Save back
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
                
            print(f"Updated {os.path.basename(file_path)}")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    extracted = extract_rules()
    update_locales(extracted)
