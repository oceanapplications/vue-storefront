import { GluegunToolbox } from 'gluegun'
import { CommandOptions } from '../types'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
const alokaiToolbox = (toolbox: GluegunToolbox) => {
  toolbox.help = (options: CommandOptions, command: string) => {
    const { print } = toolbox

    print.info(command)

    print.info(
      `Example: ${print.colors.bgGreen(
        'npx alokai init my-storefront -e sapcc -f nextjs'
      )}`
    )

    if (options.flags) {
      print.info('Flags:')
      Object.keys(options.flags).forEach((flag) => {
        print.info(
          print.colors.yellow(`  --${flag} or -${options.flags[flag].alias}`)
        )
        print.info(`    ${options.flags[flag].description}`)

        if (options.flags[flag].options) {
          print.muted(
            `    Options: ${options.flags[flag].options
              .map((option) => print.colors.yellow(option))
              .join(', ')}`
          )
        }
      })
    }

    if (options.args) {
      print.info('Args:')
      Object.keys(options.args).forEach((arg) => {
        print.info(print.colors.yellow(`  ${arg}`))
        print.info(`    ${options.args[arg].description}`)
        print.muted(
          `    ${options.args[arg].required ? 'Required' : 'Optional'}`
        )
      })
    }

    print.info('')
    print.info('')
    print.info('Good luck 👋')
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "alokai" property),
  // alokai.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("alokai", process.cwd())
  // }
}

export default alokaiToolbox
