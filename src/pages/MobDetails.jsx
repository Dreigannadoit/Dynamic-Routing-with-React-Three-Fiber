import React, { Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Sky } from '@react-three/drei';
import { envLandscape, steve } from '../assets';
import ProjectDetails from '../components/ProjectDetails';
import Navbar from '../components/Navbar';
import * as THREE from 'three';
import Instructions from '../components/Instructions';

const Landscape = () => {
    const { scene } = useGLTF(envLandscape);
    return (
        <primitive
            object={scene}
            scale={150}
            position={[-150, -439, -630]}
            receiveShadow
        />
    );
};

const SteveRef = () => {
    const { scene, animations } = useGLTF(steve);
    const groupRef = useRef();
    const mixerRef = useRef();

    useEffect(() => {
        if (groupRef.current && animations && animations.length > 0 && !mixerRef.current) {
            mixerRef.current = new THREE.AnimationMixer(groupRef.current);

            const idleAnimation = animations.find(anim =>
                anim.name.toLowerCase().includes('idle') ||
                anim.name === 'animation.steve.idle'
            ) || animations[0];

            if (idleAnimation) {
                const action = mixerRef.current.clipAction(idleAnimation);
                action.setLoop(THREE.LoopRepeat);
                action.play();
            }
        }
        return () => {
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current = null;
            }
        };
    }, [animations]);

    useFrame((state, delta) => {
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive
                object={scene}
                scale={12}
                position={[25, -10, -10]}
                castShadow
            />
        </group>
    );
};

const Character = ({ model, scale = 1, position = [0, 0, 0], rotation=[0, 0, 0] }) => {
    const { scene } = useGLTF(model);

    return (
        <group>
            <primitive
                object={scene}
                scale={scale}
                position={position}
                castShadow
                rotation={rotation}
            />
        </group>
    );
};

const Loader = () => (
    <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
    </mesh>
);

const MobDetails = ({ mobs, onPlaySound }) => {
    const { id } = useParams()
    const mob = mobs.find(m => m.id === id)

    if (!mob) {
        return (
            <div className="mob-details-page">
                <Navbar />
                <div className="error-state">
                    <h2>Mob Not Found</h2>
                    <p>The mob you're looking for doesn't exist.</p>
                    <Link to="/" className="back-btn">
                        ← Back to Mob Library
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mob-details-page">
            <div className="canvas-container">
                <Canvas
                    camera={{ position: [0, 185, 160], rotation:[0, 0, 0], fov: 45 }}
                    shadows
                >
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[20, 15, 10]}
                        intensity={1.2}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        shadow-camera-far={50}
                        shadow-camera-left={-20}
                        shadow-camera-right={20}
                        shadow-camera-top={20}
                        shadow-camera-bottom={-20}
                    />

                    <Sky sunPosition={[20, 10, 5]} />
                    <Environment preset="sunset" />

                    <Suspense fallback={<Loader />}>
                        <Landscape />
                        <Character
                            model={mob.model}
                            scale={mob.scale}
                            position={mob.position}
                            rotation={mob.rotation}
                        />
                        <SteveRef />
                    </Suspense>

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={3}
                        maxDistance={360}
                        target={[0, 2, 0]}
                    />
                </Canvas>
            </div>

            <ProjectDetails mob={mob} onPlaySound={onPlaySound} />
            <Instructions />
        </div>
    );
};

export default MobDetails;