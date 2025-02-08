import { ArunaAsyncCommand } from '../structure';
import { Discord, Interfaces } from 'arunabase';
import { DefaultEmbed, ErrorEmbed } from '../utils';

export default class SayCommand extends ArunaAsyncCommand {
  constructor() {
    super('say', {
      name_localizations: {
        'pt-BR': 'falar',
      },
      description: 'Make the bot say something',
      description_localizations: {
        'pt-BR': 'Faz com que o bot diga algo',
      },
      parameters: [
        {
          name: 'message',
          description: 'The message to be said',
          name_localizations: {
            'pt-BR': 'mensagem',
          },
          description_localizations: {
            'pt-BR': 'A mensagem a ser dita',
          },
          required: true,
          type: Discord.ApplicationCommandOptionType.String,
          max_length: 200,
          min_length: 2,
        },
      ],
      allowDM: false,
    });
  }

  protected override async execute(context: Interfaces.IDiscordCommandContext): Promise<void> {
    var message: string;

    if (context.interaction) {
      message = context.args[0] as string;
    } else {
      message = context.args.join(' ');
    }

    if (message.length > 200) {
      await context.discreteReply(new ErrorEmbed().setDescription('This message is too long! (Max length: 200)'));
      return;
    }

    if (message.length < 2) {
      await context.discreteReply(new ErrorEmbed().setDescription('This message is too short! (Min length: 2)'));
      return;
    }

    await context.reply(message);
  }

  public override checkPermission(context: Interfaces.IDiscordCommandContext): boolean {
    if (!context.member!.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      context.discreteReply(new DefaultEmbed().setDescription('You don\'t have the manage message permisson!'));
      return false;
    }

    return true;
  }
}
