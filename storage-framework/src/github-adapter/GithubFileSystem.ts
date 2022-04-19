import { Octokit } from '@octokit/core'
import { SFError } from '../lib/SFError'
import {
  StorageFrameworkProvider,
  StorageFrameworkEntry,
} from '../lib/StorageFrameworkEntry'
import { Result } from '../lib/utilities'
import { GithubDirectoryEntry } from './GithubDirectoryEntry'

export class GithubFileSystem implements StorageFrameworkProvider {
  static readonly config = {
    owner: 'rattle99',
    repo: 'QtNotepad',
  }

  octokit: Octokit

  constructor() {
    this.octokit = new Octokit()
    window.temp = this // only for development
  }

  open(): Result<StorageFrameworkEntry, SFError> {
    return new Result((resolve) => {
      this.readDirFromGithub().then((githubEntry) => {
        resolve(githubEntry)
      })
    })
  }

  private async readDirFromGithub() {
    // const octokit = new Octokit()
    const { data } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: GithubFileSystem.config.owner,
        repo: GithubFileSystem.config.repo,
        path: '',
      }
    )
    return new GithubDirectoryEntry(null, data, true, this.octokit)
  }
}
