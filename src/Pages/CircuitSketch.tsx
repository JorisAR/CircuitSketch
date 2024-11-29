import SceneRendererComponent from "Scene/SceneRendererComponent";
import Scene from "Scene/Scene";
import TopBar from "Pages/TopBar";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


const CircuitSketch: React.FC = () => {
    return (
        <div>
            <div style={{display: 'flex', height: 'calc(10vh)'}}>
                <TopBar></TopBar>
            </div>
            <div style={{display: 'flex', height: 'calc(100vh - 10vh)'}}>
                <SceneRendererComponent></SceneRendererComponent>
            </div>
        </div>

    );
};

export default CircuitSketch;