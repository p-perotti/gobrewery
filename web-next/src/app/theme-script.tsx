export function ThemeScript() {
  const code = `(() => {
    try {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (e) {
      // ignore
    }
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
