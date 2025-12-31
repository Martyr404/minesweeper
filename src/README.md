# 运行该项目
docker run -it --name minesweeper-gui -p 3000:3000 -v "$(pwd)":/gui -w /gui node:22-alpine sh -c "npm install -g pnpm && sh"

# cheatmode:
set the allowCheats to true
then start a game , press ctrl+c