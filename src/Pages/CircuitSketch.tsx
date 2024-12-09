import SceneRendererComponent from "Scene/SceneRendererComponent";
import Scene from "Scene/Scene";
import TopBar from "Pages/TopBar";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


const CircuitSketch: React.FC = () => {
    return (
        <div style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', height: 'calc(10vh)'}}>
                <TopBar></TopBar>
            </div>
            <div style={{display: 'flex', height: 'calc(89.5vh)'}}>
                <SceneRendererComponent></SceneRendererComponent>
            </div>
        </div>

    );
};

export default CircuitSketch;