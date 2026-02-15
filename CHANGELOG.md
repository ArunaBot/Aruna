# Changelog

## v5.0.0: Aruna v5

- BREAKING CHANGES:
  - Drop support for Node.js below v22.12.0;
  - Migrate from Discord.js to ArunaBase;
  - Migrate from MongoDB to MySQL;
  - Full rewrite of the code;
  - The code is now written in TypeScript;
- Changes:
  - Update Dependencies;

## v4.3.7: Maintenance Update II

- Changes:
  - Updated Dependencies;
- Fix:
  - Fixed small vulnerability caused by outdated package;
- Chore:
  - Added website link as placeholder in configs;

## v4.3.6: Maintenance Update

- Changes:
  - Updated Dependencies;
  - Removed broken sections from `serverinfo` command;
- Fix:
  - Memory Leaks caused by excessive use of `var` instead `let` and `const`;
  - Only skipping bots message if it's a dm;

## v4.3.5: Voice Update

- New:
  - Text to Speech (TTS) command;
- Fix:
  - Fixed some grammar issues;
  - Minor Bugs Fixed:tm:

## v4.3.4: No Invite Update

- Changes:
  - Updated Dependencies;
  - Update languages;
  - Prefixes are no longer case-sensitive;
- New:
  - AntiInvite system:
    - Enable using `config antinvite enable`;
  - Category selector to massrole:
    - If you use `massrole @role users`, only humans will receive the role, and if you use `massrole @role bots`, only bots will receive the role;
- Fix:
  - Avatar and Guild Icon using jpg instead png;

## v4.3.3: Bugs and Info

- Changes:
  - Updated Dependencies;
  - Language folder structure now use 4 digits instead 2;
- New:
  - New Aliases:
    - `sicon` and `gicon` for servericon;
    - `si`, `guildinfo` and `gi` for serverinfo;
  - Added a error message when `userinfo` fail;
- Fix:
  - Fixed some issues with `userinfo` command;
  - Fixed a lot of grammar issues;
  - Minor Bugs Fixed:tm:

## v4.3.2: Stage Update

- Changes:
  - Using own build from discord.js@v11;
  - Using own build from topgg-autoposter;
- New:
  - Added `forcePrefix` config:
    - this allow you to force config prefix, ignoring custom;
- Fix:
  - Support with stage channels (See [#45]);
  - TopGG doesn't post datas;

[#45]: https://github.com/ArunaBot/Aruna/issues/45
