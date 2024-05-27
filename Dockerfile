# Используем официальный образ Node.js в качестве базового
FROM node:16

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package.json ./
COPY pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Сборка приложения
RUN npm run build

# Указываем команду для запуска приложения
CMD ["npm", "run", "start"]
