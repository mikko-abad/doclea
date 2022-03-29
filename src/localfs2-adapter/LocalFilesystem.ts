import { SFError } from '@lib/SFError'
import type { StorageFrameworkEntry } from '@lib/StorageFrameworkEntry'
import type { StorageFrameworkFileSystem } from '@lib/StorageFrameworkFileSystem'
import { Result } from '@lib/utilities'
import LocalLegacyDirectoryEntry from './legacy/LocalLegacyDirectoryEntry'

export class LocalFileSystem2 implements StorageFrameworkFileSystem {
  open(): Result<StorageFrameworkEntry, SFError> {
    return new Result(async (resolve, reject) => {
      if (window.showOpenFilePicker) {
        const [fileHandle] = await window.showOpenFilePicker()

        console.log(fileHandle)
        // new LocalAccessDirectoryEntry(fileHandle)
      } else {
        const el = document.createElement('input')
        el.setAttribute('type', 'file')
        el.setAttribute('webkitdirectory', 'true')

        el.click()

        el.onchange = (ev) => {
          resolve(new LocalLegacyDirectoryEntry(ev.target.files))
        }
      }
    })
  }
}
