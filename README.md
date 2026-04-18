# DateMarket

Статический сайт знакомств. Веб-сайт находится в папке `datemarket_v5/`.

## Бесплатный хостинг через GitHub Pages

1. Создайте новый репозиторий на GitHub.
2. Выполните в этой папке:
   ```bash
   git remote add origin https://github.com/<ваш-пользователь>/<ваш-репозиторий>.git
   git branch -M main
   git push -u origin main
   ```
3. GitHub Actions автоматически задеплоит сайт.
4. Откройте `https://<ваш-пользователь>.github.io/<ваш-репозиторий>/`.

## Собственный домен

Если хотите нормальный домен, можно привязать собственный домен к GitHub Pages:

1. Купите домен у регистратора или возьмите бесплатный домен от Freenom (`.tk`, `.ml`, `.ga`, `.cf`, `.gq`).
2. В корне репозитория создайте файл `CNAME` с единственной строкой:
   ```
   example.com
   ```
3. Настройте DNS у регистратора: добавьте записи A для GitHub Pages или CNAME.
4. Пушьте изменения в `main` — GitHub автоматически применит домен.

После этого сайт будет доступен по вашему домену.

## Настройка GitHub Pages через workflow

Если на вашей странице настроек нет нужных опций, используйте Personal Access Token:

1. Создайте токен на GitHub: `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)` → `Generate new token`.
2. Дайте ему права `repo` или `pages:write`.
3. В репозитории добавьте секрет `PAGES_TOKEN`:
   - `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
   - имя: `PAGES_TOKEN`
   - значение: ваш токен
4. Затем пушьте изменения — workflow сам включит GitHub Pages.

## Папка сайта

Содержимое сайта расположено в `datemarket_v5/`.
Если вы хотите изменить путь, обновите `deploy.yml`.
