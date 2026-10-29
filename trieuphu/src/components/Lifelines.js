const Lifelines = ({ used, disabled, onFifty, onAudience, onQuit }) => (
  <div className="lifelines">
    <button disabled={disabled || used.fifty} onClick={onFifty}>
      50:50
    </button>
    <button disabled={disabled || used.audience} onClick={onAudience}>
      Hỏi khán giả
    </button>
    <button disabled={disabled} onClick={onQuit}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;