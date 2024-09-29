PROJECT_NAME=tanks_elixir

# Для первой инициалиции феникс проекта через докер
docker-initialize-project:
	docker-compose -f docker-compose.dev.yml run ${PROJECT_NAME} mix phx.new . --no-gettext --live --app ${PROJECT_NAME}

# Для первого запуска локально
dev-bootstrap:
	docker-compose -f docker-compose.dev.yml run --rm ${PROJECT_NAME} mix setup

# Используется чтобы в дальнейшем можно было перейти внутрь контейнера
dev-up-container:
	docker-compose -f docker-compose.dev.yml up -d

dev-start-server-iex: dev-up-container 
	docker-compose -f docker-compose.dev.yml exec ${PROJECT_NAME} iex -S mix phx.server

dev-container-bash: dev-up-container
	docker-compose -f docker-compose.dev.yml exec ${PROJECT_NAME} bash

dev-stop:
	docker-compose -f docker-compose.dev.yml stop 

# Коммады для билда нужно актуализировать
up-release:
	docker run -p 4000:4000 --env-file ./.env.prod -it bar_joker_prod 

# написать скрипт для создания билда
build-release:
	docker-compose -f docker-compose.prod.yml up --build

# написать скрипт для пуша образа билда в частный реестр

# написать скрипт для обновления билда на сервере
# порядок деплоя: 
# 1. docker login
# 2. docker tag bar_joker_prod 45.11.26.85:5000/bar_joker_prod
# 3. docker push 45.11.26.85:5000/bar_joker_prod
# 4. на сервере выполнить команду BarJoker.Releases.create_and_migrate
# не забыть вернуть location в конфиге nginx на сервере
