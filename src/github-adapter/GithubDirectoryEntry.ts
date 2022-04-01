import type { SFError } from '@/lib/SFError'
import type {
  StorageFrameworkDirectoryEntry,
  StorageFrameworkEntry,
  StorageFrameworkFileEntry,
} from '@/lib/StorageFrameworkEntry'
import { Result, OkOrError } from '@/lib/utilities'
import { ResolvedPos } from '@milkdown/prose'
import { Octokit } from 'https://cdn.skypack.dev/octokit'
import { GithubFileEntry } from './GithubFileEntry'
import { GithubFileSystem } from './GithubFileSystem'

export class GithubDirectoryEntry implements StorageFrameworkDirectoryEntry {
  readonly isDirectory: true
  readonly isFile: false
  readonly fullPath: string
  readonly name: string
  isRoot: boolean
  children: StorageFrameworkEntry[] = []
  parent: StorageFrameworkDirectoryEntry

  constructor(
    parent: StorageFrameworkDirectoryEntry,
    githubEntry,
    isRoot: boolean
  ) {
    this.parent = parent
    this.name = githubEntry.name
    this.fullPath = githubEntry.path
    this.isDirectory = true
    this.isFile = false
    this.isRoot = isRoot

    githubEntry.forEach((element) => {
      if (element.type == 'dir') {
        this.addDirectory(element)
      } else if (element.type == 'file') {
        this.addFile(element)
      }
    })
  }

  getChildren(): Result<StorageFrameworkEntry[], SFError> {
    return new Result(() => {
      this.children
    })
  }

  createFile(name: string): Result<StorageFrameworkFileEntry, SFError> {
    throw new Error('Method not implemented.')
  }

  createDirectory(
    name: string
  ): Result<StorageFrameworkDirectoryEntry, SFError> {
    throw new Error('Method not implemented.')
  }

  getParent(): Result<StorageFrameworkDirectoryEntry, SFError> {
    return new Result(() => {
      this.parent
    })
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

  private addFile(githubObj): StorageFrameworkFileEntry {
    const githubFile = new GithubFileEntry(this, githubObj)
    this.children.push(githubFile)
    return githubFile
  }

  private addDirectory(
    githubObj
  ): Result<StorageFrameworkDirectoryEntry, SFError> {
    return new Result((resolve) => {
      this.readDirFromGithub(githubObj).then((githubEntry) =>
        resolve(githubEntry)
      )
    })
  }

  private readDirFromGithub = async (githubObj) => {
    let pathToGet = githubObj.name
    if (this.fullPath != null) {
      pathToGet = this.fullPath + '/' + githubObj.name
    }

    const octokit = new Octokit()
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: GithubFileSystem.config.owner,
        repo: GithubFileSystem.config.repo,
        path: pathToGet,
      }
    )

    // const githubEntry = {
    //   path: pathToGet,
    //   name: name,
    // }

    const githubDirectory = new GithubDirectoryEntry(this, data, false)
    this.children.push(githubDirectory)
    return githubDirectory
  }
}
