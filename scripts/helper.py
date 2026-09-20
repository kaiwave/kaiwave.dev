import os
import re
import json
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox

# Base paths relative to scripts/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(BASE_DIR)
SITE_DIR = os.path.join(REPO_ROOT, "site")
NOTES_JS = os.path.join(SITE_DIR, "js", "notes-data.js")
PROJECTS_JS = os.path.join(SITE_DIR, "js", "projects-data.js")
HEADER_TXT = os.path.join(BASE_DIR, "header.txt")
FOOTER_TXT = os.path.join(BASE_DIR, "footer.txt")

# ── JS Array File Parsing & Serialisation ───────────────────────

def format_js_object(obj, indent="  "):
    """Serialise a Python dict into clean JavaScript object format."""
    lines = ["  {"]
    for key, val in obj.items():
        if isinstance(val, str):
            # Escape newlines or double quotes
            val_escaped = val.replace('"', '\\"').replace("\n", "\\n")
            lines.append(f'    {key}: "{val_escaped}",')
        elif isinstance(val, bool):
            lines.append(f"    {key}: {'true' if val else 'false'},")
        elif isinstance(val, (int, float)):
            lines.append(f"    {key}: {val},")
        elif isinstance(val, (list, dict)):
            val_json = json.dumps(val, ensure_ascii=False)
            lines.append(f"    {key}: {val_json},")
    # Remove trailing comma on last item
    if lines[-1].endswith(","):
        lines[-1] = lines[-1][:-1]
    lines.append("  }")
    return "\n".join(lines)

def format_project_object(obj):
    """Formats a project dict cleanly into idiomatic JavaScript with backticks for snippets."""
    lines = ["  {"]
    
    # Standard properties
    lines.append(f'    id: \'{obj["id"]}\',')
    lines.append(f'    featured: {"true" if obj["featured"] else "false"},')
    
    # Bilingual title
    lines.append('    title: {')
    lines.append(f'      en: {json.dumps(obj["title"]["en"], ensure_ascii=False)},')
    lines.append(f'      fr: {json.dumps(obj["title"]["fr"], ensure_ascii=False)}')
    lines.append('    },')

    # Optional featured headline & eyebrow
    if "headline" in obj:
        lines.append('    headline: {')
        lines.append(f'      en: {json.dumps(obj["headline"]["en"], ensure_ascii=False)},')
        lines.append(f'      fr: {json.dumps(obj["headline"]["fr"], ensure_ascii=False)}')
        lines.append('    },')
    
    if "eyebrow" in obj:
        lines.append('    eyebrow: {')
        lines.append(f'      en: {json.dumps(obj["eyebrow"]["en"], ensure_ascii=False)},')
        lines.append(f'      fr: {json.dumps(obj["eyebrow"]["fr"], ensure_ascii=False)}')
        lines.append('    },')

    # Bilingual description
    lines.append('    description: {')
    lines.append(f'      en: {json.dumps(obj["description"]["en"], ensure_ascii=False)},')
    lines.append(f'      fr: {json.dumps(obj["description"]["fr"], ensure_ascii=False)}')
    lines.append('    },')

    # Tags
    lines.append(f'    tags: {json.dumps(obj["tags"], ensure_ascii=False)},')

    # Action Links
    lines.append('    links: [')
    for i, link in enumerate(obj.get("links", [])):
        comma = "," if i < len(obj["links"]) - 1 else ""
        if isinstance(link.get("label"), dict):
            label_str = f"{{ en: {json.dumps(link['label']['en'], ensure_ascii=False)}, fr: {json.dumps(link['label']['fr'], ensure_ascii=False)} }}"
        else:
            label_str = json.dumps(link.get("label", ""), ensure_ascii=False)

        lines.append(
            f'      {{ kind: \'{link["kind"]}\', href: \'{link["href"]}\', label: {label_str}, target: \'{link.get("target", "_blank")}\' }}{comma}'
        )
    lines.append('    ],')

    # Featured snippet and badge
    if "codeSnippet" in obj:
        lines.append(f'    codeSnippet: `{obj["codeSnippet"]}`,')
    if "badgeText" in obj:
        lines.append(f'    badgeText: \'{obj["badgeText"]}\'')

    # Clean up trailing comma on last property if needed
    if lines[-1].endswith(","):
        lines[-1] = lines[-1][:-1]

    lines.append("  }")
    return "\n".join(lines)

