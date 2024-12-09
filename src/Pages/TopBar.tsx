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
import resetIcon from 'assets/icons/reset.png';
import deleteIcon from 'assets/icons/delete.png';
import clearIcon from 'assets/icons/clear.png';
import homeIcon from 'assets/icons/home.png';
import uploadIcon from 'assets/icons/upload.png';
import zoomInIcon from 'assets/icons/zoom_in.png';
import zoomOutIcon from 'assets/icons/zoom_out.png';
import mirrorIcon from 'assets/icons/mirror.png';
import mirror2Icon from 'assets/icons/mirror2.png';
import checkIcon from 'assets/icons/check.png';
import EditModeSelector from "Pages/EditModeSelector";
import Component from "Components/Component";

const TopBar: React.FC = () => {
    const [canUndo, setCanUndo] = useState(Settings.sceneHistory.canUndo());
    const [canRedo, setCanRedo] = useState(Settings.sceneHistory.canRedo());
    const [renderSize, setRenderSize] = useState(Settings.renderSize);
    const [component, setComponent] = useState(Settings.selectedComponent);
    const [tag, setTag] = useState(component?.tag || "");

    useEffect(() => {
        const handleSettingsChange = () => {
            setCanUndo(Settings.sceneHistory.canUndo());
            setCanRedo(Settings.sceneHistory.canRedo());
            setRenderSize(Settings.renderSize);
            setComponent(Settings.selectedComponent);
            setTag(Settings.selectedComponent?.tag || ""); // Update the tag state
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

    const handleReset = () => {
        Settings.sceneHistory.addState(new Scene());
    };

    const handleBackToHome = () => {
        Settings.renderOffset = Settings.scene.getComponentCentroid().negate().add(Settings.aspectRatio.multiply(Settings.renderSize * 0.5));
    };


    //individual components

    const handleFlip = () => {
        if (Settings.selectedComponent) {
            Settings.selectedComponent.flip();
        }
    };

    const handleClear = () => {
        Settings.selectedComponent = undefined;
    };

    const handleDelete = () => {
        if (Settings.selectedComponent) {
            Settings.scene.removeObject(Settings.selectedComponent);
        }
    };

    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTag(event.target.value); // Update the local tag state
    };

    const handleConfirmTag = () => {
        Settings.scene.updateComponentTag(component, tag);
    }

    const handleFlipTag = () => {
        if (Settings.selectedComponent) {
            Settings.selectedComponent.flipTag();
        }
    };

    return (
        <div className="top-bar">
            <div className="global-settings">
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
                <button onClick={handleReset}>
                    <img src={resetIcon} alt="Clear" />
                </button>

                <div className="vertical-line"/>

                <button onClick={handleUndo} disabled={!canUndo}>
                    <img src={undoIcon} alt="Undo" />
                </button>
                <button onClick={handleRedo} disabled={!canRedo}>
                    <img src={redoIcon} alt="Redo" />
                </button>
                <div className="vertical-line"/>

                <button onClick={handleToggleBackground}>
                    <img src={toggleIcon} alt="Toggle Background" />
                </button>
                <button onClick={handleBackToHome}>
                    <img src={homeIcon} alt="Home" />
                </button>
                <div className="slider-wrapper">
                    <img src={zoomInIcon} alt="Zoom In" />
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
                    <img src={zoomOutIcon} alt="Zoom Out" />
                </div>
                <div className="vertical-line"/>
                <EditModeSelector></EditModeSelector>
            </div>

            {component &&
                (<div className="component-settings">
                    <div className="vertical-line"/>
                    <button onClick={handleClear}>
                        <img src={clearIcon} alt="Clear" />
                    </button>
                    <button onClick={handleFlip}>
                        <img src={mirrorIcon} alt="Flip" />
                    </button>
                    <div className="vertical-line"/>
                    <button onClick={handleDelete} style={{backgroundColor: "red"}}>
                        <img src={deleteIcon} alt="Delete" />
                    </button>
                    <div className="vertical-line"/>
                    <input
                        type="text"
                        placeholder="Tag"
                        value={tag} // Bind to local state
                        onChange={handleTagChange} // Update local state on change
                        style={{ width: '100px', height: '30px', marginLeft: '10px' }}
                    />
                    <button onClick={handleConfirmTag}>
                        <img src={checkIcon} alt="Confirm" />
                    </button>
                    <button onClick={handleFlipTag}>
                        <img src={mirror2Icon} alt="FlipTag" />
                    </button>
                </div>)
            }

        </div>
    );
}

export default TopBar;
