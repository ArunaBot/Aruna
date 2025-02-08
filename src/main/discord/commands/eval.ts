import { IDiscordFullCommandContext } from '../interfaces';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';
import { inspect } from 'util';
import { Discord } from 'arunabase';

export default class EvalCommand extends ArunaAsyncCommand {
  constructor() {
    super('eval', {
      name_localizations: {
        'pt-BR': 'eval',
      },
      description: 'Evaluate JavaScript code',
      description_localizations: {
        'pt-BR': 'Executa código JavaScript',
      },
      parameters: [
        {
          name: 'code',
          description: 'The code to evaluate',
          required: true,
          type: Discord.ApplicationCommandOptionType.String,
        },
      ],
      // isSlashCommand: false,
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    if (context.args.length === 0) {
      await context.discreteReply(new ErrorEmbed().setDescription('You must provide a code to evaluate!'));
      return;
    }

    const code = context.args.join(' ');

    if (code.toLowerCase().includes('process') && code.toLowerCase().includes('exit')) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can\'t use process.exit()!'));
      return;
    }

    if (code.toLowerCase().includes('client') && code.toLowerCase().includes('token')) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can\'t use client.token!'));
      return;
    }

    if (code.toLowerCase().includes('client') && code.toLowerCase().includes('destroy')) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can\'t use client.destroy()!'));
      return;
    }

    let result: any;
    try {
      const evaluate = await eval(code);
      result = inspect(evaluate, { depth: 1 });
    } catch (error) {
      await context.discreteReply(new ErrorEmbed().setDescription(`\`\`\`js\n${error}\n\`\`\``));
      return;
    }

    result = result.length > 1012 ? `${result.slice(0, 1009)}...` : result;

    if (result.includes(context.client.token)) result = result.replace(context.client.token, '[REDACTED]');

    const finalCode = code.length > 1012 ? `${code.slice(0, 1009)}...` : code;

    const finalEmbed = new DefaultEmbed()
      .setTitle('Eval')
      .addField('Input', `\`\`\`js\n${finalCode}\n\`\`\``)
      .addField('Output', `\`\`\`js\n${result}\n\`\`\``);

    await context.discreteReply(finalEmbed);
  }

  public override checkPermission(context: IDiscordFullCommandContext): boolean {
    if (context.botDevelopers.includes(context.author.id)) return true;
    context.discreteReply(new ErrorEmbed().setDescription('You don\'t have permission to use this command!'));
    return false;
  }
}
