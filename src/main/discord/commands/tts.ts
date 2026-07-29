import { ArunaAsyncCommand } from '../structures';
import { ErrorEmbed } from '../utils';
import { Discord } from 'arunabase';

export default class SayCommand extends ArunaAsyncCommand {
  constructor() {
    super('tts', {
      name_localizations: {
        'pt-BR': 'tts',
      },
      description: 'Makes the bot say something with voice',
      description_localizations: {
        'pt-BR': 'Faz o bot dizer algo com voz',
      },
      parameters: [
        {
          name: 'message',
          description: 'The message to be said',
          name_localizations: {
            'pt-BR': 'mensagem',
          },
          description_localizations: {
            'pt-BR': 'A mensagem a ser falada',
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

  protected override async execute(context: Discord.ICommandContext): Promise<void> {
    const message = context.args.get('message') as string;

    if (message.length > 300) {
      await context.discreteReply(new ErrorEmbed().setDescription('This message is too long! (Max length: 300, Actual length: ' + message.length + ')'));
      return;
    }

    if (message.length < 2) {
      await context.discreteReply(new ErrorEmbed().setDescription('This message is too short! (Min length: 2)'));
      return;
    }

    // makes http fetch to tts endpoint
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Ricardo&text=${encodeURIComponent(message)}`;

    const response = await fetch(url);

    if (!response.ok) {
      await context.discreteReply(new ErrorEmbed().setDescription('Something went wrong!'));
      return;
    }

    const blob = await response.blob();

    const buffer = Buffer.from(await blob.arrayBuffer());

    // download the file and send it as attachment
    const attachment = new Discord.AttachmentBuilder(buffer, { name: 'tts.mp3' });

    const embed = new Discord.EmbedBuilder()
      .setTitle('TTS')
      .setDescription(`Message: ${message}`);

    await context.discreteReply(embed, attachment);
  }
}
