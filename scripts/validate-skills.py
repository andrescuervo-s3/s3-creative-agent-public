#!/usr/bin/env python3
"""Validate every SKILL.md against the Agent Skills spec.

A skill whose frontmatter violates the spec is silently rejected by the loader:
it never registers, never fires, and editing its body has no effect. Run this
before every commit.

    python3 scripts/validate-skills.py
"""
import os
import re
import sys

SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                          "s3-creative-agent", "skills")

MAX_NAME = 64
MAX_DESC = 1024
BODY_WARN_LINES = 500
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def parse_frontmatter(fm: str) -> dict:
    """Top-level scalars plus `key: |` block scalars. Enough for SKILL.md."""
    out, lines, i = {}, fm.split("\n"), 0
    while i < len(lines):
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", lines[i])
        if not m:
            i += 1
            continue
        key, val = m.group(1), m.group(2).strip()
        if val in ("|", ">", "|-", ">-", "|+", ">+"):
            block = []
            i += 1
            while i < len(lines) and (lines[i].startswith((" ", "\t")) or not lines[i].strip()):
                block.append(lines[i].strip())
                i += 1
            out[key] = " ".join(x for x in block if x)
        else:
            out[key] = val.strip("\"'")
            i += 1
    return out


def validate(directory: str, path: str):
    errors, warnings = [], []
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return ["missing YAML frontmatter"], [], 0, 0

    fm = parse_frontmatter(m.group(1))
    name = fm.get("name", "")
    desc = fm.get("description", "")

    if not name:
        errors.append("`name` missing")
    else:
        if name != directory:
            errors.append(f"`name` is {name!r} but directory is {directory!r} (must match)")
        if len(name) > MAX_NAME:
            errors.append(f"`name` is {len(name)} chars (max {MAX_NAME})")
        if not NAME_RE.match(name):
            errors.append(f"`name` {name!r} must be lowercase letters, digits, single hyphens")

    if not desc:
        errors.append("`description` missing or empty")
    elif len(desc) > MAX_DESC:
        errors.append(f"`description` is {len(desc)} chars (max {MAX_DESC}) "
                      f"— SKILL WILL NOT REGISTER, over by {len(desc) - MAX_DESC}")

    body_lines = len(text[m.end():].split("\n"))
    if body_lines > BODY_WARN_LINES:
        warnings.append(f"body is {body_lines} lines (target <{BODY_WARN_LINES}); "
                        "move detail into references/")

    for ref in re.findall(r"references/[A-Za-z0-9._-]+\.md", text):
        if not os.path.isfile(os.path.join(os.path.dirname(path), ref)):
            errors.append(f"references a missing file: {ref}")

    return errors, warnings, len(desc), body_lines


def main() -> int:
    if not os.path.isdir(SKILLS_DIR):
        print(f"skills directory not found: {SKILLS_DIR}")
        return 2

    failed = False
    for directory in sorted(os.listdir(SKILLS_DIR)):
        path = os.path.join(SKILLS_DIR, directory, "SKILL.md")
        if not os.path.isfile(path):
            continue
        errors, warnings, dlen, blen = validate(directory, path)
        status = "FAIL" if errors else ("warn" if warnings else "ok")
        print(f"[{status:4s}] {directory:32s} desc={dlen:4d}/{MAX_DESC}  body={blen}L")
        for e in errors:
            failed = True
            print(f"         ERROR: {e}")
        for w in warnings:
            print(f"         warn:  {w}")

    print()
    print("FAILED — fix the errors above before committing." if failed
          else "All skills valid.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
