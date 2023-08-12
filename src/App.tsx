import { useEffect, useState } from "react";
import "./App.css";
import { transpose } from "chord-transposer";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [originalKey, setOriginalKey] = useState("?");
  const [newKey, setNewKey] = useState("?");
  const [showCopyIndicator, setShowCopyIndicator] = useState(false);

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
    navigator.clipboard.writeText(output);
    setShowCopyIndicator(true);
    setTimeout(() => setShowCopyIndicator(false), 250);
  }

  useEffect(() => {
    setNewKey(getKey(output));
  }, [output]);

  return (
    <>
      <section className="controls">
        <div className="original-key">
          Original key: <strong>{originalKey}</strong>
        </div>
        <button onClick={() => transposeDown()}>Transpose ⬇️</button>
        <button onClick={() => transposeUp()}>Transpose ⬆️</button>
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

        <textarea
          className={`output ${showCopyIndicator && "green"}`}
          readOnly
          value={output}
          onClick={copyText}
        ></textarea>
      </section>
    </>
  );
}

export default App;
