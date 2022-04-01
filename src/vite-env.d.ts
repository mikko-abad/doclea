/// <reference types="svelte" />
/// <reference types="vite/client" />

import type { Octokit } from 'octokit'

declare module 'https://cdn.skypack.dev/octokit' {
  export class Octokit {}
}
