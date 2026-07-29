import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structures';
import { Discord } from 'arunabase';

export default class DiceCommand extends ArunaAsyncCommand {
  constructor() {
    super('dice', {
      name_localizations: {
        'pt-BR': 'dado',
      },
      description: 'Throws a dice',
      description_localizations: {
        'pt-BR': 'Lança um dado',
      },
      parameters: [
        {
          name: 'amount',
          description: 'The amount of dices to be thrown',
          name_localizations: {
            'pt-BR': 'quantidade',
          },
          description_localizations: {
            'pt-BR': 'A quantidade de dados a serem lançados',
          },
          required: true,
          type: Discord.ApplicationCommandOptionType.Integer,
          max_value: 100,
          min_value: 1,
        },
        {
          name: 'faces',
          description: 'The amount of faces of the dice',
          name_localizations: {
            'pt-BR': 'faces',
          },
          description_localizations: {
            'pt-BR': 'A quantidade de faces do dado',
          },
          required: true,
          type: Discord.ApplicationCommandOptionType.Integer,
          max_value: 500,
          min_value: 2,
        },
      ],
    });
  }

  protected override async execute(context: Discord.ICommandContext): Promise<void> {
    const amount = context.args.get('amount') as number;
    const faces = context.args.get('faces') as number;

    if (isNaN(amount) || isNaN(faces) || amount <= 0 || faces <= 1 || amount > 100 || faces > 500) {
      await context.reply(
        new ErrorEmbed()
          .setDescription('Valor invalido de dados ou faces!\n' +
                          'Certifique-se de que os valores são números e que a quantidade de dados é menor que 100 e a quantidade de faces é menor que 500!'));
      return;
    }

    const results = [];

    for (let i = 0; i < amount; i++) {
      results.push(Math.floor(Math.random() * faces) + 1);
    }

    const embed = new DefaultEmbed()
      .setAuthor({
        name: context.member?.displayName ?? context.author.displayName,
        iconURL: context.member?.displayAvatarURL({ forceStatic: false, size: 512 }) ?? context.author.displayAvatarURL({ forceStatic: false, size: 512 }),
      })
      .setDescription(`
        **Lançamento de dados:** ${amount}d${faces}
        **Resultados:** ${results.join(', ')}
        **Total:** ${results.reduce((a, b) => a + b, 0)}
      `);
    await context.reply(embed);
  }
}
