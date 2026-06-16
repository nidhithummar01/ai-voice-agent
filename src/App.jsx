import { useState } from "react";

const callScript = [
  ["Agent", "Hi, this is Ava from Neoteq AI. I am calling about your product demo request. Is now a good time?"],
  ["Lead", "Yes, I have two minutes."],
  ["Agent", "Great. Are you looking for an inbound support agent, outbound sales calls, or both?"],
  ["Lead", "Outbound qualification first, then support."],
  ["Agent", "Perfect. I will mark this as a sales qualification workflow and send a meeting link to your CRM contact."],
];

export default function App() {
  const [callState, setCallState] = useState("Ready");
  const [lines, setLines] = useState([
    ["System", "Press “Start Demo Call + Listen” to hear the prototype agent."],
  ]);

  function appendLine(role, text) {
    setLines((current) => [...current, [role, text]]);
  }

  function speakLine(index = 0) {
    if (index >= callScript.length) {
      setCallState("Completed");
      appendLine("System", "Call summary saved. CRM task created. Follow-up email queued.");
      return;
    }

    const [role, text] = callScript[index];
    appendLine(role, text);

    if (role === "Agent" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => setTimeout(() => speakLine(index + 1), 650);
      window.speechSynthesis.speak(utterance);
      return;
    }

    setTimeout(() => speakLine(index + 1), 1300);
  }

  function startCall() {
    window.speechSynthesis?.cancel();
    setLines([]);
    setCallState("Live call");
    speakLine();
  }

  function stopCall() {
    window.speechSynthesis?.cancel();
    setCallState("Ended");
    appendLine("System", "Call ended by user.");
  }

  return (
    <>
      <header>
        <div className="wrap logo">
          <span className="mark" />
          Neoteq AI / Voice Agent Demo
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <div>
            <span className="tag">Live Prototype</span>
            <h1>AI Voice Agent Platform</h1>
          </div>
          <p className="lede">
            Browser prototype for an outbound/inbound AI calling product. Start the demo call to hear
            the agent, watch the transcript, and review campaign/CRM signals.
          </p>
        </section>

        <section className="grid">
          <div className="panel phone">
            <div className="status">
              <span>{callState}</span>
              <span>Sub-second voice flow</span>
            </div>
            <div className="number">+1 (555) 019-2026</div>
            <p className="sub">
              Demo persona: Neoteq sales qualification agent. Voice playback uses your browser speech engine.
            </p>

            <div className="agent-card">
              <div className="agent-avatar" aria-hidden="true">
                <span />
              </div>
              <div>
                <p className="agent-label">AI Agent</p>
                <h2>Ava Qualification Agent</h2>
                <p className="sub">Listens, answers, qualifies, and writes the CRM follow-up.</p>
              </div>
            </div>

            <div className="call-features">
              <div><strong>Live transcript</strong><span>Every spoken turn captured.</span></div>
              <div><strong>Intent routing</strong><span>Sales, support, or booking.</span></div>
              <div><strong>CRM sync</strong><span>Summary and task queued.</span></div>
            </div>

            <div className="actions">
              <button onClick={startCall}>Start Demo Call + Listen</button>
              <button id="stopCall" onClick={stopCall}>End Call</button>
            </div>
          </div>

          <div className="panel">
            <span className="tag">Campaign Console</span>
            <h2>Outbound qualification, CRM sync, live transcript.</h2>
            <div className="cards">
              <div className="card"><strong>312</strong> Calls queued</div>
              <div className="card"><strong>41%</strong> Qualified leads</div>
              <div className="card"><strong>10+</strong> Languages</div>
            </div>
            <div className="transcript">
              {lines.map(([role, text], index) => (
                <p className="line" key={`${role}-${index}`}>
                  <b>{role}</b><br />
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
