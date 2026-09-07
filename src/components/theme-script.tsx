'use client'

import * as React from 'react'

const STORAGE_KEY = 'freelancer-crm-theme'

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var stored = localStorage.getItem('${STORAGE_KEY}');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var theme = stored || (prefersDark ? 'dark' : 'light');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  )
}
