import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'eidStack-CMU',
      description: 'SSI DID Issuance & Verification API',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/idsecosystem/eidStack-CMU' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction',      link: '/guides/introduction'  },
            { label: 'Installation',      link: '/guides/installation'  },
            { label: 'Environment Setup', link: '/guides/env-setup'     },
          ],
        },
        {
          label: 'SSI Concepts',
          items: [
            { label: 'What is SSI?',       link: '/concepts/ssi'               },
            { label: 'Issuance Flow',      link: '/concepts/issuance-flow'     },
            { label: 'Verification Flow',  link: '/concepts/verification-flow' },
          ],
        },
        {
          label: 'Module Guides',
          items: [
            { label: 'Agent',        link: '/modules/agent'        },
            { label: 'Connection',   link: '/modules/connection'   },
            { label: 'Issuance',     link: '/modules/issuance'     },
            { label: 'Verification', link: '/modules/verification' },
            { label: 'Short URL',    link: '/modules/short-url'    },
            { label: 'Email',        link: '/modules/email'        },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: '⚡ Interactive API Docs', link: '/api-reference' },
          ],
        },
      ],
    }),
  ],
});
