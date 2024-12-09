import React, { useRef, useEffect } from 'react';
import SceneRenderer from './SceneRenderer';

interface SceneRendererComponentProps {
}

const SceneRendererComponent: React.FC<SceneRendererComponentProps> = () => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<SceneRenderer | null>(null);

    useEffect(() => {
        if (canvasRef.current && !rendererRef.current) {
            rendererRef.current = new SceneRenderer(canvasRef.current);
            const { clientWidth, clientHeight } = canvasRef.current;
            rendererRef.current?.resizeCanvas(clientWidth, clientHeight);
            rendererRef.current?.resizeCanvas(clientWidth, clientHeight);

            // Add event listener to prevent right-click menu
            const handleContextMenu = (event: MouseEvent) => {
                event.preventDefault();
            };
            canvasRef.current?.addEventListener('contextmenu', handleContextMenu);

            return () => {
                // Clean up p5 instance and event listener on unmount
                rendererRef.current?.p5Instance.remove();
                canvasRef.current?.removeEventListener('contextmenu', handleContextMenu);
                rendererRef.current = null; // Ensure reference is cleared
            };
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current && rendererRef.current) {
            const handleResize = () => {
                if (canvasRef.current) {
                    const { clientWidth, clientHeight } = canvasRef.current;
                    rendererRef.current?.resizeCanvas(clientWidth, clientHeight);
                }
            };
            const resizeObserver = new ResizeObserver(() => {
                window.requestAnimationFrame(handleResize);
            });
            if (canvasRef.current) {
                resizeObserver.observe(canvasRef.current);
            }
            return () => {
                if (canvasRef.current) {
                    resizeObserver.unobserve(canvasRef.current);
                }
            };
        }
    }, []);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneRendererComponent;
