import { IDiscordFullCommandContext } from '../interfaces';
import { ArunaAsyncCommand } from '../structure';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { Discord } from 'arunabase';
import { evaluate } from 'mathjs';

export default class CalculatorCommand extends ArunaAsyncCommand {
  constructor() {
    super('calculator', {
      name_localizations: {
        'pt-BR': 'calculadora',
      },
      description: 'Calculates a math expression',
      description_localizations: {
        'pt-BR': 'Calcula uma expressão matemática',
      },
      parameters: [
        {
          name: 'expression',
          description: 'The expression to be calculated',
          name_localizations: {
            'pt-BR': 'expressão',
          },
          description_localizations: {
            'pt-BR': 'A expressão a ser calculada',
          },
          required: true,
          type: Discord.ApplicationCommandOptionType.String,
          max_length: 50,
          min_length: 2,
        },
      ],
      aliases: ['calc', 'math', 'matematica', 'calcular'],
    });
  }

  protected override async execute(context: IDiscordFullCommandContext): Promise<void> {
    var expression: string;

    if (context.interaction) {
      expression = context.args[0] as string;
    } else {
      expression = context.args.join(' ');
    }

    if (expression.length > 50) {
      await context.discreteReply(new ErrorEmbed().setDescription('This expression is too long! (Valid expressions: `1+1, 1+1*2, 1+1*(2+3), 1+1*(2+3)/4`)'));
      return;
    }

    if (expression.length < 2) {
      await context.discreteReply(new ErrorEmbed().setDescription('This expression is too short! (Valid expressions: `1+1, 1+1*2, 1+1*(2+3), 1+1*(2+3)/4`)'));
      return;
    }

    if (context.interaction) await context.interaction.deferReply();

    var result: any;

    try {
      result = await evaluate(expression);
      // The below line is to fix the javascript floating point bug
      result = await evaluate(`0 + (${result}).toFixed(16)`);
    } catch (error) {
      context.client.getLogger().error('Error while evaluating expression: ', error);
      await context.editReply(new ErrorEmbed().setDescription('An error occurred while evaluating the expression! Try again or use another expression!'));
      return;
    }

    const embed = new DefaultEmbed()
      .setTitle('Calculator')
      .addField('Expression', `\`\`\`js\n${expression}\`\`\``)
      .addField('Result', `\`\`\`js\n${result}\`\`\``);

    await context.editReply(embed);
  }
}