def prepend_project_to_js(filepath, var_name, new_entry):
    if not os.path.exists(filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"window.{var_name} = [\n{format_project_object(new_entry)}\n];\n")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Matches window.projectData = [, const projectData = [, etc.
    pattern = rf"((?:window\.|const\s+|let\s+|var\s+)?{var_name}\s*=\s*\[)"
    match = re.search(pattern, content)

    if not match:
        messagebox.showerror(
            "Match Error",
            f"Could not find array assignment for '{var_name}' in:\n{filepath}"
        )
        return

    formatted_entry = format_project_object(new_entry)

    post_bracket = content[match.end():].lstrip()
    delimiter = ",\n" if not post_bracket.startswith("]") else "\n"

    new_content = (
        content[:match.end()]
        + "\n"
        + formatted_entry
        + delimiter
        + content[match.end():].lstrip("\n")
    )

    if new_entry.get("featured") is True:
        prefix = content[:match.end()] + "\n" + formatted_entry
        remainder = new_content[len(prefix):]
        remainder = re.sub(r"(featured\s*:\s*)true", r"\1false", remainder)
        new_content = prefix + remainder

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

def prepend_entry_to_js(filepath, var_name, new_entry):
    """
    Inserts a new object at the very top of the array inside the JS file
    without touching the rest of the file or altering formatting.
    """
    if not os.path.exists(filepath):
        # Fallback if file does not exist
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"window.{var_name} = [\n{format_js_object(new_entry)}\n];\n")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the array declaration (supports window.noteData = [ or const noteData = [)
    pattern = rf"((?:window\.)?{var_name}\s*=\s*\[)"
    match = re.search(pattern, content)

    if not match:
        messagebox.showerror("Error", f"Could not find array assignment for {var_name} in {filepath}")
        return

    formatted_entry = format_js_object(new_entry)

    # Check if the array already has items inside
    post_bracket = content[match.end():].lstrip()
    delimiter = ",\n" if not post_bracket.startswith("]") else "\n"

    # Splice the new entry immediately after the opening '['
    new_content = (
        content[:match.end()]
        + "\n"
        + formatted_entry
        + delimiter
        + content[match.end():].lstrip("\n")
    )

    # If featured is True, turn off any previous 'featured: true' flags
    if new_entry.get("featured") is True:
        # Match only subsequent occurrences of featured: true
        prefix = content[:match.end()] + "\n" + formatted_entry
        remainder = new_content[len(prefix):]
        remainder = re.sub(r"(featured\s*:\s*)true", r"\1false", remainder)
        new_content = prefix + remainder

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

def save_or_update_note(filepath, var_name, record, original_id=None):
    """
    If original_id is provided or record['id'] exists in the file, 
    replace that specific object block. Otherwise, prepend to the top.
    """
    if not os.path.exists(filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"window.{var_name} = [\n{format_js_object(record)}\n];\n")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    target_id = original_id or record["id"]

    # Match the entire JS object block containing this ID:
    # Looks from '{\s*id: [quotes]target_id[quotes]' up to the closing '}'
    pattern = rf"(\s*\{{\s*id\s*:\s*['\"]{re.escape(target_id)}['\"][^}}]*\}})"
    match = re.search(pattern, content, re.DOTALL)

    if match:
        formatted_entry = "\n" + format_js_object(record)
        # Check if the existing block had a trailing comma
        end_pos = match.end()
        post_text = content[end_pos:].lstrip()
        has_comma = post_text.startswith(",")
        
        if not has_comma and not post_text.startswith("]"):
            formatted_entry += ","

        # Replace in-place
        new_content = content[:match.start()] + formatted_entry + content[end_pos:]

        # Handle exclusive featured flag
        if record.get("featured") is True:
            # Turn all subsequent featured: true to false
            new_content = re.sub(r"(featured\s*:\s*)true", r"\1false", new_content)
            # Re-enable featured on our updated note
            new_content = re.sub(
                rf"(id\s*:\s*['\"]{re.escape(record['id'])}['\"][^}}]*?featured\s*:\s*)false",
                r"\1true",
                new_content,
                flags=re.DOTALL
            )

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
    else:
        # ID not found; treat it as a new post and prepend to the top
        prepend_entry_to_js(filepath, var_name, record)

def get_all_entry_ids(filepath):
    """Directly extracts all id values from the JS file using regex."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    # Matches: id: 'slug-name' or id: "slug-name"
    return re.findall(r"id\s*:\s*['\"]([^'\"]+)['\"]", content)


def find_object_bounds(content, target_id):
    """
    Finds the exact start and end string indices of the object block containing target_id
    using a brace-depth counter, handling nested braces, strings, and backticks.
    """
    id_pattern = rf"id\s*:\s*['\"]{re.escape(target_id)}['\"]"
    id_match = re.search(id_pattern, content)
    if not id_match:
        return None, None

    # Step backward to find the opening '{' for this object
    idx = id_match.start()
    open_brace_idx = -1
    while idx >= 0:
        if content[idx] == "{":
            open_brace_idx = idx
            break
        idx -= 1

    if open_brace_idx == -1:
        return None, None

    # Step forward using depth counting to find the matching closing '}'
    depth = 0
    in_quote = None
    in_backtick = False
    escape = False

    for i in range(open_brace_idx, len(content)):
        char = content[i]

        if escape:
            escape = False
            continue

        if char == "\\":
            escape = True
            continue

        if in_backtick:
            if char == "`":
                in_backtick = False
            continue

        if in_quote:
            if char == in_quote:
                in_quote = None
            continue

        if char == "`":
            in_backtick = True
            continue
        elif char in ("'", '"'):
            in_quote = char
            continue
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return open_brace_idx, i + 1

    return None, None


def get_entry_by_id(filepath, target_id, kind="notes"):
    """Accurately extracts note or project data by isolating its full object block."""
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    start, end = find_object_bounds(content, target_id)
    if start is None or end is None:
        return {"id": target_id}

    block = content[start:end]

    feat_match = re.search(r"featured\s*:\s*(true|false)", block)
    featured = feat_match.group(1) == "true" if feat_match else False

    tags_match = re.search(r"tags\s*:\s*\[(.*?)\]", block, re.DOTALL)
    tags = []
    if tags_match:
        tags = [t.strip().strip("'\"") for t in tags_match.group(1).split(",") if t.strip()]

    if kind == "notes":
        def get_simple(f):
            m = re.search(rf"{f}\s*:\s*['\"](.*?)['\"]", block)
            return m.group(1) if m else ""

        return {
            "id": target_id,
            "title": get_simple("title"),
            "date": get_simple("date"),
            "href": get_simple("href"),
            "tags": tags,
            "search": get_simple("search"),
            "featured": featured,
        }

    # Projects
    def get_bi_text(field):
        f_match = re.search(rf"{field}\s*:\s*\{{([^}}]+)\}}", block, re.DOTALL)
        if not f_match:
            return {"en": "", "fr": ""}
        sub = f_match.group(1)
        en_m = re.search(r"en\s*:\s*['\"](.*?)['\"](?:\s*,|\s*$)", sub, re.DOTALL)
        fr_m = re.search(r"fr\s*:\s*['\"](.*?)['\"](?:\s*,|\s*$)", sub, re.DOTALL)
        return {
            "en": en_m.group(1).replace("\\'", "'") if en_m else "",
            "fr": fr_m.group(1).replace("\\'", "'") if fr_m else "",
        }

    def get_bi_arrays(field):
        f_match = re.search(rf"{field}\s*:\s*\{{([^}}]+)\}}", block, re.DOTALL)
        if not f_match:
            return {"en": [], "fr": []}
        sub = f_match.group(1)
        en_m = re.search(r"en\s*:\s*\[(.*?)\]", sub, re.DOTALL)
        fr_m = re.search(r"fr\s*:\s*\[(.*?)\]", sub, re.DOTALL)
        return {
            "en": [x.strip().strip("'\"") for x in en_m.group(1).split(",") if x.strip()] if en_m else [],
            "fr": [x.strip().strip("'\"") for x in fr_m.group(1).split(",") if x.strip()] if fr_m else [],
        }

    snippet_match = re.search(r"codeSnippet\s*:\s*`([^`]*)`", block, re.DOTALL)
    badge_match = re.search(r"badgeText\s*:\s*['\"](.*?)['\"]", block)

    # Links extraction
    links = []
    links_match = re.search(r"links\s*:\s*\[(.*)\]\s*(?:,|\n|$)", block, re.DOTALL)
    if links_match:
        # Match each link sub-object {...}
        raw_items = re.findall(r"\{[^{}]*\}", links_match.group(1))
        for item in raw_items:
            k = re.search(r"kind\s*:\s*['\"](.*?)['\"]", item)
            h = re.search(r"href\s*:\s*['\"](.*?)['\"]", item)
            
            # Bilingual label or single string label
            lbl_bi = re.search(r"label\s*:\s*\{[^}]*en\s*:\s*['\"](.*?)['\"][^}]*fr\s*:\s*['\"](.*?)['\"]", item)
            if lbl_bi:
                lbl = {"en": lbl_bi.group(1), "fr": lbl_bi.group(2)}
            else:
                lbl_s = re.search(r"label\s*:\s*['\"](.*?)['\"]", item)
                lbl = lbl_s.group(1) if lbl_s else ""

            links.append({
                "kind": k.group(1) if k else "primary",
                "href": h.group(1) if h else "",
                "label": lbl,
                "target": "_blank"
            })

    return {
        "id": target_id,
        "featured": featured,
        "title": get_bi_text("title"),
        "description": get_bi_text("description"),
        "headline": get_bi_arrays("headline"),
        "eyebrow": get_bi_text("eyebrow"),
        "badgeText": badge_match.group(1) if badge_match else "",
        "codeSnippet": snippet_match.group(1) if snippet_match else "",
        "tags": tags,
        "links": links,
    }


def save_or_update_project(filepath, var_name, record, original_id=None):
    """Replaces the exact existing project object in place without duplicating."""
    if not os.path.exists(filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"window.{var_name} = [\n{format_project_object(record)}\n];\n")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    target_id = original_id or record["id"]
    start, end = find_object_bounds(content, target_id)

    if start is not None and end is not None:
        formatted = format_project_object(record)
        
        # Preserve comma behavior
        remainder = content[end:].lstrip()
        has_comma = remainder.startswith(",")
        if has_comma:
            end += (len(content[end:]) - len(remainder)) + 1  # consume comma
        
        new_entry = formatted + (",\n" if not remainder.lstrip(", \n\t").startswith("]") else "\n")
        new_content = content[:start].rstrip(" \t") + new_entry + content[end:].lstrip("\n")

        # Clear other featured flags if this one is featured
        if record.get("featured") is True:
            new_content = re.sub(r"(featured\s*:\s*)true", r"\1false", new_content)
            # Re-enable featured for this record
            s, e = find_object_bounds(new_content, record["id"])
            if s is not None and e is not None:
                updated_block = re.sub(r"featured\s*:\s*false", "featured: true", new_content[s:e], count=1)
                new_content = new_content[:s] + updated_block + new_content[e:]

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
    else:
        # Not found, prepend as new
        prepend_project_to_js(filepath, var_name, record)

def write_js_array(filepath, var_name, data):
    # Serialise cleanly with indentation
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    # Convert outer quoted keys to idiomatic JS keys
    js_content = f"const {var_name} = {json_str};\n"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(js_content)


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)


# ── Git Commit Helper ───────────────────────────────────────────

def prompt_git_commit(parent, action="Update", item_id="content"):
    default_msg = f"{action} {item_id}"

    win = tk.Toplevel(parent)
    win.title("Git Commit & Push")
    # Increased height to 250 to comfortably fit all elements on Windows DPI scaling
    win.geometry("460x250")
    win.minsize(420, 220)
    win.transient(parent)
    win.grab_set()

    # Pack the buttons to the BOTTOM first so they are guaranteed visible
    btn_frame = tk.Frame(win)
    btn_frame.pack(side="bottom", pady=20)

    # Upper container for label and entry
    content_frame = tk.Frame(win)
    content_frame.pack(side="top", fill="both", expand=True, padx=20, pady=(16, 0))

    tk.Label(content_frame, text="Commit Message:", font=("Arial", 11, "bold")).pack(pady=(0, 8))
    
    msg_var = tk.StringVar(value=default_msg)
    entry = tk.Entry(content_frame, textvariable=msg_var, width=42, font=("Arial", 10))
    entry.pack(pady=4)
    entry.focus()
    entry.select_range(0, tk.END)

    def do_commit():
        msg = msg_var.get().strip()
        if not msg:
            messagebox.showwarning("Warning", "Commit message cannot be empty.", parent=win)
            return

        win.destroy()

        try:
            # 1. Stage all changes repository-wide
            subprocess.run(
                ["git", "add", "-A"],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True
            )

            # 2. Check if there are actually any staged changes to commit
            status_proc = subprocess.run(
                ["git", "diff", "--cached", "--quiet"],
                cwd=REPO_ROOT
            )
            if status_proc.returncode == 0:
                messagebox.showinfo("No Changes", "No modified files detected to commit.", parent=parent)
                return

            # 3. Commit changes
            subprocess.run(
                ["git", "commit", "-m", msg],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True
            )

            # 4. Detect the current active branch
            branch_proc = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True
            )
            current_branch = branch_proc.stdout.strip() or "main"

            # 5. Push upstream
            subprocess.run(
                ["git", "push", "-u", "origin", current_branch],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True
            )

            messagebox.showinfo(
                "Success",
                f"Committed and pushed to '{current_branch}' successfully!\n\nMessage: {msg}",
                parent=parent
            )

        except subprocess.CalledProcessError as e:
            err_details = e.stderr.strip() or e.stdout.strip() or str(e)
            messagebox.showerror(
                "Git Error",
                f"Command '{' '.join(e.cmd)}' failed with code {e.returncode}:\n\n{err_details}",
                parent=parent
            )

    # Bind Return/Enter key to automatically submit
    entry.bind("<Return>", lambda event: do_commit())

    tk.Button(btn_frame, text="Commit & Push", command=do_commit, width=15, height=1).pack(side="left", padx=8)
    tk.Button(btn_frame, text="Skip", command=win.destroy, width=10, height=1).pack(side="left", padx=8)


# ── Main GUI Application ────────────────────────────────────────

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Site Content Manager")
        self.geometry("360x220")
        self.resizable(False, False)
        self.create_main_menu()

    def create_main_menu(self):
        for widget in self.winfo_children():
            widget.destroy()

        frame = tk.Frame(self, padx=20, pady=20)
        frame.pack(expand=True, fill="both")

        tk.Label(frame, text="Site Content Manager", font=("Arial", 14, "bold")).pack(pady=10)

        tk.Button(
            frame,
            text="Create New Entry",
            font=("Arial", 11),
            width=22,
            command=self.open_create_choice
        ).pack(pady=6)

        tk.Button(
            frame,
            text="Modify Existing Entry",
            font=("Arial", 11),
            width=22,
            command=self.open_modify_choice
        ).pack(pady=6)

    def open_create_choice(self):
        win = tk.Toplevel(self)
        win.title("Create Choice")
        win.geometry("260x140")

        tk.Label(win, text="Select type to create:", font=("Arial", 10, "bold")).pack(pady=10)
        tk.Button(win, text="Note", width=16, command=lambda: [win.destroy(), NoteEditor(self)]).pack(pady=4)
        tk.Button(win, text="Project", width=16, command=lambda: [win.destroy(), ProjectEditor(self)]).pack(pady=4)

    def open_modify_choice(self):
        win = tk.Toplevel(self)
        win.title("Modify Choice")
        win.geometry("260x140")

        tk.Label(win, text="Select type to modify:", font=("Arial", 10, "bold")).pack(pady=10)
        tk.Button(win, text="Notes", width=16, command=lambda: [win.destroy(), self.select_id_to_edit("notes")]).pack(pady=4)
        tk.Button(win, text="Projects", width=16, command=lambda: [win.destroy(), self.select_id_to_edit("projects")]).pack(pady=4)

    def select_id_to_edit(self, kind):
        win = tk.Toplevel(self)
        win.title(f"Select {kind[:-1].capitalize()}")
        win.geometry("380x300")

        tk.Label(win, text="Choose an ID to edit:", font=("Arial", 10, "bold")).pack(pady=6)

        listbox = tk.Listbox(win, width=45, height=10)
        listbox.pack(pady=6, padx=10, fill="both", expand=True)

        target_file = NOTES_JS if kind == "notes" else PROJECTS_JS
        ids = get_all_entry_ids(target_file)

        for entry_id in ids:
            listbox.insert(tk.END, entry_id)

        def proceed():
            sel = listbox.curselection()
            if not sel:
                return
            selected_id = listbox.get(sel[0])
            win.destroy()
            
            # Pass kind ("notes" or "projects") here:
            item_data = get_entry_by_id(target_file, selected_id, kind=kind)
            
            if kind == "notes":
                NoteEditor(self, existing_data=item_data)
            else:
                ProjectEditor(self, existing_data=item_data)

        tk.Button(win, text="Open Editor", command=proceed).pack(pady=8)


# ── Note Form & Subpage Generator ───────────────────────────────

class NoteEditor(tk.Toplevel):
    def __init__(self, parent, existing_data=None):
        super().__init__(parent)
        self.title("Edit Note" if existing_data else "Create Note")
        self.geometry("540x620")
        self.parent = parent
        self.existing_data = existing_data
        
        # Track the ID this note had when opened
        self.original_id = existing_data.get("id") if existing_data else None
        
        self.paragraph_entries = []
        self.setup_ui()

    def setup_ui(self):
        container = tk.Frame(self, padx=15, pady=10)
        container.pack(fill="both", expand=True)

        self.id_var = tk.StringVar(value=self.existing_data.get("id", "") if self.existing_data else "")
        self.title_var = tk.StringVar(value=self.existing_data.get("title", "") if self.existing_data else "")
        self.date_var = tk.StringVar(value=self.existing_data.get("date", "2026-08-11") if self.existing_data else "2026-08-11")
        self.href_var = tk.StringVar(value=self.existing_data.get("href", "") if self.existing_data else "")
        self.tags_var = tk.StringVar(value=", ".join(self.existing_data.get("tags", [])) if self.existing_data else "")
        self.search_var = tk.StringVar(value=self.existing_data.get("search", "") if self.existing_data else "")
        self.featured_var = tk.BooleanVar(value=self.existing_data.get("featured", False) if self.existing_data else False)
        self.create_page_var = tk.BooleanVar(value=False)

        fields = [
            ("ID (slug):", self.id_var),
            ("Title:", self.title_var),
            ("Date (YYYY-MM-DD):", self.date_var),
            ("Tags (comma separated):", self.tags_var),
            ("Search keywords:", self.search_var),
        ]

        for label, var in fields:
            tk.Label(container, text=label, anchor="w").pack(fill="x", pady=2)
            tk.Entry(container, textvariable=var).pack(fill="x", pady=2)

        # Href and Create Page toggle
        tk.Label(container, text="URL / Href:", anchor="w").pack(fill="x", pady=2)
        href_row = tk.Frame(container)
        href_row.pack(fill="x", pady=2)
        tk.Entry(href_row, textvariable=self.href_var).pack(side="left", fill="x", expand=True)
        tk.Checkbutton(href_row, text="Create page?", variable=self.create_page_var, command=self.toggle_create_page).pack(side="right", padx=6)

        tk.Checkbutton(container, text="Featured Note", variable=self.featured_var).pack(anchor="w", pady=4)

        # Paragraphs for Subpage (dynamically revealed if Create page is ticked)
        self.page_section = tk.LabelFrame(container, text="Note Subpage Content (Paragraphs)", padx=8, pady=8)
        self.p_container = tk.Frame(self.page_section)
        self.p_container.pack(fill="both", expand=True)

        tk.Button(self.page_section, text="+ Add Paragraph", command=self.add_paragraph).pack(anchor="w", pady=4)

        # Save Button
        tk.Button(container, text="Save Note", command=self.save_note, bg="#0366d6", fg="white", font=("Arial", 10, "bold")).pack(pady=12)

    def toggle_create_page(self):
        if self.create_page_var.get():
            slug = slugify(self.id_var.get() or self.title_var.get())
            if not self.href_var.get():
                self.href_var.set(f"/notes/{slug}/")
            self.page_section.pack(fill="both", expand=True, pady=6)
            if not self.paragraph_entries:
                self.add_paragraph()
        else:
            self.page_section.pack_forget()

    def add_paragraph(self):
        txt = tk.Text(self.p_container, height=3, width=50)
        txt.pack(fill="x", pady=3)
        self.paragraph_entries.append(txt)

    def build_page_html(self, slug):
        folder = os.path.join(SITE_DIR, "notes", slug)
        os.makedirs(folder, exist_ok=True)
        html_file = os.path.join(folder, "index.html")

        header = ""
        footer = ""
        if os.path.exists(HEADER_TXT):
            with open(HEADER_TXT, "r", encoding="utf-8") as f:
                header = f.read().rstrip()
        if os.path.exists(FOOTER_TXT):
            with open(FOOTER_TXT, "r", encoding="utf-8") as f:
                footer = f.read().lstrip()

        # Format lead tag using the note ID/slug
        lead_tag = f"// {slug}" if slug else "// note"

        # Generate paragraphs with page-header__sub
        paragraphs = []
        for p in self.paragraph_entries:
            text = p.get("1.0", tk.END).strip()
            if text:
                paragraphs.append(f'      <p class="page-header__sub">\n        {text}\n      </p>')
        
        paragraphs_markup = "\n".join(paragraphs)

        body = f"""
  <main class="container">
    <div class="page-header">
      <p class="page-header__tag">{lead_tag}</p>
      <h1 class="page-header__title">{self.title_var.get().strip()}</h1>
{paragraphs_markup}
    </div>
  </main>
"""

        with open(html_file, "w", encoding="utf-8") as f:
            f.write(f"{header}\n{body}\n{footer}")

    def save_note(self):
        note_id = self.id_var.get().strip() or slugify(self.title_var.get())
        title = self.title_var.get().strip()
        date = self.date_var.get().strip()
        href = self.href_var.get().strip()
        tags = [t.strip() for t in self.tags_var.get().split(",") if t.strip()]
        search = self.search_var.get().strip()

        if not all([note_id, title, date, href, tags, search]):
            messagebox.showerror("Error", "All fields are mandatory. Please fill in everything.", parent=self)
            return

        record = {
            "id": note_id,
            "title": title,
            "date": date,
            "href": href,
            "tags": tags,
            "search": search,
            "featured": self.featured_var.get()
        }

        # Call save_or_update_note with self.original_id
        save_or_update_note(NOTES_JS, "noteData", record, original_id=self.original_id)

        if self.create_page_var.get():
            self.build_page_html(note_id)

        self.destroy()
        # Determine action based on whether original_id existed
        action = "Modify" if self.original_id else "Create"

        self.destroy()
        prompt_git_commit(self.parent, action=action, item_id=note_id)


# ── Project Form & Dynamic Featured Logic ───────────────────────

class ProjectEditor(tk.Toplevel):
    def __init__(self, parent, existing_data=None):
        super().__init__(parent)
        self.parent = parent
        self.existing_data = existing_data or {}
        self.original_id = self.existing_data.get("id")

        self.title("Edit Project" if self.original_id else "Create Project")
        self.geometry("640x760")
        self.minsize(580, 500)

        self.links = []
        self.setup_ui()

    def setup_ui(self):
        ed = self.existing_data

        # Outer scrollable canvas container
        canvas = tk.Canvas(self, borderwidth=0, highlightthickness=0)
        scrollbar = ttk.Scrollbar(self, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, padding=16)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas_window = canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        
        def on_canvas_configure(event):
            canvas.itemconfig(canvas_window, width=event.width)

        canvas.bind("<Configure>", on_canvas_configure)
        canvas.configure(yscrollcommand=scrollbar.set)

        # Mouse wheel support
        def on_mousewheel(event):
            delta = -1 * int(event.delta / 120) if event.delta else (1 if event.num == 5 else -1)
            canvas.yview_scroll(delta, "units")

        canvas.bind_all("<MouseWheel>", on_mousewheel)
        canvas.bind_all("<Button-4>", on_mousewheel)
        canvas.bind_all("<Button-5>", on_mousewheel)

        scrollbar.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)

        # ── Basic Meta ──────────────────────────────────────────
        meta_frame = ttk.LabelFrame(scrollable_frame, text="Project Identification", padding=10)
        meta_frame.pack(fill="x", pady=(0, 12))

        ttk.Label(meta_frame, text="Project ID (slug):").grid(row=0, column=0, sticky="w", pady=4)
        self.id_var = tk.StringVar(value=ed.get("id", ""))
        ttk.Entry(meta_frame, textvariable=self.id_var, width=40).grid(row=0, column=1, sticky="ew", padx=8, pady=4)

        self.featured_var = tk.BooleanVar(value=bool(ed.get("featured", False)))
        feat_check = ttk.Checkbutton(
            meta_frame, 
            text="★ Feature this project on the homepage", 
            variable=self.featured_var,
            command=self.toggle_featured_fields
        )
        feat_check.grid(row=1, column=0, columnspan=2, sticky="w", pady=(6, 2))

        meta_frame.columnconfigure(1, weight=1)

        # ── Bilingual Content ───────────────────────────────────
        content_frame = ttk.LabelFrame(scrollable_frame, text="Titles & Descriptions", padding=10)
        content_frame.pack(fill="x", pady=(0, 12))

        ttk.Label(content_frame, text="Title (EN):").grid(row=0, column=0, sticky="w", pady=4)
        self.title_en_var = tk.StringVar(value=ed.get("title", {}).get("en", "") if isinstance(ed.get("title"), dict) else ed.get("title", ""))
        ttk.Entry(content_frame, textvariable=self.title_en_var).grid(row=0, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(content_frame, text="Title (FR):").grid(row=1, column=0, sticky="w", pady=4)
        self.title_fr_var = tk.StringVar(value=ed.get("title", {}).get("fr", "") if isinstance(ed.get("title"), dict) else "")
        ttk.Entry(content_frame, textvariable=self.title_fr_var).grid(row=1, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(content_frame, text="Description (EN):").grid(row=2, column=0, sticky="nw", pady=4)
        self.desc_en_text = tk.Text(content_frame, height=3, wrap="word")
        self.desc_en_text.grid(row=2, column=1, sticky="ew", padx=8, pady=4)
        en_desc_val = ed.get("description", {}).get("en", "") if isinstance(ed.get("description"), dict) else ed.get("description", "")
        self.desc_en_text.insert("1.0", en_desc_val)

        ttk.Label(content_frame, text="Description (FR):").grid(row=3, column=0, sticky="nw", pady=4)
        self.desc_fr_text = tk.Text(content_frame, height=3, wrap="word")
        self.desc_fr_text.grid(row=3, column=1, sticky="ew", padx=8, pady=4)
        fr_desc_val = ed.get("description", {}).get("fr", "") if isinstance(ed.get("description"), dict) else ""
        self.desc_fr_text.insert("1.0", fr_desc_val)

        ttk.Label(content_frame, text="Tags (comma separated):").grid(row=4, column=0, sticky="w", pady=4)
        tags_joined = ", ".join(ed.get("tags", []))
        self.tags_var = tk.StringVar(value=tags_joined)
        ttk.Entry(content_frame, textvariable=self.tags_var).grid(row=4, column=1, sticky="ew", padx=8, pady=4)

        content_frame.columnconfigure(1, weight=1)

        # ── Featured-Only Options ───────────────────────────────
        self.feat_frame = ttk.LabelFrame(scrollable_frame, text="Featured Spotlight Configuration", padding=10)
        self.feat_frame.pack(fill="x", pady=(0, 12))

        ttk.Label(self.feat_frame, text="Headline Lines EN (comma sep):").grid(row=0, column=0, sticky="w", pady=4)
        hl_en_raw = ed.get("headline", {}).get("en", []) if isinstance(ed.get("headline"), dict) else []
        self.hl_en_var = tk.StringVar(value=", ".join(hl_en_raw) if isinstance(hl_en_raw, list) else str(hl_en_raw))
        ttk.Entry(self.feat_frame, textvariable=self.hl_en_var).grid(row=0, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(self.feat_frame, text="Headline Lines FR (comma sep):").grid(row=1, column=0, sticky="w", pady=4)
        hl_fr_raw = ed.get("headline", {}).get("fr", []) if isinstance(ed.get("headline"), dict) else []
        self.hl_fr_var = tk.StringVar(value=", ".join(hl_fr_raw) if isinstance(hl_fr_raw, list) else str(hl_fr_raw))
        ttk.Entry(self.feat_frame, textvariable=self.hl_fr_var).grid(row=1, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(self.feat_frame, text="Eyebrow (EN):").grid(row=2, column=0, sticky="w", pady=4)
        eyebrow_en = ed.get("eyebrow", {}).get("en", "") if isinstance(ed.get("eyebrow"), dict) else ed.get("eyebrow", "")
        self.eyebrow_en_var = tk.StringVar(value=eyebrow_en)
        ttk.Entry(self.feat_frame, textvariable=self.eyebrow_en_var).grid(row=2, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(self.feat_frame, text="Eyebrow (FR):").grid(row=3, column=0, sticky="w", pady=4)
        eyebrow_fr = ed.get("eyebrow", {}).get("fr", "") if isinstance(ed.get("eyebrow"), dict) else ""
        self.eyebrow_fr_var = tk.StringVar(value=eyebrow_fr)
        ttk.Entry(self.feat_frame, textvariable=self.eyebrow_fr_var).grid(row=3, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(self.feat_frame, text="Badge Text:").grid(row=4, column=0, sticky="w", pady=4)
        self.badge_var = tk.StringVar(value=ed.get("badgeText", ""))
        ttk.Entry(self.feat_frame, textvariable=self.badge_var).grid(row=4, column=1, sticky="ew", padx=8, pady=4)

        ttk.Label(self.feat_frame, text="Code Snippet:").grid(row=5, column=0, sticky="nw", pady=4)
        self.code_snippet_text = tk.Text(self.feat_frame, height=5, wrap="none", font=("Courier", 10))
        self.code_snippet_text.grid(row=5, column=1, sticky="ew", padx=8, pady=4)
        self.code_snippet_text.insert("1.0", ed.get("codeSnippet", ""))

        self.feat_frame.columnconfigure(1, weight=1)

        # ── Dynamic Action Links ────────────────────────────────
        links_box = ttk.LabelFrame(scrollable_frame, text="Action Buttons / Links", padding=10)
        links_box.pack(fill="x", pady=(0, 12))

        self.links_container = ttk.Frame(links_box)
        self.links_container.pack(fill="x", pady=(0, 6))

        ttk.Button(links_box, text="+ Add Action Link", command=self.add_link_row).pack(anchor="w")

        # Load existing links or start with one empty row
        existing_links = ed.get("links", [])
        if existing_links:
            for l in existing_links:
                self.add_link_row(l)
        else:
            self.add_link_row()

        # ── Controls ────────────────────────────────────────────
        btn_frame = ttk.Frame(scrollable_frame)
        btn_frame.pack(fill="x", pady=16)

        save_btn_label = "Save Changes" if self.original_id else "Create Project"
        ttk.Button(btn_frame, text=save_btn_label, command=self.save_project).pack(side="right", padx=6)
        ttk.Button(btn_frame, text="Cancel", command=self.destroy).pack(side="right")

        self.toggle_featured_fields()

    def toggle_featured_fields(self):
        """Enables or disables spotlight fields based on the featured checkbox."""
        state = "normal" if self.featured_var.get() else "disabled"
        for child in self.feat_frame.winfo_children():
            try:
                child.configure(state=state)
            except tk.TclError:
                pass

    def add_link_row(self, data=None):
        data = data or {}
        row = ttk.Frame(self.links_container)
        row.pack(fill="x", pady=4)

        kind_var = tk.StringVar(value=data.get("kind", "primary"))
        href_var = tk.StringVar(value=data.get("href", ""))

        # Label resolution (handles string or bilingual dict)
        lbl_raw = data.get("label", "")
        if isinstance(lbl_raw, dict):
            len_val = lbl_raw.get("en", "")
            lfr_val = lbl_raw.get("fr", "")
        else:
            len_val = lbl_raw or ""
            lfr_val = ""

        len_var = tk.StringVar(value=len_val)
        lfr_var = tk.StringVar(value=lfr_val)

        ttk.Label(row, text="Type:").pack(side="left")
        ttk.Combobox(row, textvariable=kind_var, values=["primary", "ghost", "outline"], width=8, state="readonly").pack(side="left", padx=4)

        ttk.Label(row, text="URL:").pack(side="left", padx=(4, 0))
        ttk.Entry(row, textvariable=href_var, width=16).pack(side="left", padx=4)

        ttk.Label(row, text="EN:").pack(side="left", padx=(4, 0))
        ttk.Entry(row, textvariable=len_var, width=12).pack(side="left", padx=4)

        ttk.Label(row, text="FR:").pack(side="left", padx=(4, 0))
        ttk.Entry(row, textvariable=lfr_var, width=12).pack(side="left", padx=4)

        item_ref = {
            "frame": row,
            "kind": kind_var,
            "href": href_var,
            "label_en": len_var,
            "label_fr": lfr_var
        }

        def remove_row():
            if len(self.links) > 1:
                row.destroy()
                self.links.remove(item_ref)

        ttk.Button(row, text="✕", width=3, command=remove_row).pack(side="left", padx=4)
        self.links.append(item_ref)

    def save_project(self):
        pid = self.id_var.get().strip() or slugify(self.title_en_var.get())
        title_en = self.title_en_var.get().strip()
        title_fr = self.title_fr_var.get().strip()
        desc_en = self.desc_en_text.get("1.0", tk.END).strip()
        desc_fr = self.desc_fr_text.get("1.0", tk.END).strip()
        tags = [t.strip() for t in self.tags_var.get().split(",") if t.strip()]

        if not all([pid, title_en, desc_en, tags]):
            messagebox.showerror("Validation Error", "ID, EN Title, EN Description, and Tags are required.", parent=self)
            return

        is_featured = self.featured_var.get()
        hl_en = [x.strip() for x in self.hl_en_var.get().split(",") if x.strip()]
        hl_fr = [x.strip() for x in self.hl_fr_var.get().split(",") if x.strip()]
        eyebrow_en = self.eyebrow_en_var.get().strip()
        eyebrow_fr = self.eyebrow_fr_var.get().strip()
        badge = self.badge_var.get().strip()
        snippet = self.code_snippet_text.get("1.0", tk.END).strip()

        if is_featured:
            if not all([hl_en, eyebrow_en, badge, snippet]):
                messagebox.showerror(
                    "Validation Error", 
                    "Featured projects require Headline EN, Eyebrow EN, Badge, and a Code Snippet.", 
                    parent=self
                )
                return

        parsed_links = []
        for l in self.links:
            kind = l["kind"].get().strip()
            href = l["href"].get().strip()
            len_val = l["label_en"].get().strip()
            lfr_val = l["label_fr"].get().strip()

            if not all([kind, href, len_val]):
                continue

            link_obj = {
                "kind": kind,
                "href": href,
                "label": {"en": len_val, "fr": lfr_val} if lfr_val else len_val,
                "target": "_blank"
            }
            parsed_links.append(link_obj)

        record = {
            "id": pid,
            "featured": is_featured,
            "title": {"en": title_en, "fr": title_fr or title_en},
            "description": {"en": desc_en, "fr": desc_fr or desc_en},
            "tags": tags,
            "links": parsed_links
        }

        if is_featured:
            record["headline"] = {"en": hl_en, "fr": hl_fr or hl_en}
            record["eyebrow"] = {"en": eyebrow_en, "fr": eyebrow_fr or eyebrow_en}
            record["badgeText"] = badge
            record["codeSnippet"] = snippet

        # Writes directly to site/js/projects-data.js
        save_or_update_project(PROJECTS_JS, "projectData", record, original_id=self.original_id)

        # Determine action based on whether original_id existed
        action = "Modify" if self.original_id else "Create"

        self.destroy()
        prompt_git_commit(self.parent, action=action, item_id=pid)


# ── Execution Entrypoint ────────────────────────────────────────

if __name__ == "__main__":
    app = App()
    app.mainloop()