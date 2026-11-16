#!/usr/bin/env bash
# Скрипт запуска облачного окружения Claude Code: плагины, скиллы, библиотеки.
# Вставить в настройки окружения: меню окружения в заголовке сессии → Edit → Setup script.
# Все шаги с `|| true`, чтобы сбой одного не мешал старту сессии.

npm i -g @higgsfield/cli || true

# Python-библиотеки для парсинга и работы с данными (selectolax импортировать как selectolax.lexbor)
pip3 install -q requests httpx beautifulsoup4 lxml selectolax trafilatura pandas openpyxl \
  pillow yt-dlp fake-useragent python-dotenv playwright==1.63.0 || true

# SVG/WebP-утилиты и шрифты с кириллицей
apt-get install -y librsvg2-bin webp fonts-noto-core \
  || (apt-get update -qq && apt-get install -y librsvg2-bin webp fonts-noto-core) || true

if command -v claude >/dev/null 2>&1; then
  for m in anthropics/skills alirezarezvani/claude-skills nextlevelbuilder/ui-ux-pro-max-skill obra/superpowers \
      frankxai/awesome-motion-design-agent-skills bizarro/skills jmrsquared/skills; do
    timeout 180 claude plugin marketplace add "$m" || true
  done
  for p in example-skills@anthropic-agent-skills marketing-skills@claude-code-skills \
      product-skills@claude-code-skills a11y-audit@claude-code-skills \
      ui-ux-pro-max@ui-ux-pro-max-skill superpowers@superpowers-dev \
      motion-design-studio@frankx-motion bizarro@bizarro jmrsquared-standards@skills; do
    timeout 180 claude plugin install "$p" || true
  done
fi

# Отдельные скиллы
export CI=1
timeout 240 npx -y skills add emanuelcira/claude-web-skills -g -a claude-code -y </dev/null || true
timeout 240 npx -y skills add CGWebDev2003/cg-web-skills --skill cg-web-animate -g -a claude-code -y </dev/null || true
timeout 240 npx -y skills add https://github.com/delphi-ai/animate-skill --skill animate -g -a claude-code -y </dev/null || true
timeout 240 npx -y skills add iart-ai/motion-design-skills -g -a claude-code -y </dev/null || true
timeout 240 npx -y skills add akais-alt/ai-motion-design-skills -g -a claude-code -y </dev/null || true
timeout 240 npx -y openskills install xedyx123/LUME --global -y </dev/null || true
