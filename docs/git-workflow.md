
# Git Workflow

## 1. Main Branch

`main` contains stable and reviewed project code.

Never develop directly on `main`.

## 2. Branch Naming

Use the following conventions:

- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation changes
- `setup/` for project configuration

Examples:

- `feature/donor-management`
- `feature/blood-stock`
- `feature/authentication`
- `fix/login-validation`
- `docs/api-contracts`
- `setup/frontend-initialization`

## 3. Development Workflow

For every task:

1. Start from the latest `main`.
2. Create a new branch.
3. Implement your assigned task.
4. Test your changes.
5. Commit your work.
6. Push your branch.
7. Create a Pull Request into `main`.
8. Wait for review before merging.

## 4. Commit Message Convention

Use clear commit messages:

- `feat: add donor registration`
- `fix: correct login validation`
- `docs: update database design`
- `chore: configure project`
- `refactor: improve donor service`

## 5. Important Rules

- Never push unfinished work directly to `main`.
- Do not modify another member's files without coordination.
- Pull the latest changes before starting a task.
- Keep commits focused on one task.
- Review Pull Requests before merging.
- Communicate before changing shared files or database structures.
