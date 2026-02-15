import { IDiscordFullCommandContext } from '../interfaces';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structure';
import { Discord } from 'arunabase';
import { inspect } from 'util';

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
      isSlashCommand: false,
      category: 'Developer',
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

    if (code.toLowerCase().includes('databaseconnection')) {
      await context.discreteReply(new ErrorEmbed().setDescription('You can\'t use databaseConnection!'));
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
    // @ts-expect-error yes, password exists, but is supposed to be private. Thanks JavaScript for not having private class fields
    if (result.includes(context.databaseConnection.password)) result = result.replace(context.databaseConnection.password, '[REDACTED]');
    // @ts-expect-error yes, username exists, but is supposed to be private. Thanks JavaScript for not having private class fields
    if (result.includes(context.databaseConnection.hostname)) result = result.replace(context.databaseConnection.hostname, '[REDACTED]');
    // @ts-expect-error yes, username exists, but is supposed to be private. Thanks JavaScript for not having private class fields
    if (result.includes(context.databaseConnection.username)) result = result.replace(context.databaseConnection.username, '[REDACTED]');
    // @ts-expect-error yes, database exists, but is supposed to be private. Thanks JavaScript for not having private class fields
    if (result.includes(context.databaseConnection.database)) result = result.replace(context.databaseConnection.database, '[REDACTED]');
    // @ts-expect-error yes, port exists, but is supposed to be private. Thanks JavaScript for not having private class fields
    if (result.includes(context.databaseConnection.port)) result = result.replace(context.databaseConnection.port, '[REDACTED]');

    const finalCode = code.length > 1012 ? `${code.slice(0, 1009)}...` : code;

    const finalEmbed = new DefaultEmbed()
      .setTitle('Eval')
      .addField('Input', `\`\`\`js\n${finalCode}\n\`\`\``)
      .addField('Output', `\`\`\`js\n${result}\n\`\`\``);

    await context.discreteReply(finalEmbed);
  }

  public override checkPermission(context: IDiscordFullCommandContext, silent = false): boolean {
    if (context.botDevelopers.includes(context.author.id)) return true;
    if (!silent) context.discreteReply(new ErrorEmbed().setDescription('You don\'t have permission to use this command!'));
    return false;
  }
}
