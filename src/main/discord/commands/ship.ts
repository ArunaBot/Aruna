import { ApplicationCommandOptionType, AttachmentBuilder, User } from 'arunabase/build/discord';
import { DefaultEmbed, ErrorEmbed } from '../utils';
import { ArunaAsyncCommand } from '../structures';
import { Discord } from 'arunabase';
import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

export default class ShipCommand extends ArunaAsyncCommand {
  constructor() {
    super('ship', {
      name_localizations: {
        'pt-BR': 'ship',
      },
      description: 'If you ever wondered if you are compatible with someone, this is the perfect command to check!',
      description_localizations: {
        'pt-BR': 'Se você já se perguntou o quão compatível é com alguém, esse é o comando perfeito pra testar!',
      },
      parameters: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'user1',
          description: 'The user to be shipped',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.User,
          name: 'user2',
          description: 'The user to be shipped with',
          required: false,
        },
      ],
      allowDM: false,
      category: 'Entertainment',
    });
  }

  protected override async execute(context: Discord.ICommandContext): Promise<void> {
    if (context.args.size === 0) {
      await context.reply(new ErrorEmbed().setDescription('You need to specify at least one user to be shipped!'));
      return;
    }
    
    const random = Math.round(Math.random() * 100);
    const index = Math.floor(random / 10);

    const user1: User = context.args.get('user1') as User;
    const user2 = context.args.get('user2') as User || context.author;

    if (!user1) {
      await context.reply(new ErrorEmbed().setDescription('First user not found!'));
      return;
    }

    const member1 = context.guild?.members.cache.get(user1.id);
    const member2 = context.guild?.members.cache.get(user2.id);

    const avatar1 = await Jimp.read(member1?.user.displayAvatarURL({ forceStatic: true, size: 128, extension: 'png' }) ??
      user1.displayAvatarURL({ forceStatic: true, size: 128, extension: 'png' }));
    
    const avatar2 = await Jimp.read(member2?.user.displayAvatarURL({ forceStatic: true, size: 128, extension: 'png' }) ??
      user2.displayAvatarURL({ forceStatic: true, size: 128, extension: 'png' }));
    
    avatar1.resize({ h: 115, w: 115 });
    avatar2.resize({ h: 115, w: 115 });

    const baseImage = await Jimp.read(fs.readFileSync(path.join(__dirname, '..', '..', 'resources', 'images', 'ship.png')));
    baseImage.composite(avatar1, 1, 1);
    baseImage.composite(avatar2, 229, 1);

    // FIXME: Send this to language file
    const shipStatus = [
      '%s% [----------] Nothing is impossible, just unlikely.',
      '%s% [█---------] Someday maybe.',
      '%s% [██--------] Well, looking at this perspective...',
      '%s% [███-------] Well, I guess it\'s possible. Hard? For sure.',
      '%s% [████------] At a galaxy not so far far away...',
      '%s% [█████-----] They\'d kinda be a good couple.',
      '%s% [██████----] This couple is close to being very good!',
      '%s% [███████---] A very good couple! Nobody could set them apart <3',
      '%s% [████████--] These two could already be married! 💍',
      '%s% [█████████-] Perfect couple, only death could set them apart!💍',
      '%s% [██████████] Perfect couple, not even death could do them part!💍',
    ];

    const message = shipStatus[index].replace('%s', random.toString());

    const embed = new DefaultEmbed()
      .setDescription(`**${member1?.displayName ?? user1.displayName}** + **${member2?.displayName ?? user2.displayName}**\n\n**${message}**`)
      .setColor('#fa2ab8')
      .setImage('attachment://ship.png');

    const attachment = new AttachmentBuilder(await baseImage.getBuffer('image/png')).setName('ship.png');

    await context.reply(embed, attachment);
  }
}
