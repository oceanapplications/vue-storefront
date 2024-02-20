import { GluegunCommand } from 'gluegun'
import { CommandOptions } from '../types'

const options: CommandOptions = {
  flags: {
    unified: {
      alias: ['u'],
      type: 'boolean',
      description: 'Create a new Alokai Unified Storefront Application',
    },
    ecommerce: {
      alias: ['e'],
      type: 'string',
      description:
        'Create a new Alokai Storefront Application with a specific ecommerce platform or unified',
      options: ['sapcc', 'sfcc', 'magento'],
    },
  },
  args: {
    name: {
      description: 'Name of the new Alokai Storefront Application',
      required: true,
    },
  },
}

const command: GluegunCommand = {
  name: 'root',
  alias: ['i'],
  description: 'Create a new Alokai Storefront Application',
  async run(toolbox) {
    // const args = toolbox.parameters.string
    const flags = toolbox.parameters.options

    // due to the way Gluegun works, we need to check for help flags manually
    if (flags.help || flags.h) {
      toolbox.help(options, this.name)
    }

    console.log('Creating a new Alokai Storefront Application')
  },
}

export default command
