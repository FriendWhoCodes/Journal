# Preferences & Workflows

## Git Workflow

- **NEVER push directly to main**
- Always create a feature branch
- Always raise a PR for review
- Branch naming: `feat/<feature>`, `fix/<issue>`, `refactor/<area>`

```bash
# Correct workflow
git checkout -b feat/my-feature
# ... make changes ...
git commit -m "Description"
git push -u origin feat/my-feature
gh pr create --title "Title" --body "Description"
# Wait for review/merge
```

## Code Style

- No emojis unless explicitly requested
- Keep solutions simple - avoid over-engineering
- Prefer editing existing files over creating new ones

## Communication

- Be concise and direct
- Use tables for comparisons
- Show plans before implementing large changes

## Context Maintenance

- Update `.context/` docs when:
  - New infrastructure is added
  - Key decisions are made
  - Roadmap changes
  - New preferences are established
- Keep decision log updated with rationale
- Mark roadmap items complete when done

## Deployment

- Always create PR first
- After PR merge: pull main, then deploy
- Standard deploy command:
  ```bash
  ssh hetzner 'cd /var/www/Journal/<app> && git pull && npm run build && pm2 restart <app-name>'
  ```

## Testing

- Test locally before creating PR when possible
- Verify deployment after merge
