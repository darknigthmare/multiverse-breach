import React, { Suspense, useState } from 'react';
const App = React.lazy(() => import('../App.jsx'));
const AuthCallbackScreen = React.lazy(() => import('./AuthCallbackScreen.jsx'));

class StartupBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (!this.state.error) return this.props.children;
    return <main className="narrative-screen" role="alert"><h1>Chargement interrompu / Loading interrupted</h1><p>La sauvegarde reste conservee. / Your save is preserved.</p><button type="button" className="btn-retro" onClick={() => window.location.reload()}>Recharger / Reload</button></main>;
  }
}

export default function AppBootstrap({ recoveryFlow = null }) {
  const [flow, setFlow] = useState(recoveryFlow);
  return <StartupBoundary><Suspense fallback={<p role="status">Chargement du Nexus / Loading Nexus…</p>}>
    {flow ? <AuthCallbackScreen flow={flow} onExit={() => setFlow(null)} /> : <App />}
  </Suspense></StartupBoundary>;
}
