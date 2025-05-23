import { Vector3 } from "three";
import { delay } from "../../Utils/helper";

export async function radialShoot(
  enemyPos,
  setEnemyBullets,
  bulletSpeed,
  amountBullets
) {
  for (let i = 0; i < amountBullets; i++) {
    const angle = (i / amountBullets) * Math.PI * 2;
    const direction = new Vector3(
      Math.cos(angle),
      0,
      Math.sin(angle)
    ).normalize();

    const velocity = {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
      z: direction.z * bulletSpeed,
    };

    setEnemyBullets((prev) => [
      ...prev,
      {
        id: Math.random(),
        position: [enemyPos.x, 1, enemyPos.z],
        velocity,
      },
    ]);
  }
}

export async function radialBarrageShoot(
  enemyPos,
  setEnemyBullets,
  bulletSpeed,
  amountBullets,
  amountBarrage
) {
  for (let i = 0; i < amountBarrage; i++) {
    await delay(150);

    for (let j = 0; j < amountBullets; j++) {
      const offset = (i % 2) * (Math.PI / amountBullets);
      const angle = (j / amountBullets) * Math.PI * 2 + i + offset;
      const direction = new Vector3(
        Math.cos(angle),
        0,
        Math.sin(angle)
      ).normalize();

      const velocity = {
        x: direction.x * bulletSpeed,
        y: direction.y * bulletSpeed,
        z: direction.z * bulletSpeed,
      };

      setEnemyBullets((prev) => [
        ...prev,
        {
          id: Math.random(),
          position: [enemyPos.x, 1, enemyPos.z],
          velocity,
        },
      ]);
    }
  }
}

export async function pistolShoot(
  playerPos,
  enemyPos,
  bulletSpeed,
  bulletSpread,
  setEnemyBullets
) {
  const direction = new Vector3(
    playerPos.x - enemyPos.x + bulletSpread,
    playerPos.y - enemyPos.y,
    playerPos.z - enemyPos.z + bulletSpread
  ).normalize();

  const velocity = {
    x: direction.x * bulletSpeed,
    y: 0,
    z: direction.z * bulletSpeed,
  };

  setEnemyBullets((prev) => [
    ...prev,
    {
      id: Math.random(),
      position: [enemyPos.x, 1, enemyPos.z],
      velocity,
    },
  ]);
}

export async function shotgunShoot(
  playerPos,
  enemyPos,
  bulletSpeed,
  amountBullet,
  setEnemyBullets
) {
  const pellets = [];
  const spreadAngle = 1;
  for (let i = 0; i < amountBullet; i++) {
    const angleOffset = (Math.random() - 0.5) * spreadAngle;
    const direction = new Vector3(
      playerPos.x - enemyPos.x,
      playerPos.y - enemyPos.y,
      playerPos.z - enemyPos.z
    )
      .applyAxisAngle(new Vector3(0, 1, 0), angleOffset)
      .normalize();
    const velocity = {
      x: direction.x * bulletSpeed,
      y: 0,
      z: direction.z * bulletSpeed,
    };

    pellets.push({
      id: Math.random(),
      position: [enemyPos.x, 1, enemyPos.z],
      velocity,
    });
  }

  setEnemyBullets((prev) => [...prev, ...pellets]);
}

export async function radialMachineGun(
  playerPos,
  enemyPos,
  bulletSpeed,
  amountBullets,
  setEnemyBullets
) {
  for (let i = 0; i < amountBullets; i++) {
    await delay(50);
    const offset = (i - amountBullets / 2) * 1.5;

    const direction = new Vector3(
      playerPos.x - enemyPos.x + offset - offset / 2,
      0,
      playerPos.z - enemyPos.z + offset - offset / 2
    ).normalize();

    const velocity = {
      x: direction.x * bulletSpeed,
      y: 0,
      z: direction.z * bulletSpeed,
    };

    setEnemyBullets((prev) => [
      ...prev,
      {
        id: Math.random(),
        position: [enemyPos.x, 1, enemyPos.z],
        velocity,
      },
    ]);
  }
}
