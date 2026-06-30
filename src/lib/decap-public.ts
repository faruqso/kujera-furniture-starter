/** Whether live Decap saves are enabled (GitHub auth + commits). Default: browse-only demo. */
export function isDecapEditEnabled(): boolean {
  return import.meta.env.PUBLIC_DECAP_EDIT_ENABLED === 'true';
}

/** Browse-only banner and save guards — live deployments only, not local dev. */
export function isDecapBrowseDemo(): boolean {
  return !isDecapEditEnabled() && !import.meta.env.DEV;
}

export function getTemplateRepoUrl(): string {
  return (
    import.meta.env.PUBLIC_DECAP_TEMPLATE_REPO ?? 'https://github.com/faruqso/kujera-furniture-starter'
  ).replace(/\/$/, '');
}

export function getTemplateForkUrl(): string {
  return `${getTemplateRepoUrl()}/fork`;
}

export function getDecapRepo(): string {
  return import.meta.env.PUBLIC_DECAP_REPO ?? 'faruqso/kujera-furniture-starter';
}
