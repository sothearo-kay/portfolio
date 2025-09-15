import type Fuse from "fuse.js"

export interface Command {
  id?: string
  title: string | (() => string)
  to?: string
  visible?: () => boolean
  handler?: () => void
  icon?: string | (() => string)
  group?: string
}

class CommandStore {
  _search = $state("")
  _isShown = $state(false)
  _commands = $state<Command[]>([])
  _fuse: Fuse<Command> | null = null

  get search() {
    return this._search
  }

  set search(value: string) {
    this._search = value
  }

  get isShown() {
    return this._isShown
  }

  get commands() {
    return this._commands
  }

  async getFuse() {
    if (!this._fuse) {
      const { default: Fuse } = await import("fuse.js")
      this._fuse = new Fuse(this._commands, {
        keys: ["title", "group"],
        threshold: 0.3,
        includeScore: true,
        ignoreLocation: true,
      })
    }
    return this._fuse
  }

  async filteredCommands() {
    if (!this._search.trim()) {
      return this._commands.filter(cmd => cmd.visible ? cmd.visible() : true)
    }

    const fuse = await this.getFuse()
    const results = fuse.search(this._search)
    return results
      .map(result => result.item)
      .filter(cmd => cmd.visible ? cmd.visible() : true)
  }

  addCommands(...newCommands: Command[]) {
    this._commands.push(...newCommands)
  }

  removeCommands(...commandsToRemove: Command[]) {
    this._commands = this._commands.filter(cmd => !commandsToRemove.includes(cmd))
  }

  clearCommands() {
    this._commands = []
  }

  show() {
    this._isShown = true
  }

  hide() {
    this._isShown = false
    this._search = ""
  }
}

export const commandStore = new CommandStore()
