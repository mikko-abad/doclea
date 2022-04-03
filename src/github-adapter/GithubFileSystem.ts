import type { SFError } from '@lib/SFError'
import type {
  StorageFrameworkEntry,
  StorageFrameworkProvider,
} from '@lib/StorageFrameworkEntry'
import { Result } from '@lib/utilities'
import { Octokit } from 'https://cdn.skypack.dev/octokit'

import { GithubDirectoryEntry } from './GithubDirectoryEntry'

export class GithubFileSystem implements StorageFrameworkProvider {
  static readonly config = {
    owner: 'rattle99',
    repo: 'QtNotepad',
  }

  open(): Result<StorageFrameworkEntry, SFError> {
    return new Result((resolve) => {
      this.readDirFromGithub().then((githubEntry) => {
        resolve(githubEntry)
      })
    })
  }

  private async readDirFromGithub() {
    const octokit = new Octokit()
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: GithubFileSystem.config.owner,
        repo: GithubFileSystem.config.repo,
        path: '',
      }
    )
    return new GithubDirectoryEntry(null, data, true)
  }
}
