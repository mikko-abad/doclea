import type { SFError } from '@/lib/SFError'
import { SFFile } from '@/lib/SFFile'
import type {
  StorageFrameworkDirectoryEntry,
  StorageFrameworkFileEntry,
} from '@/lib/StorageFrameworkEntry'
import { Result, OkOrError } from '@/lib/utilities'
import { Octokit } from 'https://cdn.skypack.dev/octokit'
import { GithubFileSystem } from './GithubFileSystem'

export class GithubFileEntry implements StorageFrameworkFileEntry {
  readonly isDirectory = false
  readonly isFile = true
  readonly fullPath: string
  readonly name: string
  readonly content_url: string
  private parent: StorageFrameworkDirectoryEntry
  octokit: Octokit

  constructor(parent, githubObj, octokit) {
    this.parent = parent
    this.name = githubObj.name
    this.fullPath = githubObj.path
    this.content_url = githubObj.download_url,
    this.octokit = octokit
  }

  read(): Result<SFFile, SFError> {
    return new Result((resolve, reject) => {
      var xmlHttp = new XMLHttpRequest();
      var nameFile = this.name
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var stuff = new SFFile(nameFile, 123, [xmlHttp.responseText])
              resolve(stuff);
            }
      }
      xmlHttp.open("GET", this.content_url, true); // true for asynchronous 
      xmlHttp.send(null);
    })
  }

  save(file: File): OkOrError<SFError> {
    return new Result((resolve, reject) => {
      this.saveFileInGithub(file)
    })
  }

  private async saveFileInGithub(file: File) {
    // const octokit = new Octokit()
    const { data } = await this.octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: GithubFileSystem.config.owner,
        repo: GithubFileSystem.config.repo,
        path: this.fullPath,
        message: 'update content',
        content: file.text
      }
    )
    return
  }

  getParent(): Result<StorageFrameworkDirectoryEntry, SFError> {
    throw new Error('Method not implemented.')
  }

  moveTo(directory: StorageFrameworkDirectoryEntry): OkOrError<SFError> {
    throw new Error('Method not implemented.')
  }
  rename(name: string): OkOrError<SFError> {
    throw new Error('Method not implemented.')
  }
  remove(): OkOrError<SFError> {
    throw new Error('Method not implemented.')
  }
}
