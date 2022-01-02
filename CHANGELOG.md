# Changelog

## v4.3.4: No Invite Update

- Changes:
  - Updated Dependencies;
  - Update languages;
- New:
  - AntiInvite system:
    - Enable using `config antiinvite enable`;
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
