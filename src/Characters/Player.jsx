import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Raycaster, Vector3, Plane, Quaternion } from "three";

export default function Player({
  playerRef,
  mouse,
  setPlayerDirection,
  dashBar,
  setDashBar,
}) {
  const meshRef = useRef();
  const raycaster = useRef(new Raycaster());
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const { camera } = useThree();
  const [keyPressed, setKeyPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const [isDashing, setIsDashing] = useState(false);
  const [dashDirection, setDashDirection] = useState(new Vector3());
  const speedMultiplier = 8;
  const dashForce = 20;
  const dashDuration = 0.2;

  useFrame(() => {
    if (playerRef.current) {
      let input = new Vector3(
        (keyPressed["d"] ? 1 : 0) + (keyPressed["a"] ? -1 : 0),
        0,
        (keyPressed["s"] ? 1 : 0) + (keyPressed["w"] ? -1 : 0)
      );

      if (isDashing) {
        input = dashDirection.clone().multiplyScalar(dashForce);
      } else if (input.length() > 0) {
        input.normalize().multiplyScalar(speedMultiplier);
      }

      playerRef.current.setLinvel({ x: input.x, y: 0, z: input.z }, true);

      raycaster.current.setFromCamera(mouse, camera);
      const intersectionPoint = new Vector3();
      if (raycaster.current.ray.intersectPlane(plane, intersectionPoint)) {
        const playerPos = playerRef.current.translation();
        const direction = new Vector3()
          .subVectors(intersectionPoint, playerPos)
          .normalize();

        const angle = Math.atan2(direction.x, direction.z);
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle);
        playerRef.current.setRotation(quaternion);

        setPlayerDirection(direction);
      }
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (e.code === "Space" && dashBar > 0) {
        const input = new Vector3(
          (keyPressed["d"] ? 1 : 0) + (keyPressed["a"] ? -1 : 0),
          0,
          (keyPressed["s"] ? 1 : 0) + (keyPressed["w"] ? -1 : 0)
        );
        if (!isDashing && input.length() > 0) {
          input.normalize();
          setDashDirection(input);
          setIsDashing(true);
          setDashBar(prev => prev - 1);
          setTimeout(() => {
            setIsDashing(false);
          }, dashDuration * 1000);
        }
      } else {
        setKeyPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.code !== "Space") {
        setKeyPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyPressed, isDashing]);

  useEffect(() => {
    if (dashBar < 2) {
      const interval = setInterval(() => {
        setDashBar(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dashBar]);

  return (
    <RigidBody
      ref={playerRef}
      name="Player"
      position={[0, 1, 0]}
      colliders="cuboid"
      type="dynamic"
      gravityScale={0}
      collisionGroups={isDashing ? interactionGroups(10, [4]) : interactionGroups(0, [1, 3, 4, 5])}
      lockRotations
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}
