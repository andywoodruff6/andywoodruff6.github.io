# Tag Rules and Guidelines

This document defines the rules and conventions for tagging content on the personal website.

## Core Tagging Principles

1. **Tag Limit**: Maximum of 5 tags per content file (fewer is fine)
2. **Consistency**: Use standardized tag formats and naming conventions
3. **Discoverability**: Tags should help visitors find related content quickly
4. **Purpose-driven**: Every tag should serve a clear organizational purpose

## Approved Tags

### Content Type Tags
- `books` - Book reviews and summaries
- `projects` - Project descriptions and case studies
- `predictions` - Future predictions and analysis
- `ideas` - Personal thoughts and concepts

### Topic Tags
- `AI` - Artificial intelligence related content
- `identity` - Digital identity and SSI topics
- `business` - Business strategy and entrepreneurship
- `personal` - Personal development and reflections
- `tech` - Technical implementation and tools

### Series Tags
- `yearly-theme` - Annual theme posts
- `starter-kit` - Foundational guides and frameworks

## Tag Formatting Rules

1. **Lowercase preferred**: Use lowercase for multi-word tags (`yearly-theme`)
2. **Hyphens for compound words**: Use hyphens for multi-word tags (`starter-kit`)
3. **No spaces**: Replace spaces with hyphens
4. **Short and specific**: Tags should be concise but meaningful

## Tags to Avoid

- **Author names** (e.g., "Peter Thiel", "Simon Sinek") - Use content to reference authors instead
- **Single letter tags** (`a`, `x`)
- **Overly generic tags** (`stuff`, `misc`, `other`)
- **Redundant tags** that duplicate the content section (e.g., don't tag a file in `/curation/` with `curation`)
- **Date-based tags** - Hugo handles dates in front matter

## Before Adding a New Tag

1. Check if an existing approved tag serves the same purpose
2. Consider if the tag will be reused across multiple posts
3. Ensure the tag follows the formatting rules above
4. If a new tag is needed, add it to this document first

## Examples

**Good tagging:**
```yaml
# Book review
tags: [books, AI, business]

# Yearly theme post
tags: [yearly-theme, personal]

# Project page
tags: [projects, identity, tech]
```

**Bad tagging:**
```yaml
# Too many tags
tags: [books, AI, business, Simon Sinek, leadership, negotiation, 2024]

# Author as tag
tags: [books, Peter Thiel]

# Redundant with section
tags: [projects, projects-page, my-project]
```

---

*Last updated: 2026-01-02*
