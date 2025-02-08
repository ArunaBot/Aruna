import { Discord } from 'arunabase';

export class DefaultEmbed extends Discord.CloneableRichEmbed {
  constructor() {
    super();

    this.setTimestamp();
  }
}

export class ErrorEmbed extends DefaultEmbed {
  constructor(description?: string) {
    super();

    if (description) {
      this.setDescription(description);
    }
    this.setColor('#ff0000');
    this.setTitle('Error');
    this.setFooter({ text: 'An error has occurred while performing this action. Please try again later.' });
  }
}
