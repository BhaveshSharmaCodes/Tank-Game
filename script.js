const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const retryButton = document.getElementById('retryButton');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let tank, bullets, enemies, keys, gameOver;

        function initializeGame() {
            tank = {
                x: canvas.width / 2,
                y: canvas.height - 60,
                width: 50,
                height: 50,
                color: 'green',
                speed: 5,
                angle: 0,
                alive: true
            };

            bullets = [];
            enemies = [];
            keys = {};
            gameOver = false;

            for (let i = 0; i < 15; i++) {
                enemies.push({
                    x: Math.random() * (canvas.width - 50),
                    y: Math.random() * (canvas.height / 2),
                    width: 50,
                    height: 50,
                    color: 'red',
                    speed: 2
                });
            }

            retryButton.style.display = 'none';
        }

        // Handle key events
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Move tank
        function moveTank() {
            if (keys['ArrowLeft'] && tank.x > 0) {
                tank.x -= tank.speed;
            }
            if (keys['ArrowRight'] && tank.x < canvas.width - tank.width) {
                tank.x += tank.speed;
            }
            if (keys['ArrowUp'] && tank.y > 0) {
                tank.y -= tank.speed;
            }
            if (keys['ArrowDown'] && tank.y < canvas.height - tank.height) {
                tank.y += tank.speed;
            }
            if (keys['q']) {  // Rotate left
                tank.angle -= 2;
            }
            if (keys['e']) {  // Rotate right
                tank.angle += 2;
            }
            if (keys['a'] || keys['A']) {  // Shoot bullet
                shootBullet();
            }
        }

        // Move enemies
        function moveEnemies() {
            enemies.forEach(enemy => {
                enemy.y += enemy.speed;
                if (enemy.y > canvas.height) {
                    enemy.y = -enemy.height;
                    enemy.x = Math.random() * (canvas.width - enemy.width);
                }

                // Check collision with tank
                if (
                    tank.x < enemy.x + enemy.width &&
                    tank.x + tank.width > enemy.x &&
                    tank.y < enemy.y + enemy.height &&
                    tank.height + tank.y > enemy.y
                ) {
                    tank.alive = false;
                    gameOver = true;
                    retryButton.style.display = 'block';
                }
            });
        }

        // Shoot bullet
        function shootBullet() {
            const angleRad = (tank.angle - 90) * (Math.PI / 180);
            bullets.push({
                x: tank.x + tank.width / 2 + 25 * Math.cos(angleRad),
                y: tank.y + tank.height / 2 + 25 * Math.sin(angleRad),
                width: 10,
                height: 20,
                color: 'yellow',
                speed: 5,
                angle: tank.angle
            });
        }

        // Move bullets
        function moveBullets() {
            bullets.forEach((bullet, index) => {
                const angleRad = (bullet.angle - 90) * (Math.PI / 180);
                bullet.x += bullet.speed * Math.cos(angleRad);
                bullet.y += bullet.speed * Math.sin(angleRad);
                if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                    bullets.splice(index, 1);
                }
            });
        }

        // Update game
        function update() {
            if (!gameOver) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                moveTank();
                moveEnemies();
                moveBullets();

                drawTank();
                drawEnemies();
                drawBullets();

                checkCollisions();

                requestAnimationFrame(update);
            }
        }

        // Draw tank
        function drawTank() {
            ctx.save();
            ctx.translate(tank.x + tank.width / 2, tank.y + tank.height / 2);
            ctx.rotate(tank.angle * Math.PI / 180);
            ctx.fillStyle = tank.color;
            ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
            
            // Draw tank turret
            ctx.fillStyle = 'darkgreen';
            ctx.fillRect(-15, -30, 30, 20);
            
            // Draw tank barrel
            ctx.fillStyle = 'gray';
            ctx.fillRect(-5, -40, 10, 20);

            ctx.restore();
        }

        // Draw enemies
        function drawEnemies() {
            enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            });
        }

        // Draw bullets
        function drawBullets() {
            bullets.forEach(bullet => {
                ctx.save();
                ctx.translate(bullet.x, bullet.y);
                ctx.rotate(bullet.angle * Math.PI / 180);
                ctx.fillStyle = bullet.color;
                ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
                ctx.restore();
            });
        }

        let count = 0;
        // Check collisions
        function checkCollisions() {
            bullets.forEach((bullet, bulletIndex) => {
                enemies.forEach((enemy, enemyIndex) => {
                    if (
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.height + bullet.y > enemy.y
                    ) {
                        bullets.splice(bulletIndex, 1);
                        enemies.splice(enemyIndex, 1);
                        count++;
                    }
                });
            });
            console.log(count);
            if(count >= 15){
                initializeGame();
                count = 0;
            }
    
        }
        
        // Retry button click
        retryButton.addEventListener('click', () => {
            initializeGame();

            update();
        });

        // Initialize and start the game
        let manuals = document.getElementById('manual');
        function manual() {
            manuals.style.display = "none";
            initializeGame();

            update();
        }
        initializeGame();
        update();
