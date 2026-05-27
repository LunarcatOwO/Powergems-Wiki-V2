import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        text: 'Download Powergems',
        url: 'https://modrinth.com/plugin/powergems',
        active: 'nested-url',
      },
      {
        text: 'Download Seallib',
        url: 'https://modrinth.com/plugin/seallib',
        active: 'nested-url',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
