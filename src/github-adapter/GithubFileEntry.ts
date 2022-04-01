import type { SFError } from '@/lib/SFError'
import type { SFFile } from '@/lib/SFFile'
import type {
  StorageFrameworkDirectoryEntry,
  StorageFrameworkFileEntry,
} from '@/lib/StorageFrameworkEntry'
import type { Result, OkOrError } from '@/lib/utilities'

export class GithubFileEntry implements StorageFrameworkFileEntry {
  readonly isDirectory: false
  readonly isFile: true
  readonly fullPath: string
  readonly name: string
  readonly content_url: string
  private parent: StorageFrameworkDirectoryEntry

  constructor(parent, githubObj) {
    this.parent = parent
    this.name = githubObj.name
    this.fullPath = githubObj.path
    this.isDirectory = false
    this.isFile = true
    this.content_url = githubObj.download_url
  }

  read(): Result<SFFile, SFError> {
    throw new Error('Method not implemented.')
  }
  save(file: File): OkOrError<SFError> {
    throw new Error('Method not implemented.')
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
