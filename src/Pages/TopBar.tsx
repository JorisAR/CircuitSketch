import React, { useEffect, useState } from 'react';
import './TopBar.css';
import Settings from "Settings/Settings";
import Scene from "Scene/Scene";
import { JsonConvert } from "json2typescript";
import { Vector2 } from "Utils/Vector2";

// Import the images
import undoIcon from 'assets/icons/undo.png';
import redoIcon from 'assets/icons/redo.png';
import exportIcon from 'assets/icons/download.png';
import toggleIcon from 'assets/icons/grid.png';
import clearIcon from 'assets/icons/reset.png';
import homeIcon from 'assets/icons/home.png';
import uploadIcon from 'assets/icons/upload.png';
import zoomInIcon from 'assets/icons/zoom_in.png';
import zoomOutIcon from 'assets/icons/zoom_out.png';

const TopBar: React.FC = () => {
    const [canUndo, setCanUndo] = useState(Settings.sceneHistory.canUndo());
    const [canRedo, setCanRedo] = useState(Settings.sceneHistory.canRedo());
    const [renderSize, setRenderSize] = useState(Settings.renderSize);

    useEffect(() => {
        const handleSettingsChange = () => {
            setCanUndo(Settings.sceneHistory.canUndo());
            setCanRedo(Settings.sceneHistory.canRedo());
            setRenderSize(Settings.renderSize);
        };

        Settings.on('change', handleSettingsChange);

        return () => {
            Settings.off('change', handleSettingsChange);
        };
    }, []);

    const handleUndo = () => {
        Settings.sceneHistory.undo();
    };

    const handleRedo = () => {
        Settings.sceneHistory.redo();
    };

    const handleExport = () => {
        const blob = new Blob([Settings.sceneHistory.currentStateString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "circuit.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const jsonConvert = new JsonConvert();
                const scene = jsonConvert.deserializeObject(JSON.parse(content), Scene);
                Settings.sceneHistory.addState(scene);
            };
            reader.readAsText(file);
        }
    };

    const handleToggleBackground = () => {
        Settings.renderGrid = !Settings.renderGrid;
    };

    const handleClear = () => {
        Settings.sceneHistory.addState(new Scene());
    };

    const handleBackToHome = () => {
        Settings.renderOffset = Settings.scene.getComponentCentroid().negate().add(Settings.aspectRatio.multiply(Settings.renderSize * 0.5));
    };

    return (
        <div className="top-bar">
            <div className="title-section">
                <h1>Circuit Sketch</h1>
            </div>
            <div className="global-settings">
                <button onClick={handleUndo} disabled={!canUndo}>
                    <img src={undoIcon} alt="Undo" />
                </button>
                <button onClick={handleRedo} disabled={!canRedo}>
                    <img src={redoIcon} alt="Redo" />
                </button>
                <button onClick={handleExport}>
                    <img src={exportIcon} alt="Export" />
                </button>
                <button className="upload-button">
                    <img src={uploadIcon} alt="Upload" />
                    <input
                        type="file"
                        onChange={handleImport}
                        accept=".json"
                    />
                </button>
                <button onClick={handleToggleBackground}>
                    <img src={toggleIcon} alt="Toggle Background" />
                </button>
                <button onClick={handleClear}>
                    <img src={clearIcon} alt="Clear" />
                </button>
                <button onClick={handleBackToHome}>
                    <img src={homeIcon} alt="Home" />
                </button>
                <div className="slider-wrapper">
                    <img src={zoomOutIcon} alt="Zoom Out" />
                    <input
                        type="range"
                        min="15"
                        max="75"
                        step="2.5"
                        value={Settings.renderSize}
                        onChange={(e) => {
                            Settings.renderSize = Number(e.target.value);
                        }}
                    />
                    <img src={zoomInIcon} alt="Zoom In" />
                </div>
            </div>
            <div className="component-settings">
                {/* Placeholder for future component settings controls */}
            </div>
        </div>
    );
}

export default TopBar;
