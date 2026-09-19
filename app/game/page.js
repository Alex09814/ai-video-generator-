"use client";

import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const restartGame = () => {
    window.location.reload();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 360;
    canvas.height = 640;

    const player = {
      x: 160,
      y: 540,
      width: 40,
      height: 70,
      speed: 6,
    };

    const enemies = [];
    let currentScore = 0;
    let running = true;
    let animationId;

    const roadLeft = 45;
    const roadRight = 315;

    const createEnemy = () => {
      const lanes = [80, 160, 240];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];

      enemies.push({
        x: lane,
        y: -90,
        width: 40,
        height: 70,
        speed: 4 + Math.random() * 2,
      });
    };

    const drawRoad = () => {
      // Background
      ctx.fillStyle = "#16823b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road
      ctx.fillStyle = "#333";
      ctx.fillRect(roadLeft, 0, roadRight - roadLeft, canvas.height);

      // Road borders
      ctx.fillStyle = "#fff";
      ctx.fillRect(roadLeft, 0, 5, canvas.height);
      ctx.fillRect(roadRight - 5, 0, 5, canvas.height);

      // Lane markings
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.setLineDash([35, 30]);

      ctx.beginPath();
      ctx.moveTo(135, 0);
      ctx.lineTo(135, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(225, 0);
      ctx.lineTo(225, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]);
    };

    const drawCar = (car, color) => {
      // Body
      ctx.fillStyle = color;
      ctx.fillRect(car.x, car.y, car.width, car.height);

      // Windows
      ctx.fillStyle = "#bdefff";
      ctx.fillRect(car.x + 7, car.y + 10, car.width - 14, 20);
      ctx.fillRect(car.x + 7, car.y + 38, car.width - 14, 15);

      // Wheels
      ctx.fillStyle = "#111";
      ctx.fillRect(car.x - 5, car.y + 10, 6, 18);
      ctx.fillRect(car.x + car.width - 1, car.y + 10, 6, 18);
      ctx.fillRect(car.x - 5, car.y + 45, 6, 18);
      ctx.fillRect(car.x + car.width - 1, car.y + 45, 6, 18);
    };

    const collision = (a, b) => {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    };

    let enemyTimer = 0;

    const gameLoop = () => {
      if (!running) return;

      drawRoad();

      // Player movement
      if (keys.current.ArrowLeft || keys.current.a) {
        player.x -= player.speed;
      }

      if (keys.current.ArrowRight || keys.current.d) {
        player.x += player.speed;
      }

      player.x = Math.max(55, Math.min(265, player.x));

      // Create enemies
      enemyTimer++;

      if (enemyTimer > 55) {
        createEnemy();
        enemyTimer = 0;
      }

      // Enemy movement
      enemies.forEach((enemy) => {
        enemy.y += enemy.speed;

        drawCar(enemy, "#e53935");

        if (collision(player, enemy)) {
          running = false;
          setGameOver(true);
        }
      });

      // Remove enemies and increase score
      for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
          currentScore++;
          setScore(currentScore);
        }
      }

      drawCar(player, "#2196f3");

      animationId = requestAnimationFrame(gameLoop);
    };

    const keyDown = (e) => {
      keys.current[e.key] = true;
    };

    const keyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    gameLoop();

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  const moveLeft = () => {
    const event = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      window.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "ArrowLeft",
        })
      );
    }, 150);
  };

  const moveRight = () => {
    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      window.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "ArrowRight",
        })
      );
    }, 150);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 5 }}>🏎️ Car Racing Game</h1>

      <div style={{ fontSize: 20, marginBottom: 15 }}>
        Score: <b>{score}</b>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "360px",
            maxWidth: "90vw",
            height: "640px",
            border: "4px solid white",
            borderRadius: "12px",
            background: "#333",
          }}
        />

        {gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ fontSize: 36 }}>GAME OVER</h2>

            <p style={{ fontSize: 22 }}>
              Score: {score}
            </p>

            <button
              onClick={restartGame}
              style={{
                padding: "14px 28px",
                fontSize: 18,
                border: "none",
                borderRadius: 10,
                background: "#2196f3",
                color: "white",
                fontWeight: "bold",
              }}
            >
              🔄 Restart
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 30,
          marginTop: 20,
        }}
      >
        <button
          onClick={moveLeft}
          style={{
            width: 90,
            height: 60,
            fontSize: 30,
            borderRadius: 15,
            border: "none",
          }}
        >
          ◀️
        </button>

        <button
          onClick={moveRight}
          style={{
            width: 90,
            height: 60,
            fontSize: 30,
            borderRadius: 15,
            border: "none",
          }}
        >
          ▶️
        </button>
      </div>

      <p style={{ marginTop: 15, opacity: 0.7 }}>
        Mobile: buttons use karein • PC: ← → keys
      </p>
    </main>
  );
}
