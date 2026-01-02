# Andy Woodruff

## Hugo Commands
- `hugo new content content/folder/name.md` - Create a new markdown file in the specified folder.
- `hugo new --kind book content/reviews/my-new-book-post.md` - Create a file with a specific archetype
- `hugo server -D --ignoreCache` - Start the hugo server with drafts enabled and ignores cache.

## Modifying the Theme
- Update layouts by adding / modifying files in the `layouts` directory.
- Anything smaller than an h3 looks too small.

## Content Guidelines
- Use YAML front matter (`---`) not TOML (`+++`) for all content files
- See [TAGS.md](TAGS.md) for tagging rules and approved tags (max 5 per file)
