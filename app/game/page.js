"use client";

import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const gameRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const saved = Number(localStorage.getItem("carHighScore") || 0);
    setHighScore(saved);

    const down = (e) => {
      keys.current[e.key] = true;
    };

    const up = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setCoins(0);
    setLives(3);
    setLevel(1);

    setTimeout(() => runGame(), 50);
  };

  const runGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = 360;
    canvas.height = 640;

    const player = {
      x: 160,
      y: 540,
      width: 42,
      height: 72,
      speed: 6,
    };

    let enemies = [];
    let coinItems = [];
    let animation;
    let enemyTimer = 0;
    let coinTimer = 0;
    let currentScore = 0;
    let currentCoins = 0;
    let currentLives = 3;
    let currentLevel = 1;
    let running = true;

    gameRef.current = () => {
      running = false;
      cancelAnimationFrame(animation);
    };

    const drawRoad = () => {
      ctx.fillStyle = "#075b2a";
      ctx.fillRect(0, 0, 360, 640);

      ctx.fillStyle = "#242424";
      ctx.fillRect(45, 0, 270, 640);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(45, 0, 5, 640);
      ctx.fillRect(310, 0, 5, 640);

      ctx.strokeStyle = "#eeeeee";
      ctx.lineWidth = 5;
      ctx.setLineDash([35, 30]);

      ctx.beginPath();
      ctx.moveTo(135, 0);
      ctx.lineTo(135, 640);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(225, 0);
      ctx.lineTo(225, 640);
      ctx.stroke();

      ctx.setLineDash([]);
    };

    const drawCar = (car, color) => {
      ctx.fillStyle = "#111";
      ctx.fillRect(car.x - 5, car.y + 12, 7, 20);
      ctx.fillRect(car.x + car.width - 2, car.y + 12, 7, 20);
      ctx.fillRect(car.x - 5, car.y + 45, 7, 20);
      ctx.fillRect(car.x + car.width - 2, car.y + 45, 7, 20);

      ctx.fillStyle = color;
      ctx.fillRect(car.x, car.y, car.width, car.height);

      ctx.fillStyle = "#9ee7ff";
      ctx.fillRect(car.x + 7, car.y + 9, car.width - 14, 20);

      ctx.fillStyle = "#7fd4ef";
      ctx.fillRect(car.x + 7, car.y + 37, car.width - 14, 16);

      ctx.fillStyle = "#fff";
      ctx.fillRect(car.x + 5, car.y + 3, 8, 5);
      ctx.fillRect(car.x + car.width - 13, car.y + 3, 8, 5);
    };

    const drawCoin = (coin) => {
      ctx.beginPath();
      ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd700";
      ctx.fill();

      ctx.fillStyle = "#8a6500";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText("$", coin.x + 10, coin.y + 15);
    };

    const hit = (a, b) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;

    const createEnemy = () => {
      const lanes = [80, 160, 240];
      const x = lanes[Math.floor(Math.random() * lanes.length)];

      enemies.push({
        x,
        y: -90,
        width: 42,
        height: 72,
        speed: 4 + currentLevel * 0.5,
      });
    };

    const createCoin = () => {
      const lanes = [80, 160, 240];
      const x = lanes[Math.floor(Math.random() * lanes.length)];

      coinItems.push({
        x,
        y: -30,
        width: 20,
        height: 20,
        speed: 4 + currentLevel * 0.4,
      });
    };

    const loop = () => {
      if (!running) return;

      drawRoad();

      if (keys.current.ArrowLeft || keys.current.a) {
        player.x -= player.speed;
      }

      if (keys.current.ArrowRight || keys.current.d) {
        player.x += player.speed;
      }

      player.x = Math.max(55, Math.min(263, player.x));

      enemyTimer++;
      coinTimer++;

      if (enemyTimer > Math.max(35, 70 - currentLevel * 4)) {
        createEnemy();
        enemyTimer = 0;
      }

      if (coinTimer > 90) {
        createCoin();
        coinTimer = 0;
      }

      enemies.forEach((enemy) => {
        enemy.y += enemy.speed;
        drawCar(enemy, "#e53935");

        if (hit(player, enemy)) {
          enemy.y = 700;
          currentLives--;

          setLives(currentLives);

          if (currentLives <= 0) {
            running = false;
            setGameOver(true);

            const finalScore = currentScore;

            setScore(finalScore);

            const oldHigh =
              Number(localStorage.getItem("carHighScore") || 0);

            if (finalScore > oldHigh) {
              localStorage.setItem(
                "carHighScore",
                String(finalScore)
              );
              setHighScore(finalScore);
            }

            return;
          }
        }
      });

      coinItems.forEach((coin) => {
        coin.y += coin.speed;
        drawCoin(coin);

        if (hit(player, coin)) {
          coin.y = 700;
          currentCoins++;
          currentScore += 5;

          setCoins(currentCoins);
          setScore(currentScore);
        }
      });

      enemies = enemies.filter((e) => e.y < 700);
      coinItems = coinItems.filter((c) => c.y < 700);

      if (Math.random() < 0.03) {
        currentScore++;
        setScore(currentScore);
      }

      currentLevel = Math.floor(currentScore / 30) + 1;
      setLevel(currentLevel);

      drawCar(player, "#2196f3");

      animation = requestAnimationFrame(loop);
    };

    loop();
  };

  const move = (direction) => {
    keys.current[direction] = true;

    setTimeout(() => {
      keys.current[direction] = false;
    }, 180);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#070b16,#111827)",
        color: "white",
        fontFamily: "Arial,sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "18px",
      }}
    >
      <h1 style={{ margin: "5px 0" }}>
        🏎️ Speed Racer
      </h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        <b>🏆 {score}</b>
        <b>🪙 {coins}</b>
        <b>❤️ {lives}</b>
        <b>⚡ Level {level}</b>
        <b>👑 {highScore}</b>
      </div>

      {!started ? (
        <div
          style={{
            width: "330px",
            maxWidth: "90vw",
            padding: "35px 20px",
            textAlign: "center",
            borderRadius: 20,
            background: "#172033",
            marginTop: 100,
          }}
        >
          <div style={{ fontSize: 70 }}>🏎️</div>

          <h2>Speed Racer</h2>

          <p>
            Dodge enemy cars, collect coins and
            beat your high score!
          </p>

          <button
            onClick={startGame}
            style={{
              padding: "16px 40px",
              border: "none",
              borderRadius: 14,
              background: "#22c55e",
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ▶️ START GAME
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{
              width: "360px",
              maxWidth: "94vw",
              height: "640px",
              borderRadius: 18,
              border: "4px solid #64748b",
              background: "#222",
            }}
          />

          {gameOver && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.82)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  background: "#172033",
                  padding: 30,
                  borderRadius: 20,
                  textAlign: "center",
                  width: "280px",
                }}
              >
                <div style={{ fontSize: 55 }}>💥</div>

                <h1>GAME OVER</h1>

                <p style={{ fontSize: 22 }}>
                  Score: <b>{score}</b>
                </p>

                <p>🪙 Coins: {coins}</p>

                <button
                  onClick={startGame}
                  style={{
                    padding: "14px 28px",
                    border: "none",
                    borderRadius: 12,
                    background: "#2196f3",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  🔄 PLAY AGAIN
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 35,
              marginTop: 18,
            }}
          >
            <button
              onTouchStart={() => move("ArrowLeft")}
              onMouseDown={() => move("ArrowLeft")}
              style={{
                width: 110,
                height: 65,
                borderRadius: 18,
                border: "none",
                fontSize: 30,
              }}
            >
              ◀️
            </button>

            <button
              onTouchStart={() => move("ArrowRight")}
              onMouseDown={() => move("ArrowRight")}
              style={{
                width: 110,
                height: 65,
                borderRadius: 18,
                border: "none",
                fontSize: 30,
              }}
            >
              ▶️
            </button>
          </div>
        </>
      )}

      <p style={{ opacity: 0.65 }}>
        ← → keys or touch buttons
      </p>
    </main>
  );
        }
