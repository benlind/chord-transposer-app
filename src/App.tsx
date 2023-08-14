import { useEffect, useState } from "react";
import "./App.css";
import { transpose } from "chord-transposer";
import gitHubLogoBlack from './assets/github-mark-black.svg'
import gitHubLogoWhite from './assets/github-mark-white.svg'

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [originalKey, setOriginalKey] = useState("?");
  const [newKey, setNewKey] = useState("?");
  const [showCopiedBorder, setShowCopiedBorder] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  function getKey(input: string) {
    try {
      return transpose(input).getKey().majorKey;
    } catch (error) {
      return "?";
    }
  }

  function getTransposer() {
    return transpose(output || input);
  }

  function transposeUp() {
    setOutput(getTransposer().up(1).toString());
  }

  function transposeDown() {
    setOutput(getTransposer().down(1).toString());
  }

  function onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = event.target.value;
    setOriginalKey(getKey(newValue));
    setInput(newValue);
  }

  function copyText() {
    if (!output.trim()) {
      return
    }
    navigator.clipboard.writeText(output);
    setShowCopiedBorder(true);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedBorder(false), 250);
    setTimeout(() => setShowCopiedMessage(false), 1250);
  }

  useEffect(() => {
    setNewKey(getKey(output));
  }, [output]);

  return (
    <>
      <header>
        <a className="github" href="https://github.com/benlind/chord-transposer-app" target="_blank">
          <img className="white" src={gitHubLogoWhite} alt="GitHub" />
          <img className="black" src={gitHubLogoBlack} alt="GitHub" />
        </a>
        <h1>Chord Transposer</h1>
        <p>Paste a song chord sheet into the left box, then use the buttons to transpose.</p>
      </header>
      <section className="controls">
        <div className="original-key">
          Original key: <strong>{originalKey}</strong>
        </div>
        <button onClick={() => transposeDown()}>Transpose Down ⬇️</button>
        <button onClick={() => transposeUp()}>Transpose Up ⬆️</button>
        <div className="new-key">
          New key: <strong>{newKey}</strong>
        </div>
      </section>

      <section className="input-output">
        <textarea
          value={input}
          onChange={onTextChange}
          className="input"
          placeholder="Paste your chord sheet here"
        ></textarea>

        <div className='output'>
          <div className={`copied button ${showCopiedMessage && "show"}`}>✅ Copied to clipboard</div>
          <textarea
            className={`${showCopiedBorder && "green"}`}
            readOnly
            value={output}
            onClick={copyText}
            placeholder='The transposed sheet will appear here'
          ></textarea>
        </div>
      </section>
    </>
  );
}

export default App;
