import React, { useState } from 'react';

function VirtualCalculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const result = eval(input);
      setInput(String(result));
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.calculator}>
        <div style={styles.display}>{input || '0'}</div>
        <div style={styles.keypad}>
          <button style={{ ...styles.button, ...styles.clearBtn }} onClick={handleClear}>C</button>
          <button style={styles.button} onClick={handleDelete}>DEL</button>
          <button style={styles.button} onClick={() => handleClick('/')}>/</button>
          <button style={styles.button} onClick={() => handleClick('x')}>x</button>

          <button style={styles.button} onClick={() => handleClick('7')}>7</button>
          <button style={styles.button} onClick={() => handleClick('8')}>8</button>
          <button style={styles.button} onClick={() => handleClick('9')}>9</button>
          <button style={styles.button} onClick={() => handleClick('-')}>-</button>

          <button style={styles.button} onClick={() => handleClick('4')}>4</button>
          <button style={styles.button} onClick={() => handleClick('5')}>5</button>
          <button style={styles.button} onClick={() => handleClick('6')}>6</button>
          <button style={styles.button} onClick={() => handleClick('+')}>+</button>

          <button style={styles.button} onClick={() => handleClick('1')}>1</button>
          <button style={styles.button} onClick={() => handleClick('2')}>2</button>
          <button style={styles.button} onClick={() => handleClick('3')}>3</button>
          <button style={{ ...styles.button, ...styles.equalBtn }} onClick={handleCalculate}>=</button>

          <button style={{ ...styles.button, ...styles.zeroBtn }} onClick={() => handleClick('0')}>0</button>
          <button style={styles.button} onClick={() => handleClick('.')}>.</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '200px' },
  calculator: { width: '600px', padding: '40px', borderRadius: '20px', backgroundColor: '#222', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)' },
  display: { width: '100%', height: '100px', backgroundColor: '#111', color: '#0f0', fontSize: '24px', textAlign: 'right', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', marginBottom: '15px', overflow: 'hidden' },
  keypad: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  button: { height: '80px', fontSize: '18px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#333', color: '#fff' },
  clearBtn: { backgroundColor: '#e74c3c' },
  equalBtn: { backgroundColor: '#2ecc71', gridRow: 'span 2', height: '100%' },
  zeroBtn: { gridColumn: 'span 2' }
};

export default VirtualCalculator; 