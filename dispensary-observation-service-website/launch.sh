#!/usr/bin/env bash
# ============================================================
#  Диспансеризация в Беларуси — запуск «в одну команду»
#
#  Использование:
#    ./launch.sh            продакшн: проверка → сборка → старт (порт 3000)
#    ./launch.sh dev        режим разработки с горячей перезагрузкой
#    ./launch.sh test       только тесты логики (vitest)
#
#  Требования: Node.js 20+ и npm.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-prod}"

echo "▶ Диспансеризация в Беларуси — подготовка к запуску"

# 1) Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js не найден. Установите Node.js 20+ с https://nodejs.org" >&2
  exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "✗ Нужен Node.js 20+, сейчас: $(node -v)" >&2
  exit 1
fi
echo "✓ Node.js $(node -v)"

# 2) Зависимости (только если node_modules отсутствует или устарел)
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json 2>/dev/null ]; then
  echo "▶ Устанавливаю зависимости (npm ci)…"
  npm ci
else
  echo "✓ Зависимости на месте"
fi

# 3) Окружение: создаём .env, если его нет (DATABASE_URL нужен только /api/health)
if [ ! -f .env ]; then
  cat > .env <<'EOF'
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
  echo "✓ Создан .env (для публикации замените NEXT_PUBLIC_SITE_URL на ваш домен)"
fi

# 4) Тесты логики диспансеризации
echo "▶ Unit-тесты (границы возрастов 17/18, 39/40, 49/58, 11/12 мес.)…"
if ! npx vitest run --reporter=basic >/dev/null 2>&1; then
  echo "✗ Тесты не пройдены — запуск остановлен" >&2
  npx vitest run
  exit 1
fi
echo "✓ Тесты пройдены"

if [ "$MODE" = "test" ]; then
  echo "✔ Готово (режим test)"
  exit 0
fi

if [ "$MODE" = "dev" ]; then
  echo "▶ Запуск в режиме разработки → http://localhost:3000"
  exec npm run dev
fi

# 5) Продакшн: сборка + старт
echo "▶ Проверка типов и продакшн-сборка…"
npx next typegen >/dev/null
npx tsc --noEmit
npm run build

echo ""
echo "✔ Сборка готова. Сайт стартует на http://localhost:3000"
echo "  Остановка: Ctrl+C"
exec npm start
