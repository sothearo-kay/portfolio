import Fuse from "fuse.js"

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

  get fuse() {
    return new Fuse(this._commands, {
      keys: ["title", "group"],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
    })
  }

  get filteredCommands() {
    if (!this._search.trim()) {
      return this._commands.filter(cmd => cmd.visible ? cmd.visible() : true)
    }

    const results = this.fuse.search(this._search)
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
