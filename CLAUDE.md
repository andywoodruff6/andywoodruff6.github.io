# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Andy Woodruff's personal website built with Hugo static site generator using the PaperMod theme. The site features a personal blog with sections for Projects, Predictions, Ideas, and Curation content.

## Development Commands

- `hugo server -D --ignoreCache` - Start local development server with drafts enabled and cache ignored
- `hugo new content content/folder/name.md` - Create a new markdown file in the specified folder
- `hugo new --kind review content/reviews/my-new-review.md` - Create a file with a specific archetype
- `hugo` - Build the static site (outputs to `public/` directory)

## Architecture

### Content Structure
- `content/` - All markdown content files organized by section
  - `projects/` - Project descriptions and case studies
  - `predictions/` - Future predictions and analysis
  - `ideas/` - Personal thoughts and ideas
  - `curation/` - Curated content and book reviews
  - `about/` - About page content
  - `archives/` - Archive page

### Theme Customization
- `layouts/` - Custom layout overrides for the PaperMod theme
- `assets/css/` - Custom CSS files that extend the theme
- Theme files are in `themes/PaperMod/` but should not be modified directly
- Use `layouts/` directory to override theme templates

### Configuration
- `config.yaml` - Main Hugo configuration with site settings, menu structure, and PaperMod theme parameters
- Navigation menu defined with Projects, Predictions, Ideas, Curation, About, and Archives sections

### Static Assets
- `static/images/` - Images used in content (copied to `public/images/`)
- `public/` - Generated static site (do not edit directly)

## Content Creation Notes

- All content sections use front matter for metadata
- Images should be placed in `static/images/` and referenced as `/images/filename.jpg`
- The site uses PaperMod theme features like cover images, breadcrumbs, and share buttons
- Headings smaller than h3 appear too small per the README guidance
- **Tagging**: Follow the rules in [TAGS.md](TAGS.md) - max 5 tags, use approved tags only