# Release process

## 1) Update
- Ensure `main` is green
- Update `CHANGELOG.md` (move items into a version)

## 2) Tag
```bash
git checkout main
git pull
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
