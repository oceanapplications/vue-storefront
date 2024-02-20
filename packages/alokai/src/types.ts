export interface Flags {
  [flag: string]: {
    description: string
    type: 'boolean' | 'string' | 'number'
    alias?: [string]
    options?: string[]
  }
}

export interface Args {
  [arg: string]: {
    description: string
    required: boolean
  }
}

export interface CommandOptions {
  flags?: Flags
  args?: Args
}
