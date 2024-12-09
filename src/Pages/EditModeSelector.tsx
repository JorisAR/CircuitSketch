import React, { useEffect, useState } from 'react';
import Settings, { EditMode } from 'Settings/Settings';
import './EditModeSelector.css';

// Import the images
import pointerIcon from 'assets/icons/pointer.png';
import pencilIcon from 'assets/icons/pencil.png';
import eraserIcon from 'assets/icons/eraser.png';

const EditModeSelector: React.FC = () => {
    const [editMode, setEditMode] = useState(Settings.editMode);

    useEffect(() => {
        const handleSettingsChange = () => {
            setEditMode(Settings.editMode);
        };

        Settings.on('change', handleSettingsChange);

        return () => {
            Settings.off('change', handleSettingsChange);
        };
    }, []);

    const handleSelectMode = (mode: EditMode) => {
        Settings.editMode = mode;
        Settings.emit('change'); // Emit change event to update state
    };

    return (
        <div className="edit-mode-selector">
            <button
                className={editMode === EditMode.SELECT ? 'selected' : ''}
                onClick={() => handleSelectMode(EditMode.SELECT)}
            >
                <img src={pointerIcon} alt="Select" />
            </button>
            <button
                className={editMode === EditMode.DRAW ? 'selected' : ''}
                onClick={() => handleSelectMode(EditMode.DRAW)}
            >
                <img src={pencilIcon} alt="Draw" />
            </button>
            <button
                className={editMode === EditMode.ERASE ? 'selected' : ''}
                onClick={() => handleSelectMode(EditMode.ERASE)}
            >
                <img src={eraserIcon} alt="Erase" />
            </button>
        </div>
    );
};

export default EditModeSelector;
