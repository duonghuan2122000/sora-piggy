UI wrappers for Sora project (Ant Design migration)

Files:

- SoraButton.vue
- SoraInput.vue
- SoraIcon.vue
- SoraTable.vue

Guidelines:

- Keep wrapper props small and stable. Prefer mapping to existing app props to minimize changes in pages.
- All wrappers must be named with `Sora` prefix.
- Use Ant Design components internally (a-button, a-input, a-table, etc.).
- Export default component as usual for Vue single-file components.
