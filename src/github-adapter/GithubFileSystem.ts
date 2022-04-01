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

  readDirFromGithub = async () => {
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

// const initFileSystem = async (root: GithubDirectory) => {
//   const octokit = new Octokit()
//   const { data } = await octokit.request(
//     'GET /repos/{owner}/{repo}/contents/{path}',
//     {
//       owner: 'octokit',
//       repo: 'core.js',
//       path: '',
//     }
//   )
//   let root = new GithubDirectoryEntry(data, true)
//   const mock = JSON.parse(
//     '[  {    "name": ".github",    "path": ".github",    "sha": "89d16e7e54859b4f7fc8d49fbc7406b77af07bce",    "size": 0,    "url": "https://api.github.com/repos/octokit/core.js/contents/.github?ref=master",    "html_url": "https://github.com/octokit/core.js/tree/master/.github",    "git_url": "https://api.github.com/repos/octokit/core.js/git/trees/89d16e7e54859b4f7fc8d49fbc7406b77af07bce",    "download_url": null,    "type": "dir",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/.github?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/trees/89d16e7e54859b4f7fc8d49fbc7406b77af07bce",      "html": "https://github.com/octokit/core.js/tree/master/.github"    }  },  {    "name": ".gitignore",    "path": ".gitignore",    "sha": "7fdd5aac432c2730f01eefcffe1c0aac88ec5862",    "size": 29,    "url": "https://api.github.com/repos/octokit/core.js/contents/.gitignore?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/.gitignore",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/7fdd5aac432c2730f01eefcffe1c0aac88ec5862",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/.gitignore",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/.gitignore?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/7fdd5aac432c2730f01eefcffe1c0aac88ec5862",      "html": "https://github.com/octokit/core.js/blob/master/.gitignore"    }  },  {    "name": "CODE_OF_CONDUCT.md",    "path": "CODE_OF_CONDUCT.md",    "sha": "8124607bcee0a2d45a184fdfb0bad5463dddcd0f",    "size": 3226,    "url": "https://api.github.com/repos/octokit/core.js/contents/CODE_OF_CONDUCT.md?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/CODE_OF_CONDUCT.md",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/8124607bcee0a2d45a184fdfb0bad5463dddcd0f",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/CODE_OF_CONDUCT.md",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/CODE_OF_CONDUCT.md?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/8124607bcee0a2d45a184fdfb0bad5463dddcd0f",      "html": "https://github.com/octokit/core.js/blob/master/CODE_OF_CONDUCT.md"    }  },  {    "name": "CONTRIBUTING.md",    "path": "CONTRIBUTING.md",    "sha": "29e10cfce4469da58b2b2b39622fe1ea14612a16",    "size": 4315,    "url": "https://api.github.com/repos/octokit/core.js/contents/CONTRIBUTING.md?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/CONTRIBUTING.md",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/29e10cfce4469da58b2b2b39622fe1ea14612a16",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/CONTRIBUTING.md",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/CONTRIBUTING.md?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/29e10cfce4469da58b2b2b39622fe1ea14612a16",      "html": "https://github.com/octokit/core.js/blob/master/CONTRIBUTING.md"    }  },  {    "name": "LICENSE",    "path": "LICENSE",    "sha": "ef2c18ee5b589fab48c4e670b4211231bd294f52",    "size": 1081,    "url": "https://api.github.com/repos/octokit/core.js/contents/LICENSE?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/LICENSE",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/ef2c18ee5b589fab48c4e670b4211231bd294f52",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/LICENSE",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/LICENSE?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/ef2c18ee5b589fab48c4e670b4211231bd294f52",      "html": "https://github.com/octokit/core.js/blob/master/LICENSE"    }  },  {    "name": "README.md",    "path": "README.md",    "sha": "b540cb9375cb4b6d25a058a32894833b341a7106",    "size": 12238,    "url": "https://api.github.com/repos/octokit/core.js/contents/README.md?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/README.md",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/b540cb9375cb4b6d25a058a32894833b341a7106",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/README.md",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/README.md?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/b540cb9375cb4b6d25a058a32894833b341a7106",      "html": "https://github.com/octokit/core.js/blob/master/README.md"    }  },  {    "name": "package-lock.json",    "path": "package-lock.json",    "sha": "06cbda4dd7eb5d1f103e87b4550b416891eabdf5",    "size": 557785,    "url": "https://api.github.com/repos/octokit/core.js/contents/package-lock.json?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/package-lock.json",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/06cbda4dd7eb5d1f103e87b4550b416891eabdf5",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/package-lock.json",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/package-lock.json?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/06cbda4dd7eb5d1f103e87b4550b416891eabdf5",      "html": "https://github.com/octokit/core.js/blob/master/package-lock.json"    }  },  {    "name": "package.json",    "path": "package.json",    "sha": "19765c20fdec739a57a68f7d14cd508e758f6247",    "size": 2662,    "url": "https://api.github.com/repos/octokit/core.js/contents/package.json?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/package.json",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/19765c20fdec739a57a68f7d14cd508e758f6247",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/package.json",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/package.json?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/19765c20fdec739a57a68f7d14cd508e758f6247",      "html": "https://github.com/octokit/core.js/blob/master/package.json"    }  },  {    "name": "src",    "path": "src",    "sha": "e9b45e9435cdbd309998b1df1a352134df4f3c05",    "size": 0,    "url": "https://api.github.com/repos/octokit/core.js/contents/src?ref=master",    "html_url": "https://github.com/octokit/core.js/tree/master/src",    "git_url": "https://api.github.com/repos/octokit/core.js/git/trees/e9b45e9435cdbd309998b1df1a352134df4f3c05",    "download_url": null,    "type": "dir",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/src?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/trees/e9b45e9435cdbd309998b1df1a352134df4f3c05",      "html": "https://github.com/octokit/core.js/tree/master/src"    }  },  {    "name": "test",    "path": "test",    "sha": "d1d8e39c571480903f14ac3777b4091545dc400e",    "size": 0,    "url": "https://api.github.com/repos/octokit/core.js/contents/test?ref=master",    "html_url": "https://github.com/octokit/core.js/tree/master/test",    "git_url": "https://api.github.com/repos/octokit/core.js/git/trees/d1d8e39c571480903f14ac3777b4091545dc400e",    "download_url": null,    "type": "dir",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/test?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/trees/d1d8e39c571480903f14ac3777b4091545dc400e",      "html": "https://github.com/octokit/core.js/tree/master/test"    }  },  {    "name": "tsconfig.json",    "path": "tsconfig.json",    "sha": "187306e3e6058d0ba8fe7f6ed36bac2bf1a0c00d",    "size": 186,    "url": "https://api.github.com/repos/octokit/core.js/contents/tsconfig.json?ref=master",    "html_url": "https://github.com/octokit/core.js/blob/master/tsconfig.json",    "git_url": "https://api.github.com/repos/octokit/core.js/git/blobs/187306e3e6058d0ba8fe7f6ed36bac2bf1a0c00d",    "download_url": "https://raw.githubusercontent.com/octokit/core.js/master/tsconfig.json",    "type": "file",    "_links": {      "self": "https://api.github.com/repos/octokit/core.js/contents/tsconfig.json?ref=master",      "git": "https://api.github.com/repos/octokit/core.js/git/blobs/187306e3e6058d0ba8fe7f6ed36bac2bf1a0c00d",      "html": "https://github.com/octokit/core.js/blob/master/tsconfig.json"    }  }]'
//   )

//   const data = mock
// }
