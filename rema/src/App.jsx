import React from 'react';
import Component from './Component';
import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1 style={{ fontSize: '200px' }}>ReMa.</h1>
      </div>


      {/* Include your simplified Component here */}
      <Component width={1000} text1="August 17, 2024" text2="Title of my research" text3="authors and friends" text4="journal where applied" text5="publisher" />
      <br></br>
      <Component width={1000} text1="August 17, 2024" text2="Title of my research" text3="authors and friends" text4="journal where applied" text5="publisher" />
      <br></br>
      <Component width={1000} text1="August 17, 2024" text2="Title of my research" text3="authors and friends" text4="journal where applied" text5="publisher" />
      <br></br>
      <Component width={1000} text1="August 17, 2024" text2="Title of my research" text3="authors and friends" text4="journal where applied" text5="publisher" />
      <br></br>
      <Component width={1000} text1="August 17, 2024" text2="Title of my research" text3="authors and friends" text4="journal where applied" text5="publisher" />
      <br></br>

    </>
  );
}

export default App;
